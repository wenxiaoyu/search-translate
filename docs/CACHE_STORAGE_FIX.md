# Cache Storage Fix

## Problem

错误信息：`Failed to read cache: ReferenceError: localStorage is not defined`

### Root Cause

在 Chrome 扩展的 **background service worker** 中使用了 `localStorage`，但 service worker 不支持 `localStorage` API。

Chrome 扩展有不同的运行环境：
- **Content Script**: 运行在网页上下文，可以访问 `localStorage`
- **Background Service Worker**: 独立的 worker 线程，**不能**访问 `localStorage`
- **Popup/Options**: 运行在扩展页面，可以访问 `localStorage`

## Solution

### 双模式缓存系统

实现了支持不同环境的缓存系统：

1. **Content Script**: 使用 `localStorage`（同步 API）
2. **Background Service Worker**: 使用 `chrome.storage.local`（异步 API）

### API 设计

```typescript
// 同步版本 - 用于 Content Script
export function getCachedTranslation(text: string): string | null
export function setCachedTranslation(text: string, translation: string): void

// 异步版本 - 用于 Background Service Worker
export async function getCachedTranslationAsync(text: string): Promise<string | null>
export async function setCachedTranslationAsync(text: string, translation: string): Promise<void>
```

### 环境检测

```typescript
function isServiceWorker(): boolean {
  return typeof window === 'undefined' || typeof localStorage === 'undefined';
}
```

## Implementation Details

### Content Script (src/content/TranslationManager.ts)

使用同步 API：

```typescript
import { getCachedTranslation, setCachedTranslation } from '../utils/cache';

// 检查缓存
const cached = getCachedTranslation(text);
if (cached) {
  this.showTranslation(cached);
  return;
}

// 保存到缓存
setCachedTranslation(text, result.translation);
```

### Background Service Worker (src/background/index.ts)

使用异步 API：

```typescript
import { getCachedTranslationAsync, setCachedTranslationAsync } from '../utils/cache';

// 检查缓存
const cached = await getCachedTranslationAsync(text);
if (cached) {
  sendResponse({ success: true, translation: cached });
  return;
}

// 保存到缓存
await setCachedTranslationAsync(text, result.translation);
```

## Storage Comparison

| Feature | localStorage | chrome.storage.local |
|---------|-------------|---------------------|
| **API Type** | Synchronous | Asynchronous |
| **Availability** | Content Script, Popup/Options | All contexts |
| **Storage Limit** | ~5-10 MB | ~10 MB (可配置) |
| **Performance** | Fast (sync) | Slightly slower (async) |
| **Persistence** | Per-origin | Per-extension |

## Benefits

1. ✅ **兼容性**: 支持所有 Chrome 扩展上下文
2. ✅ **性能**: Content Script 使用快速的同步 API
3. ✅ **可靠性**: Background Worker 使用正确的存储 API
4. ✅ **一致性**: 两种模式使用相同的缓存键和过期逻辑

## Cache Features

### Expiration
- 30 天自动过期
- 读取时检查过期并自动清理

### LRU Eviction
- 最多保存 1000 条缓存
- 超过限制时删除最旧的条目

### Hash Keys
- 使用简单 hash 函数生成缓存键
- 避免键名冲突
- 格式：`translate_cache_<hash>`

## Testing

### Content Script
```javascript
// 应该成功
const cached = getCachedTranslation('测试');
setCachedTranslation('测试', 'test');
```

### Background Service Worker
```javascript
// 应该成功
const cached = await getCachedTranslationAsync('测试');
await setCachedTranslationAsync('测试', 'test');
```

### Error Handling
```javascript
// 在 service worker 中调用同步 API
getCachedTranslation('测试'); // 返回 null，打印警告
```

## Migration Notes

如果用户已经有 `localStorage` 缓存，它们会继续在 content script 中工作。Background worker 会在 `chrome.storage.local` 中创建新的缓存。

两个缓存是独立的，但这不会造成问题：
- Content script 主要用于显示翻译
- Background worker 主要用于 API 调用和缓存管理
- 两者最终会同步（通过 API 调用）

## Related Files

- `src/utils/cache.ts` - 缓存实现
- `src/background/index.ts` - Background worker 使用
- `src/content/TranslationManager.ts` - Content script 使用
- `src/options/Options.tsx` - Options 页面使用
