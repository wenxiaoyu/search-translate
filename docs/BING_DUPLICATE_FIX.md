# Bing 重复翻译提示修复

## 问题

在 Bing 搜索页面（包括国内版 cn.bing.com 和国际版 bing.com）上，出现了两个翻译提示，导致重复显示。

## 根本原因

问题不在于找到了多个搜索框，而在于 **TranslationSuggestion 容器的重复创建**：

1. MutationObserver 监听 DOM 变化时，可能会多次触发
2. 每次触发时，虽然旧的 `TranslationManager` 被销毁，但新的 `TranslationSuggestion` 实例会创建新的 DOM 容器
3. `TranslationSuggestion` 使用固定的 ID (`smart-search-translate-suggestion`)，但在创建新容器前没有检查并移除旧容器
4. 结果：页面上存在多个翻译浮层容器，导致显示重复的翻译提示

## 解决方案

### 1. TranslationSuggestion 容器去重

在 `TranslationSuggestion.create()` 方法中，创建新容器前先移除已存在的容器：

```typescript
private create(): void {
  // 先移除已存在的容器（防止重复）
  const existing = document.getElementById(SUGGESTION_ID);
  if (existing) {
    existing.remove();
  }

  // 创建容器
  this.container = document.createElement('div');
  this.container.id = SUGGESTION_ID;
  // ...
}
```

### 2. BingAdapter 选择器优化（辅助修复）

虽然不是主要原因，但仍然优化了选择器以确保只选择主搜索框：

```typescript
getSearchInput(): HTMLInputElement | null {
  const selectors = [
    // 主搜索框（最高优先级）
    'input#sb_form_q',
    // 备用：限定在主表单内
    'form#sb_form input[name="q"]',
    'textarea[name="q"]',
  ];
  // ...
}
```

## 测试

修复后，在以下页面测试：

### Bing 国际版
- [ ] bing.com 首页
- [ ] bing.com/search?q=test 搜索结果页

### Bing 国内版
- [ ] cn.bing.com 首页
- [ ] cn.bing.com/search?q=test 搜索结果页

**预期结果**：
- 每个页面只显示一个翻译提示
- 翻译提示出现在主搜索框附近
- 输入中文时正常触发翻译
- 页面 DOM 中只有一个 `#smart-search-translate-suggestion` 元素

## 验证方法

在浏览器控制台运行：

```javascript
// 检查页面上有多少个翻译容器
document.querySelectorAll('#smart-search-translate-suggestion').length
// 应该返回 0（未显示）或 1（显示中）

// 检查是否有重复的翻译浮层
document.querySelectorAll('[id^="smart-search-translate"]')
// 应该只有一个元素
```

## 相关文件

- `src/content/ui/TranslationSuggestion.ts` - 翻译浮层组件（主要修复）
- `src/content/adapters/BingAdapter.ts` - Bing 适配器（辅助优化）
- `src/content/index.ts` - MutationObserver 实现

## 技术细节

### 为什么会重复创建？

1. **MutationObserver 的触发时机**：
   - 监听 `childList`、`subtree`、`attributes` 变化
   - Bing 页面加载时会有大量 DOM 变化
   - 每次变化都可能触发检查

2. **TranslationManager 的生命周期**：
   - 检测到搜索框变化 → 销毁旧实例 → 创建新实例
   - 销毁时调用 `destroy()`，但新实例的 `create()` 可能在旧容器移除前执行

3. **固定 ID 的陷阱**：
   - 使用固定 ID 是为了确保唯一性
   - 但如果不主动检查和清理，仍可能出现重复

### 为什么不用单例模式？

考虑过使用单例模式，但有以下问题：
- 需要跨模块共享状态
- 增加代码复杂度
- 当前方案（ID 去重）更简单直接

## 类似问题的预防

如果其他组件也使用固定 ID，确保：

1. **创建前检查**：
   ```typescript
   const existing = document.getElementById(COMPONENT_ID);
   if (existing) {
     existing.remove();
   }
   ```

2. **销毁时清理**：
   ```typescript
   destroy(): void {
     if (this.container && this.container.parentNode) {
       this.container.parentNode.removeChild(this.container);
     }
     this.container = null;
   }
   ```

3. **使用唯一 ID**：
   - 如果需要多个实例，使用动态 ID（如 `${COMPONENT_ID}-${timestamp}`）
   - 如果只需一个实例，使用固定 ID + 创建前去重
