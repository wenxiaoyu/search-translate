# SPA Navigation Fix

## Problem

GitHub 是单页应用（SPA），页面导航时不会重新加载 content script。这导致：

1. **初始化失败**: 当 content script 加载时，搜索框可能还没有渲染到 DOM
2. **导航后失效**: 用户在 GitHub 内部导航（如从首页到仓库页面）时，搜索框会变化，但插件不会重新初始化
3. **观察器过早停止**: 原来的 MutationObserver 在 10 秒后就断开，无法处理后续的 DOM 变化

## Solution

### 1. 持续监听 DOM 变化

```typescript
function observeSearchInput() {
  const adapter = AdapterFactory.getAdapter();
  if (!adapter) return;

  let checkTimer: number | null = null;

  const observer = new MutationObserver(() => {
    // 使用防抖避免频繁检查
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    checkTimer = window.setTimeout(() => {
      const input = adapter.getSearchInput();
      if (input && !translationManager) {
        // 搜索框出现，初始化
        initTranslation();
      } else if (!input && translationManager) {
        // 搜索框消失，清理
        translationManager.destroy();
        translationManager = null;
      }
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
```

**关键改进**:
- ✅ 不再自动断开观察器（移除了 10 秒超时）
- ✅ 添加防抖机制（500ms），避免频繁检查
- ✅ 双向检测：搜索框出现时初始化，消失时清理
- ✅ 支持 SPA 页面导航

### 2. 总是启动观察器

```typescript
// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTranslation();
    observeSearchInput(); // 总是启动
  });
} else {
  initTranslation();
  observeSearchInput(); // 总是启动
}
```

**改进**:
- ✅ 无论初始化是否成功，都启动观察器
- ✅ 支持延迟加载的搜索框
- ✅ 支持 SPA 导航后的重新初始化

## Benefits

1. **更可靠**: 即使搜索框延迟加载，也能正确初始化
2. **支持 SPA**: 页面导航后自动重新检测和初始化
3. **性能优化**: 使用防抖避免频繁检查
4. **自动清理**: 搜索框消失时自动清理资源

## Testing Scenarios

### GitHub 测试场景

1. **首页加载**
   - 访问 github.com
   - 等待搜索框出现
   - 输入中文，验证翻译功能

2. **仓库页面**
   - 访问任意仓库（如 github.com/facebook/react）
   - 使用仓库内搜索
   - 输入中文，验证翻译功能

3. **SPA 导航**
   - 从首页导航到仓库页面
   - 验证翻译功能仍然工作
   - 从仓库页面返回首页
   - 验证翻译功能仍然工作

4. **代码搜索**
   - 访问 github.com/search
   - 使用新版代码搜索界面
   - 输入中文，验证翻译功能

### 其他搜索引擎

同样的改进也适用于其他可能使用 SPA 架构的搜索引擎。

## Performance Impact

- **内存**: 观察器持续运行，但使用防抖机制，实际检查频率很低
- **CPU**: 防抖延迟 500ms，避免频繁的 DOM 查询
- **用户体验**: 无感知，翻译功能在需要时自动可用

## Related Files

- `src/content/index.ts` - 主要修改文件
- `src/content/TranslationManager.ts` - 添加了 destroy() 方法支持
- `src/content/adapters/GitHubAdapter.ts` - 改进的搜索框检测逻辑
