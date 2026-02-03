// Background Service Worker
import { translateText } from '../utils/translationApi';
import { getCachedTranslationAsync, setCachedTranslationAsync } from '../utils/cache';

console.log('Background service worker loaded')

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason)

  if (details.reason === 'install') {
    // Initialize storage on first install
    chrome.storage.local.set({ count: 0 })
    
    // 初始化翻译功能配置
    chrome.storage.sync.set({
      translationEnabled: true,
      enabledSites: {
        google: true,
        baidu: true,
        bing: true,
        github: true,
      },
    });
    
    console.log('Extension installed, storage initialized')
  } else if (details.reason === 'update') {
    console.log('Extension updated to version:', chrome.runtime.getManifest().version)
  }
})

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message)

  // 处理翻译请求
  if (message.type === 'TRANSLATE') {
    handleTranslateRequest(message.payload, sendResponse);
    return true; // 异步响应
  }

  if (message.type === 'GREETING') {
    console.log('Greeting from:', sender.tab?.id || 'popup')
    sendResponse({ success: true, message: 'Hello from background!' })
  }

  // Return true to indicate we will send a response asynchronously
  return true
})

/**
 * 处理翻译请求
 */
async function handleTranslateRequest(
  payload: { text: string },
  sendResponse: (response: any) => void
) {
  const { text } = payload;

  try {
    // 先检查缓存（使用异步版本）
    const cached = await getCachedTranslationAsync(text);
    if (cached) {
      console.log('[Background] Cache hit for:', text);
      sendResponse({
        success: true,
        translation: cached,
        fromCache: true,
      });
      return;
    }

    // 调用翻译 API（带降级处理）
    console.log('[Background] Translating:', text);
    const result = await translateText(text);

    if (result.success && result.translation) {
      // 保存到缓存（使用异步版本）
      await setCachedTranslationAsync(text, result.translation);
      
      sendResponse({
        success: true,
        translation: result.translation,
        fromCache: false,
        provider: result.provider, // 返回使用的 API 提供商
      });
    } else {
      sendResponse({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('[Background] Translation error:', error);
    sendResponse({
      success: false,
      error: 'unknown',
    });
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url)
  }
})

// Example: Handle browser action click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id)
})
