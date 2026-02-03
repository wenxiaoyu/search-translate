import type { SearchEngineAdapter } from './SearchEngineAdapter';

/**
 * GitHub 搜索适配器
 */
export class GitHubAdapter implements SearchEngineAdapter {
  name = 'GitHub';

  matches(url: string): boolean {
    return url.includes('github.com');
  }

  getSearchInput(): HTMLInputElement | null {
    // GitHub 有多个搜索界面，按优先级尝试
    const selectors = [
      // 搜索结果页面的搜索框
      'input#query-builder-test',
      'input[data-target="query-builder.input"]',
      'input.js-site-search-focus',
      
      // 仓库内搜索
      'input[name="q"][type="text"]',
      
      // 全局搜索（头部）
      'input.header-search-input',
      'input[data-target="qbsearch-input.inputButtonText"]',
      
      // 通用搜索框
      'input[type="text"][placeholder*="Search"]',
      'input[aria-label*="Search"]',
      'input[type="search"]',
    ];

    for (const selector of selectors) {
      const input = document.querySelector<HTMLInputElement>(selector);
      // GitHub 的搜索框可能初始时隐藏，所以不检查 offsetParent
      // 只检查元素存在且未禁用
      if (input && !input.disabled) {
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
    // GitHub 的建议容器选择器（按优先级）
    const selectors = [
      // 新版搜索建议
      '[data-target="qbsearch-input.results"]',
      '.jump-to-suggestions',
      
      // 代码搜索建议
      '[data-testid="search-suggestions"]',
      '[data-jump-to-suggestions-results]',
      
      // 通用自动完成
      '.autocomplete-results',
      'ul[role="listbox"]',
    ];

    for (const selector of selectors) {
      const container = document.querySelector<HTMLElement>(selector);
      // 检查容器是否存在、可见且有合适的结构
      if (container && container.offsetParent !== null) {
        return container;
      }
    }

    // GitHub 的建议容器可能不存在、不可见或不适合集成
    // 返回 null 让 TranslationManager 降级到独立浮层模式
    return null;
  }

  createSuggestionItem(translation: string, onClick: () => void): HTMLElement {
    const item = document.createElement('li');
    item.className = 'jump-to-suggestion';
    item.setAttribute('role', 'option');
    item.style.cssText = `
      cursor: pointer;
      padding: 6px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-left: 3px solid #1f6feb;
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
      color: #24292f;
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
      color: #57606a;
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
      item.style.background = '#f6f8fa';
      item.style.boxShadow = 'inset 0 0 0 1px rgba(31, 111, 235, 0.1)';
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
