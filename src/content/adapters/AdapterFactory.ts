import type { SearchEngineAdapter } from './SearchEngineAdapter';
import { GoogleAdapter } from './GoogleAdapter';
import { BaiduAdapter } from './BaiduAdapter';
import { BingAdapter } from './BingAdapter';
import { GitHubAdapter } from './GitHubAdapter';
import { StackOverflowAdapter } from './StackOverflowAdapter';

/**
 * 适配器工厂 - 根据 URL 选择合适的适配器
 */
export class AdapterFactory {
  private static adapters: SearchEngineAdapter[] = [
    new GoogleAdapter(),
    new BaiduAdapter(),
    new BingAdapter(),
    new GitHubAdapter(),
    new StackOverflowAdapter(),
  ];

  /**
   * 获取当前页面的适配器
   */
  static getAdapter(url: string = window.location.href): SearchEngineAdapter | null {
    for (const adapter of this.adapters) {
      if (adapter.matches(url)) {
        return adapter;
      }
    }
    return null;
  }

  /**
   * 检查当前页面是否支持翻译功能
   */
  static isSupported(url: string = window.location.href): boolean {
    return this.getAdapter(url) !== null;
  }
}
