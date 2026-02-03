import type { SearchEngineAdapter } from './SearchEngineAdapter';

/**
 * Stack Overflow 搜索适配器
 */
export class StackOverflowAdapter implements SearchEngineAdapter {
  name = 'Stack Overflow';
  
  // Stack Overflow 的搜索建议是动态创建的，使用独立浮层更可靠
  preferStandaloneOverlay = true;

  matches(url: string): boolean {
    return url.includes('stackoverflow.com') || url.includes('stackexchange.com');
  }

  getSearchInput(): HTMLInputElement | null {
    // Stack Overflow 搜索框选择器
    const selectors = [
      // 主搜索框
      'input[name="q"]',
      'input.s-input[type="text"]',
      
      // 顶部搜索栏
      'input[placeholder*="Search"]',
      'input[aria-label*="Search"]',
      
      // 移动端搜索
      'input.js-search-field',
    ];

    for (const selector of selectors) {
      const input = document.querySelector<HTMLInputElement>(selector);
      // 检查元素是否可见且可交互
      if (input && input.offsetParent !== null && !input.disabled) {
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
    // Stack Overflow 的搜索建议容器通常是动态创建的
    // 只在用户输入时才出现，所以我们需要更灵活的检测
    
    const selectors = [
      // 新版搜索建议（Stacks 设计系统）
      '.s-popover.js-search-hints',
      '.s-popover.s-popover__tooltip',
      
      // 搜索自动完成
      '.s-popover[role="menu"]',
      '.s-popover[role="listbox"]',
      
      // 旧版自动完成
      '.autocomplete-results',
      '.search-hints',
      
      // 通用列表框
      'ul[role="listbox"]',
      'div[role="listbox"]',
    ];

    for (const selector of selectors) {
      const container = document.querySelector<HTMLElement>(selector);
      if (container) {
        // 不检查 offsetParent，因为容器可能初始时隐藏
        // 只要容器存在就返回，即使它当前不可见
        return container;
      }
    }

    // Stack Overflow 的建议容器可能还未创建
    // 返回 null 使用独立浮层模式（更可靠）
    return null;
  }

  createSuggestionItem(translation: string, onClick: () => void): HTMLElement {
    const item = document.createElement('li');
    item.className = 's-block-link';
    item.setAttribute('role', 'option');
    item.style.cssText = `
      cursor: pointer;
      padding: 6px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-left: 3px solid #f48024;
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
      color: #232629;
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
      color: #6a737c;
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
      item.style.background = '#f1f2f3';
      item.style.boxShadow = 'inset 0 0 0 1px rgba(244, 128, 36, 0.1)';
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
