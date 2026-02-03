// Content Script - runs in the context of web pages
import { AdapterFactory } from './adapters/AdapterFactory';
import { TranslationManager } from './TranslationManager';

let translationManager: TranslationManager | null = null;
let isInitializing = false; // 防止并发初始化

/**
 * 初始化翻译功能
 */
function initTranslation() {
  // 防止并发初始化
  if (isInitializing) {
    return;
  }
  
  isInitializing = true;
  
  try {
    // 检查是否支持当前网站
    const adapter = AdapterFactory.getAdapter();
    if (!adapter) {
      return;
    }

    // 创建翻译管理器
    translationManager = new TranslationManager(adapter);
    translationManager.init();
  } finally {
    isInitializing = false;
  }
}

/**
 * 使用 MutationObserver 监听动态加载的搜索框
 * 持续监听，支持 SPA 页面导航
 */
function observeSearchInput() {
  const adapter = AdapterFactory.getAdapter();
  if (!adapter) return;

  let checkTimer: number | null = null;
  let lastInput: HTMLInputElement | null = null;
  let lastVisible: boolean = false;

  const observer = new MutationObserver(() => {
    // 使用防抖避免频繁检查
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    checkTimer = window.setTimeout(() => {
      const input = adapter.getSearchInput();
      const isVisible = input ? input.offsetParent !== null : false;
      
      // 检查搜索框是否变化（元素变化或可见性变化）
      if (input && (input !== lastInput || isVisible !== lastVisible)) {
        // 清理旧实例
        if (translationManager) {
          translationManager.destroy();
          translationManager = null;
        }
        
        // 重新初始化
        lastInput = input;
        lastVisible = isVisible;
        initTranslation();
      } else if (!input && translationManager) {
        // 搜索框消失了（页面导航），清理旧实例
        translationManager.destroy();
        translationManager = null;
        lastInput = null;
        lastVisible = false;
      }
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden'],
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTranslation();
    // 总是启动观察器，支持 SPA 导航
    observeSearchInput();
  });
} else {
  initTranslation();
  // 总是启动观察器，支持 SPA 导航
  observeSearchInput();
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'TOGGLE_TRANSLATION') {
    if (translationManager) {
      translationManager.setEnabled(message.payload.enabled);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Not initialized' });
    }
  }

  return true;
});

// 原有的示例代码保留(可选)
// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GREETING') {
    // Show a notification on the page
    showNotification(message.payload.message)

    sendResponse({ success: true, message: 'Message received by content script' })
  }

  return true
})

// Example: Add a visual notification to the page
function showNotification(message: string) {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `

  // Add animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Example: Send a message to background on page load
chrome.runtime.sendMessage(
  {
    type: 'PAGE_LOADED',
    payload: { url: window.location.href },
  },
  () => {
    // Silent - no logging needed
  }
)
