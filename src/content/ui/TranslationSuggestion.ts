/**
 * 翻译建议浮层组件
 */

const SUGGESTION_ID = 'smart-search-translate-suggestion';

export class TranslationSuggestion {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private onFillCallback: ((text: string) => void) | null = null;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  /**
   * 创建并显示翻译建议
   */
  show(
    translation: string,
    anchorElement: HTMLElement,
    onFill: (text: string) => void
  ): void {
    this.onFillCallback = onFill;
    
    if (!this.container) {
      this.create();
    }

    if (!this.container || !this.shadowRoot) return;

    // 更新内容
    const content = this.shadowRoot.querySelector('.suggestion-content');
    if (content) {
      content.textContent = translation;
    }

    // 定位
    this.position(anchorElement);

    // 显示
    this.container.style.display = 'block';
  }

  /**
   * 显示加载状态
   */
  showLoading(anchorElement: HTMLElement): void {
    if (!this.container) {
      this.create();
    }

    if (!this.container || !this.shadowRoot) return;

    const content = this.shadowRoot.querySelector('.suggestion-content');
    if (content) {
      // 使用 textContent 而不是 innerHTML 以符合 CSP
      content.textContent = '';
      const loadingSpan = document.createElement('span');
      loadingSpan.className = 'loading';
      loadingSpan.textContent = '翻译中...';
      content.appendChild(loadingSpan);
    }

    this.position(anchorElement);
    this.container.style.display = 'block';
  }

  /**
   * 显示错误
   */
  showError(message: string, anchorElement: HTMLElement): void {
    if (!this.container) {
      this.create();
    }

    if (!this.container || !this.shadowRoot) return;

    const content = this.shadowRoot.querySelector('.suggestion-content');
    if (content) {
      // 使用 textContent 而不是 innerHTML 以符合 CSP
      content.textContent = '';
      const errorSpan = document.createElement('span');
      errorSpan.className = 'error';
      errorSpan.textContent = message;
      content.appendChild(errorSpan);
    }

    this.position(anchorElement);
    this.container.style.display = 'block';

    // 3 秒后自动隐藏
    setTimeout(() => this.hide(), 3000);
  }

  /**
   * 隐藏浮层
   */
  hide(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * 销毁组件
   */
  destroy(): void {
    this.unbindDragEvents();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.shadowRoot = null;
    this.onFillCallback = null;
  }

  /**
   * 创建 DOM 结构
   */
  private create(): void {
    // 先移除已存在的容器（防止重复）
    const existing = document.getElementById(SUGGESTION_ID);
    if (existing) {
      existing.remove();
    }

    // 创建容器
    this.container = document.createElement('div');
    this.container.id = SUGGESTION_ID;
    this.container.style.cssText = `
      position: absolute;
      z-index: 10000;
      display: none;
      pointer-events: auto;
    `;

    // 使用 Shadow DOM 隔离样式
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    // 创建内容 - 使用 DOM API 而不是 innerHTML 以符合 CSP
    const wrapper = document.createElement('div');
    wrapper.className = 'suggestion-wrapper';

    const card = document.createElement('div');
    card.className = 'suggestion-card';

    // Header with icon
    const header = document.createElement('div');
    header.className = 'suggestion-header';
    header.style.cursor = 'move'; // 添加拖拽光标提示
    
    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = '🌐';
    
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = 'Search Translate';
    
    const dragHint = document.createElement('span');
    dragHint.className = 'drag-hint';
    dragHint.textContent = '⋮⋮'; // 拖拽图标
    dragHint.style.cssText = 'margin-left: auto; opacity: 0.5; font-size: 14px;';
    
    header.appendChild(icon);
    header.appendChild(label);
    header.appendChild(dragHint);

    // Content row (text + action buttons)
    const contentRow = document.createElement('div');
    contentRow.className = 'content-row';

    const content = document.createElement('div');
    content.className = 'suggestion-content';

    const actions = document.createElement('div');
    actions.className = 'suggestion-actions';
    
    // 填入按钮 - 使用图标
    const btnFill = document.createElement('button');
    btnFill.className = 'btn-icon btn-fill';
    btnFill.setAttribute('title', '填入搜索框');
    btnFill.setAttribute('aria-label', '填入搜索框');
    btnFill.textContent = '↵'; // 回车符号
    
    // 复制按钮 - 使用图标
    const btnCopy = document.createElement('button');
    btnCopy.className = 'btn-icon btn-copy';
    btnCopy.setAttribute('title', '复制');
    btnCopy.setAttribute('aria-label', '复制');
    btnCopy.textContent = '📋'; // 剪贴板图标
    
    actions.appendChild(btnFill);
    actions.appendChild(btnCopy);

    contentRow.appendChild(content);
    contentRow.appendChild(actions);

    // 组装
    card.appendChild(header);
    card.appendChild(contentRow);
    wrapper.appendChild(card);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = this.getStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);

    // 绑定事件
    this.bindEvents();
    this.bindDragEvents();

    // 添加到页面
    document.body.appendChild(this.container);
  }

