/**
 * 搜索引擎适配器接口
 */
export interface SearchEngineAdapter {
  /** 适配器名称 */
  name: string;

  /** 检查当前 URL 是否匹配 */
  matches(url: string): boolean;

  /** 获取搜索输入框 */
  getSearchInput(): HTMLInputElement | null;

  /** 获取搜索按钮（可选） */
  getSearchButton?(): HTMLButtonElement | HTMLInputElement | null;

  /** 获取浮层插入位置(通常是搜索框的父元素) */
  getInsertPosition(): HTMLElement | null;

  /** 获取搜索建议容器（用于集成到原生建议） */
  getSuggestionContainer(): HTMLElement | null;

  /** 创建翻译建议项（集成到原生建议列表） */
  createSuggestionItem(translation: string, onClick: () => void): HTMLElement;

  /** 是否优先使用独立浮层模式（可选，默认 false） */
  preferStandaloneOverlay?: boolean;
}
