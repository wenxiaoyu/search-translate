/**
 * 翻译缓存管理
 * 
 * 注意：此模块在不同上下文中使用不同的存储方式：
 * - Content Script: 使用 localStorage
 * - Background Service Worker: 使用 chrome.storage.local
 */

export interface CacheEntry {
  source: string;
  translation: string;
  timestamp: number;
}

const CACHE_PREFIX = 'translate_cache_';
const CACHE_EXPIRY_DAYS = 30;
const MAX_CACHE_ENTRIES = 1000;

/**
 * 检测当前运行环境
 */
function isServiceWorker(): boolean {
  return typeof window === 'undefined' || typeof localStorage === 'undefined';
}

/**
 * 简单的 hash 函数(替代 MD5)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * 生成缓存键
 */
function getCacheKey(text: string): string {
  return `${CACHE_PREFIX}${simpleHash(text)}`;
}

/**
 * 检查缓存是否过期
 */
function isExpired(timestamp: number): boolean {
  const now = Date.now();
  const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return now - timestamp > expiryMs;
}

/**
 * 从缓存读取翻译（异步版本，用于 service worker）
 */
export async function getCachedTranslationAsync(text: string): Promise<string | null> {
  try {
    const key = getCacheKey(text);
    const result = await chrome.storage.local.get(key);
    
    if (!result[key]) {
      return null;
    }

    const entry = result[key] as CacheEntry;
    
    if (isExpired(entry.timestamp)) {
      await chrome.storage.local.remove(key);
      return null;
    }

    return entry.translation;
  } catch (error) {
    console.error('Failed to read cache (async):', error);
    return null;
  }
}

/**
 * 保存翻译到缓存（异步版本，用于 service worker）
 */
export async function setCachedTranslationAsync(text: string, translation: string): Promise<void> {
  try {
    const key = getCacheKey(text);
    const entry: CacheEntry = {
      source: text,
      translation,
      timestamp: Date.now(),
    };
    
    await chrome.storage.local.set({ [key]: entry });
    
    // 异步清理旧缓存（不等待完成）
    cleanupOldCacheAsync().catch(err => console.error('Cache cleanup failed:', err));
  } catch (error) {
    console.error('Failed to save cache (async):', error);
  }
}

/**
 * 从缓存读取翻译（同步版本，用于 content script）
 */
export function getCachedTranslation(text: string): string | null {
  if (isServiceWorker()) {
    console.warn('getCachedTranslation called in service worker context, use getCachedTranslationAsync instead');
    return null;
  }

  try {
    const key = getCacheKey(text);
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);
    
    if (isExpired(entry.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.translation;
  } catch (error) {
    console.error('Failed to read cache:', error);
    return null;
  }
}

/**
 * 保存翻译到缓存（同步版本，用于 content script）
 */
export function setCachedTranslation(text: string, translation: string): void {
  if (isServiceWorker()) {
    console.warn('setCachedTranslation called in service worker context, use setCachedTranslationAsync instead');
    return;
  }

  try {
    const key = getCacheKey(text);
    const entry: CacheEntry = {
      source: text,
      translation,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(key, JSON.stringify(entry));
    
    // 检查缓存数量,超过限制则清理最旧的
    cleanupOldCache();
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
}

/**
 * 清理过期和超量的缓存（同步版本）
 */
function cleanupOldCache(): void {
  try {
    const cacheKeys: Array<{ key: string; timestamp: number }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          
          if (isExpired(entry.timestamp)) {
            localStorage.removeItem(key);
          } else {
            cacheKeys.push({ key, timestamp: entry.timestamp });
          }
        }
      }
    }
    
    // 如果超过最大数量,删除最旧的
    if (cacheKeys.length > MAX_CACHE_ENTRIES) {
      cacheKeys.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = cacheKeys.slice(0, cacheKeys.length - MAX_CACHE_ENTRIES);
      toRemove.forEach(({ key }) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Failed to cleanup cache:', error);
  }
}

/**
 * 清理过期和超量的缓存（异步版本）
 */
async function cleanupOldCacheAsync(): Promise<void> {
  try {
    const allData = await chrome.storage.local.get(null);
    const cacheKeys: Array<{ key: string; timestamp: number }> = [];
    const keysToRemove: string[] = [];
    
    for (const key in allData) {
      if (key.startsWith(CACHE_PREFIX)) {
        const entry = allData[key] as CacheEntry;
        
        if (isExpired(entry.timestamp)) {
          keysToRemove.push(key);
        } else {
          cacheKeys.push({ key, timestamp: entry.timestamp });
        }
      }
    }
    
    // 删除过期的
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
    }
    
    // 如果超过最大数量,删除最旧的
    if (cacheKeys.length > MAX_CACHE_ENTRIES) {
      cacheKeys.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = cacheKeys.slice(0, cacheKeys.length - MAX_CACHE_ENTRIES);
      await chrome.storage.local.remove(toRemove.map(({ key }) => key));
    }
  } catch (error) {
    console.error('Failed to cleanup cache (async):', error);
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): { count: number; size: number } {
  let count = 0;
  let size = 0;
  
  if (isServiceWorker()) {
    console.warn('getCacheStats not supported in service worker context');
    return { count, size };
  }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        count++;
        const value = localStorage.getItem(key);
        if (value) {
          size += value.length;
        }
      }
    }
  } catch (error) {
    console.error('Failed to get cache stats:', error);
  }
  
  return { count, size };
}

/**
 * 清空所有翻译缓存
 */
export function clearAllCache(): void {
  if (isServiceWorker()) {
    console.warn('clearAllCache not supported in service worker context');
    return;
  }

  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}