  /**
   * 定位浮层
   */
  private position(anchorElement: HTMLElement): void {
    if (!this.container) return;

    const rect = anchorElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // 先显示容器以获取其高度
    const wasHidden = this.container.style.display === 'none';
    if (wasHidden) {
      this.container.style.visibility = 'hidden';
      this.container.style.display = 'block';
    }

    const containerHeight = this.container.offsetHeight;
    const containerWidth = Math.max(rect.width * 0.4, 200);

    if (wasHidden) {
      this.container.style.visibility = '';
      this.container.style.display = 'none';
    }

    // 计算理想位置：搜索框右侧，浮窗顶部对齐搜索框底部
    let topPosition = rect.bottom + scrollTop;
    let leftPosition = rect.right + scrollLeft + 12;

    // 检查并调整垂直位置，防止超出页面顶部
    const minTop = scrollTop + 10; // 距离视口顶部至少10px
    if (topPosition < minTop) {
      topPosition = minTop;
    }

    // 检查并调整垂直位置，防止超出页面底部
    const maxTop = scrollTop + window.innerHeight - containerHeight - 10; // 距离视口底部至少10px
    if (topPosition > maxTop) {
      topPosition = maxTop;
    }

    // 检查并调整水平位置，防止超出页面右侧
    const maxLeft = scrollLeft + window.innerWidth - containerWidth - 10; // 距离视口右侧至少10px
    if (leftPosition > maxLeft) {
      // 如果右侧空间不足，尝试放在搜索框左侧
      leftPosition = rect.left + scrollLeft - containerWidth - 12;
      
      // 如果左侧也不够，就放在视口右边界内
      if (leftPosition < scrollLeft + 10) {
        leftPosition = maxLeft;
      }
    }

    // 应用位置
    this.container.style.top = `${topPosition}px`;
    this.container.style.left = `${leftPosition}px`;
    this.container.style.width = `${containerWidth}px`;
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    if (!this.shadowRoot) return;

    // 点击翻译文本填入搜索框
    const content = this.shadowRoot.querySelector('.suggestion-content');
    if (content) {
      content.addEventListener('click', () => {
        if (this.onFillCallback) {
          this.onFillCallback(content.textContent || '');
        }
        this.hide();
      });
    }

    // 填入按钮
    const btnFill = this.shadowRoot.querySelector('.btn-fill');
    if (btnFill) {
      btnFill.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发content的点击事件
        const content = this.shadowRoot?.querySelector('.suggestion-content');
        if (content && this.onFillCallback) {
          this.onFillCallback(content.textContent || '');
        }
        this.hide();
      });
    }

    // 复制按钮
    const btnCopy = this.shadowRoot.querySelector('.btn-copy');
    if (btnCopy) {
      btnCopy.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发content的点击事件
        const content = this.shadowRoot?.querySelector('.suggestion-content');
        if (content) {
          navigator.clipboard.writeText(content.textContent || '').then(() => {
            if (btnCopy) {
              const originalText = btnCopy.textContent;
              btnCopy.textContent = '✓';
              setTimeout(() => {
                btnCopy.textContent = originalText;
              }, 1000);
            }
          });
        }
      });
    }

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (this.container && !this.container.contains(e.target as Node)) {
        this.hide();
      }
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    });
  }

  /**
   * 绑定拖拽事件
   */
  private bindDragEvents(): void {
    if (!this.shadowRoot || !this.container) return;

    const header = this.shadowRoot.querySelector('.suggestion-header') as HTMLElement;
    if (!header) return;

    const onMouseDown = (e: MouseEvent) => {
      // 防止在按钮上开始拖拽
      if ((e.target as HTMLElement).closest('.suggestion-actions')) {
        return;
      }

      this.isDragging = true;
      const rect = this.container!.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // 添加拖拽样式
      if (this.container) {
        this.container.style.transition = 'none';
      }
      
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging || !this.container) return;

      const x = e.clientX - this.dragOffset.x;
      const y = e.clientY - this.dragOffset.y;

      // 限制在视口内
      const maxX = window.innerWidth - this.container.offsetWidth;
      const maxY = window.innerHeight - this.container.offsetHeight;

      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));

      this.container.style.left = `${boundedX + window.pageXOffset}px`;
      this.container.style.top = `${boundedY + window.pageYOffset}px`;
    };

    const onMouseUp = () => {
      if (this.isDragging && this.container) {
        this.isDragging = false;
        this.container.style.transition = '';
      }
    };

    header.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // 保存引用以便清理
    (this as any)._dragHandlers = { onMouseDown, onMouseMove, onMouseUp, header };
  }

  /**
   * 解绑拖拽事件
   */
  private unbindDragEvents(): void {
    const handlers = (this as any)._dragHandlers;
    if (handlers) {
      handlers.header.removeEventListener('mousedown', handlers.onMouseDown);
      document.removeEventListener('mousemove', handlers.onMouseMove);
      document.removeEventListener('mouseup', handlers.onMouseUp);
      delete (this as any)._dragHandlers;
    }
  }

  /**
   * 获取样式
   */
  private getStyles(): string {
    return `
      .suggestion-wrapper {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .suggestion-card {
        /* 精美的半透明毛玻璃效果 - 50%透明度 */
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.4) 100%
        );
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        
        /* 微弱的光影效果 */
        position: relative;
        overflow: hidden;
        
        /* 边框和阴影 */
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 14px;
        box-shadow: 
          0 10px 40px rgba(0, 0, 0, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.06),
          0 1px 3px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(0, 0, 0, 0.02);
        
        padding: 12px 16px;
        animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        
        /* 确保在深色背景下也能看清 */
        color: #1a1a1a;
        
        /* 拖拽时的过渡效果 */
        transition: box-shadow 0.2s ease, transform 0.1s ease;
      }

      /* 微弱的光影效果层 */
      .suggestion-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0) 100%
        );
        pointer-events: none;
        border-radius: 14px 14px 0 0;
      }

      /* 底部微弱阴影 */
      .suggestion-card::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30%;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.015) 0%,
          rgba(0, 0, 0, 0) 100%
        );
        pointer-events: none;
        border-radius: 0 0 14px 14px;
      }

      .suggestion-card:active {
        box-shadow: 
          0 14px 48px rgba(0, 0, 0, 0.16),
          0 6px 16px rgba(0, 0, 0, 0.08),
          0 2px 4px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-12px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      .suggestion-header {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        user-select: none;
        -webkit-user-select: none;
        position: relative;
        z-index: 1;
      }

      .suggestion-header:hover {
        color: rgba(0, 0, 0, 0.8);
      }

      .suggestion-header:hover .drag-hint {
        opacity: 0.8 !important;
      }

      .icon {
        font-size: 14px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }

      .content-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        position: relative;
        z-index: 1;
      }

      .suggestion-content {
        flex: 1;
        font-size: 14px;
        color: #1a1a1a;
        line-height: 1.6;
        word-break: break-word;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        font-weight: 500;
        cursor: pointer;
        padding: 4px 8px;
        margin: -4px -8px;
        border-radius: 6px;
        transition: background-color 0.15s ease;
        min-height: 24px;
      }

      .suggestion-content:hover {
        background-color: rgba(26, 115, 232, 0.08);
      }

      .suggestion-content:active {
        background-color: rgba(26, 115, 232, 0.12);
      }

      .loading {
        color: #1a73e8;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .error {
        color: #d93025;
      }

      .suggestion-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
        align-self: flex-start;
      }

      .btn-icon {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #1a1a1a;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .btn-icon:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(26, 115, 232, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .btn-icon:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .btn-fill {
        font-weight: 600;
      }

      .btn-copy {
        font-size: 14px;
      }

      /* 深色模式支持 */
      @media (prefers-color-scheme: dark) {
        .suggestion-card {
          background: linear-gradient(
            135deg,
            rgba(40, 40, 40, 0.5) 0%,
            rgba(30, 30, 30, 0.4) 100%
          );
          border-color: rgba(255, 255, 255, 0.1);
          color: #e8e8e8;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 1px 3px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .suggestion-card::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        .suggestion-card::after {
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .suggestion-header {
          color: rgba(255, 255, 255, 0.6);
        }

        .suggestion-header:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .suggestion-content {
          color: #e8e8e8;
        }

        .suggestion-content:hover {
          background-color: rgba(26, 115, 232, 0.15);
        }

        .suggestion-content:active {
          background-color: rgba(26, 115, 232, 0.2);
        }

        .btn-icon {
          background: rgba(60, 60, 60, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
          color: #e8e8e8;
        }

        .btn-icon:hover {
          background: rgba(80, 80, 80, 0.6);
          border-color: rgba(26, 115, 232, 0.5);
        }
      }
    `;
  }
}
