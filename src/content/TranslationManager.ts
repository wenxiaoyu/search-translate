/**
 * 翻译管理器 - 协调适配器、UI、API 调用
 */

import type { SearchEngineAdapter } from './adapters/SearchEngineAdapter';
import { TranslationSuggestion } from './ui/TranslationSuggestion';
import { getCachedTranslation, setCachedTranslation } from '../utils/cache';
import { shouldTranslate } from '../utils/languageDetector';
import { debounce } from '../utils/debounce';

export class TranslationManager {
  private adapter: SearchEngineAdapter;
  private suggestion: TranslationSuggestion;
  private currentInput: HTMLInputElement | null = null;
  private isEnabled: boolean = true;
  private lastTranslatedText: string = ''; // 记录最后翻译的文本，防止重复
  private isTranslating: boolean = false; // 标记是否正在翻译

  constructor(adapter: SearchEngineAdapter) {
    this.adapter = adapter;
    this.suggestion = new TranslationSuggestion();
  }

  /**
   * 初始化 - 监听搜索框输入
   */
  init(): void {
    const input = this.adapter.getSearchInput();
    if (!input) {
      return;
    }

    this.currentInput = input;

    // 监听输入事件(使用防抖)
    const debouncedTranslate = debounce((text: string) => {
      this.handleInput(text);
    }, 500);

    input.addEventListener('input', (e) => {
      const text = (e.target as HTMLInputElement).value;
      debouncedTranslate(text);
    });

    // 监听焦点事件
    input.addEventListener('focus', () => {
      const text = input.value;
      if (text && shouldTranslate(text)) {
        debouncedTranslate(text);
      }
    });
  }

  /**
   * 处理输入
   */
  private async handleInput(text: string): Promise<void> {
    if (!this.isEnabled || !this.currentInput) {
      return;
    }

    // 检查是否需要翻译
    if (!shouldTranslate(text)) {
      this.hideAll();
      this.lastTranslatedText = '';
      return;
    }

    // 防止重复翻译相同的文本
    if (text === this.lastTranslatedText) {
      return;
    }

    // 防止并发翻译
    if (this.isTranslating) {
      return;
    }

    this.lastTranslatedText = text;
    this.isTranslating = true;

    try {
      // 检查缓存
      const cached = getCachedTranslation(text);
      if (cached) {
        this.showTranslation(cached);
        return;
      }

      // 显示加载状态
      this.showLoading();

      // 调用翻译 API
      const result = await this.translate(text);
      
      if (result.success && result.translation) {
        // 保存到缓存
        setCachedTranslation(text, result.translation);
        this.showTranslation(result.translation);
      } else {
        this.showError(result.error || 'unknown');
      }
    } catch (error) {
      console.error('[TranslationManager] Translation error:', error);
      this.showError('network_error');
    } finally {
      this.isTranslating = false;
    }
  }

