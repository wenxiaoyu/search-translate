import type { SearchEngineAdapter } from './SearchEngineAdapter';

/**
 * Bing 搜索适配器
 */
export class BingAdapter implements SearchEngineAdapter {
  name = 'Bing';

  matches(url: string): boolean {
    return url.includes('bing.com');
  }

  getSearchInput(): HTMLInputElement | null {
    // Bing 主搜索框的优先级选择器
    const selectors = [
      // 主搜索框（最高优先级）
      'input#sb_form_q',
      // 备用：通过 name 属性查找，但要确保是主搜索框
      'form#sb_form input[name="q"]',
      'textarea[name="q"]',
    ];

    for (const selector of selectors) {
      const input = document.querySelector<HTMLInputElement>(selector);
      if (input && input.offsetParent !== null) {
        return input;
      }
    }

    return null;
  }

  getInsertPosition(): HTMLElement | null {
    const input = this.getSearchInput();
    if (!input) return null;

    return input.closest('form') || input.parentElement;
  }

  getSuggestionContainer(): HTMLElement | null {
    // Bing 的建议容器选择器
    const selectors = [
      '.sa_drw',
      '#sa_ul',
      'ul[role="listbox"]',
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
    item.className = 'sa_sg';
    item.setAttribute('role', 'option');
    item.style.cssText = `
      cursor: pointer;
      padding: 6px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-left: 3px solid #0067b8;
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
      color: #1a1a1a;
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
      color: #605e5c;
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
      item.style.background = '#f3f2f1';
      item.style.boxShadow = 'inset 0 0 0 1px rgba(0, 103, 184, 0.1)';
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
