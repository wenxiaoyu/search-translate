import type { SearchEngineAdapter } from './SearchEngineAdapter';

/**
 * Google 搜索适配器
 */
export class GoogleAdapter implements SearchEngineAdapter {
  name = 'Google';

  matches(url: string): boolean {
    return url.includes('google.com') || url.includes('google.com.hk');
  }

  getSearchInput(): HTMLInputElement | null {
    // Google 搜索框的多个可能选择器
    const selectors = [
      'input[name="q"]',
      'textarea[name="q"]',
      'input[aria-label*="搜索"]',
      'input[aria-label*="Search"]',
    ];

    for (const selector of selectors) {
      const input = document.querySelector<HTMLInputElement>(selector);
      if (input && input.offsetParent !== null) {
        return input;
      }
    }

    return null;
  }

  getSearchButton(): HTMLButtonElement | HTMLInputElement | null {
    // Google 搜索按钮的多个可能选择器
    const selectors = [
      'button[aria-label*="搜索"]',
      'button[aria-label*="Search"]',
      'input[type="submit"][value*="搜索"]',
      'input[type="submit"][value*="Search"]',
      'button.Tg7LZd', // Google 搜索按钮类名
    ];

    for (const selector of selectors) {
      const button = document.querySelector<HTMLButtonElement | HTMLInputElement>(selector);
      if (button && button.offsetParent !== null) {
        return button;
      }
    }

    return null;
  }

  getInsertPosition(): HTMLElement | null {
    const input = this.getSearchInput();
    if (!input) return null;

    // 查找搜索框的容器
    return input.closest('form') || input.parentElement;
  }

  getSuggestionContainer(): HTMLElement | null {
    // Google 的建议容器选择器
    const selectors = [
      'div[role="listbox"]',
      'ul[role="listbox"]',
      '.erkvQe', // Google 建议容器类名
      '.aajZCb', // 备用类名
    ];

    for (const selector of selectors) {
      const container = document.querySelector<HTMLElement>(selector);
      if (container && container.offsetParent !== null) {
        return container;
      }
    }

    return null;
  }

  createSuggestionItem(translation: string, onClick: () => void): HTMLElement {
    const item = document.createElement('li');
    item.className = 'sbct PZPZlf'; // Google 建议项的类名
    item.setAttribute('role', 'option');
    item.style.cssText = `
      cursor: pointer;
      padding: 6px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-left: 3px solid #1a73e8;
      min-height: 32px;
      transition: background-color 0.15s ease, box-shadow 0.15s ease;
    `;

    // 左侧内容容器（图标 + 文本）
    const leftContent = document.createElement('div');
    leftContent.style.cssText = `
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
    `;

    // 搜索图标
    const searchIcon = document.createElement('span');
    searchIcon.textContent = '🔍';
    searchIcon.style.cssText = 'font-size: 15px; flex-shrink: 0; line-height: 1; opacity: 0.7;';

    // 翻译文本
    const text = document.createElement('span');
    text.textContent = translation;
    text.style.cssText = `
      color: #202124;
      font-size: 14px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    `;

    leftContent.appendChild(searchIcon);
    leftContent.appendChild(text);

    // 来源标识（右侧）
    const source = document.createElement('span');
    source.textContent = 'Search Translate';
    source.style.cssText = `
      color: #5f6368;
      font-size: 11px;
      line-height: 20px;
      flex-shrink: 0;
      margin-left: 16px;
      white-space: nowrap;
      opacity: 0.8;
    `;

    item.appendChild(leftContent);
    item.appendChild(source);

    // 悬停效果
    item.addEventListener('mouseenter', () => {
      item.style.background = '#f1f3f4';
      item.style.boxShadow = 'inset 0 0 0 1px rgba(26, 115, 232, 0.1)';
      searchIcon.style.opacity = '1';
      source.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '#ffffff';
      item.style.boxShadow = 'none';
      searchIcon.style.opacity = '0.7';
      source.style.opacity = '0.8';
    });

    item.addEventListener('click', onClick);

    return item;
  }
}