  /**
   * 调用翻译 API (通过 background)
   */
  private async translate(text: string): Promise<{
    success: boolean;
    translation?: string;
    error?: string;
  }> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: 'TRANSLATE',
          payload: { text },
        },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({
              success: false,
              error: 'runtime_error',
            });
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * 显示加载状态
   */
  private showLoading(): void {
    if (!this.currentInput) return;

    // 强制使用独立浮层（原生集成已禁用）
    this.suggestion.showLoading(this.currentInput);

    /* 原生集成代码已注释 - 统一使用独立浮层
    // 检查适配器是否优先使用独立浮层
    if (this.adapter.preferStandaloneOverlay) {
      // 直接使用独立浮层
      this.suggestion.showLoading(this.currentInput);
      return;
    }

    // 尝试在原生建议中显示加载状态
    if (this.useNativeIntegration) {
      const container = this.adapter.getSuggestionContainer();
      if (container) {
        this.showLoadingInNativeSuggestions(container);
        return;
      }
    }

    // 降级到独立浮层
    this.suggestion.showLoading(this.currentInput);
    */
  }

  /* ========== 原生集成方法已注释（统一使用独立浮层）==========
   * 如需恢复原生集成功能，取消下面代码的注释
   */

  /**
   * 显示翻译结果
   */
  private showTranslation(translation: string): void {
    if (!this.currentInput) return;

    // 强制使用独立浮层（原生集成已禁用）
    this.showStandaloneOverlay(translation);

    /* 原生集成代码已注释 - 统一使用独立浮层
    // 检查适配器是否优先使用独立浮层
    if (this.adapter.preferStandaloneOverlay) {
      // 直接使用独立浮层，不尝试原生集成
      this.showStandaloneOverlay(translation);
      return;
    }

    // 尝试集成到原生建议
    if (this.useNativeIntegration) {
      const container = this.adapter.getSuggestionContainer();
      if (container) {
        this.showInNativeSuggestions(translation, container);
        return;
      }
    }

    // 降级到独立浮层
    this.showStandaloneOverlay(translation);
    */
  }

  /**
   * 显示独立浮层
   */
  private showStandaloneOverlay(translation: string): void {
    if (!this.currentInput) return;

    this.suggestion.show(translation, this.currentInput, (text) => {
      if (this.currentInput) {
        this.currentInput.value = text;
        this.currentInput.focus();
        
        // 触发 input 事件,让搜索引擎识别
        const inputEvent = new Event('input', { bubbles: true });
        this.currentInput.dispatchEvent(inputEvent);

        // 尝试触发搜索提交
        this.submitSearch();
      }
    });
  }

  /**
   * 触发搜索提交
   */
  private submitSearch(): void {
    if (!this.currentInput) return;

    // 方法1: 查找并点击搜索按钮
    const searchButton = this.adapter.getSearchButton?.();
    if (searchButton) {
      searchButton.click();
      return;
    }

    // 方法2: 触发表单提交
    const form = this.currentInput.closest('form');
    if (form) {
      form.submit();
      return;
    }

    // 方法3: 模拟回车键
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    this.currentInput.dispatchEvent(enterEvent);

    // 也触发 keypress 和 keyup 事件以确保兼容性
    const keypressEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    this.currentInput.dispatchEvent(keypressEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    this.currentInput.dispatchEvent(keyupEvent);
  }

  /* ========== showInNativeSuggestions 方法已删除（统一使用独立浮层）========== */

  /**
   * 显示错误
   */
  private showError(errorType: string): void {
    // 强制使用独立浮层显示错误
    if (!this.currentInput) return;

    const messages: Record<string, string> = {
      rate_limit: '翻译服务繁忙,请稍后重试',
      timeout: '翻译超时,请检查网络连接',
      network_error: '网络连接失败',
      api_error: '翻译失败,请稍后重试',
      unknown: '翻译失败',
    };

    const message = messages[errorType] || messages.unknown;
    this.suggestion.showError(message, this.currentInput);

    /* 原生集成代码已注释 - 统一使用独立浮层
    // 原生集成模式下，错误不显示（避免干扰）
    if (this.useNativeIntegration) {
      const container = this.adapter.getSuggestionContainer();
      if (container) {
        this.hideAll();
        return;
      }
    }

    // 独立浮层模式显示错误
    if (!this.currentInput) return;

    const messages: Record<string, string> = {
      rate_limit: '翻译服务繁忙,请稍后重试',
      timeout: '翻译超时,请检查网络连接',
      network_error: '网络连接失败',
      api_error: '翻译失败,请稍后重试',
      unknown: '翻译失败',
    };

    const message = messages[errorType] || messages.unknown;
    this.suggestion.showError(message, this.currentInput);
    */
  }

  /**
   * 启用/禁用翻译功能
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.hideAll();
    }
  }

  /**
   * 隐藏所有翻译建议
   */
  private hideAll(): void {
    // 只需隐藏独立浮层（原生集成已禁用）
    this.suggestion.hide();

    /* 原生集成代码已注释
    // 移除原生建议项
    if (this.currentTranslationItem && this.currentTranslationItem.parentNode) {
      this.currentTranslationItem.parentNode.removeChild(this.currentTranslationItem);
      this.currentTranslationItem = null;
    }

    // 隐藏独立浮层
    this.suggestion.hide();
    */
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.hideAll();
    this.suggestion.destroy();
    this.lastTranslatedText = '';
    this.isTranslating = false;
  }
}
