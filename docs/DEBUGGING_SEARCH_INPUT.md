# Debugging Search Input Detection

## Problem

当在某个页面上看到 `[TranslationManager] Search input not found` 错误时，说明适配器无法找到搜索框。

## Debugging Steps

### 1. 查看控制台日志

打开浏览器开发者工具（F12），查看控制台输出。GitHubAdapter 现在会打印调试信息：

```
[GitHubAdapter] No search input found. Available inputs: [...]
```

这会列出页面上所有的 `<input>` 元素及其属性。

### 2. 检查搜索框元素

在开发者工具中：

1. 点击"Elements"标签
2. 使用选择器工具（Ctrl+Shift+C）点击搜索框
3. 查看元素的属性：
   - `type` 属性
   - `name` 属性
   - `id` 属性
   - `class` 属性
   - `placeholder` 属性
   - `data-*` 属性

### 3. 测试选择器

在控制台中测试选择器：

```javascript
// 测试单个选择器
document.querySelector('input[name="q"]')

// 测试是否可见
const input = document.querySelector('input[name="q"]');
console.log('Visible:', input && input.offsetParent !== null);
console.log('Disabled:', input && input.disabled);

// 列出所有输入框
Array.from(document.querySelectorAll('input')).forEach(i => {
  console.log({
    selector: `input#${i.id || ''}${i.className ? '.' + i.className.split(' ').join('.') : ''}`,
    type: i.type,
    name: i.name,
    visible: i.offsetParent !== null,
    disabled: i.disabled
  });
});
```

### 4. 添加新选择器

如果找到了正确的选择器，在适配器中添加它：

```typescript
// src/content/adapters/GitHubAdapter.ts
getSearchInput(): HTMLInputElement | null {
  const selectors = [
    // 添加新发现的选择器
    'input.your-new-selector',
    
    // 现有选择器...
    'input#query-builder-test',
    // ...
  ];
  
  // ...
}
```

## Common Issues

### Issue 1: 搜索框延迟加载

**症状**: 页面加载时搜索框不存在，几秒后才出现

**解决方案**: MutationObserver 会持续监听 DOM 变化，自动检测搜索框出现

**验证**: 
```javascript
// 在控制台运行，看搜索框何时出现
const observer = new MutationObserver(() => {
  const input = document.querySelector('input[name="q"]');
  if (input) {
    console.log('Search input appeared!', input);
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
```

### Issue 2: 搜索框被隐藏

**症状**: 搜索框存在但 `offsetParent === null`

**原因**: 
- `display: none`
- `visibility: hidden`
- 父元素被隐藏

**解决方案**: 
- MutationObserver 现在监听 `style`、`class`、`hidden` 属性变化
- 当搜索框从隐藏变为可见时，会自动重新初始化
- 跟踪 `lastVisible` 状态来检测可见性变化

**验证**: 查看控制台日志
```
[SmartSearchTranslate] Search input changed, re-initializing... {
  elementChanged: false,
  visibilityChanged: true,
  wasVisible: false,
  nowVisible: true
}
```

### Issue 3: 动态搜索框

**症状**: 搜索框在页面导航时消失和重新出现

**解决方案**: 已实现 - MutationObserver 会自动处理

**验证**: 查看控制台日志
```
[SmartSearchTranslate] Search input disappeared, cleaning up...
[SmartSearchTranslate] Search input detected, initializing...
```

### Issue 4: 多个搜索框

**症状**: 页面有多个搜索框，但只有一个应该被支持

**解决方案**: 
- 调整选择器优先级
- 添加更具体的选择器
- 使用 `data-*` 属性或特定的 class

## GitHub Specific Issues

### GitHub Search Results Page

URL: `https://github.com/search?q=...`

**已知选择器**:
```typescript
'input#query-builder-test'
'input[data-target="query-builder.input"]'
'input.js-site-search-focus'
'input[type="search"]'
```

**调试**:
```javascript
// 在 GitHub 搜索结果页面运行
console.log('Query builder:', document.querySelector('#query-builder-test'));
console.log('Site search:', document.querySelector('.js-site-search-focus'));
console.log('All search inputs:', 
  Array.from(document.querySelectorAll('input[type="search"]'))
);
```

### GitHub Repository Page

URL: `https://github.com/user/repo`

**已知选择器**:
```typescript
'input[name="q"][type="text"]'
'input.header-search-input'
```

### GitHub Home Page

URL: `https://github.com`

**已知选择器**:
```typescript
'input.header-search-input'
'input[data-target="qbsearch-input.inputButtonText"]'
```

## Testing Checklist

测试适配器时，确保在以下页面都能工作：

### Google
- [ ] google.com 首页
- [ ] google.com/search?q=test 搜索结果页

### Baidu
- [ ] baidu.com 首页
- [ ] baidu.com/s?wd=test 搜索结果页

### Bing
- [ ] bing.com 首页
- [ ] bing.com/search?q=test 搜索结果页

### GitHub
- [ ] github.com 首页
- [ ] github.com/user/repo 仓库页
- [ ] github.com/search?q=test 搜索结果页
- [ ] github.com/search?type=code 代码搜索页

### Stack Overflow
- [ ] stackoverflow.com 首页
- [ ] stackoverflow.com/search?q=test 搜索结果页
- [ ] stackoverflow.com/questions/... 问题页

## Reporting Issues

如果发现新的搜索框检测问题，请提供：

1. **URL**: 完整的页面 URL
2. **控制台日志**: 包括错误和调试信息
3. **搜索框 HTML**: 使用开发者工具复制搜索框的 HTML
4. **截图**: 显示搜索框在页面上的位置

## Quick Fix

如果需要临时修复，可以在控制台手动初始化：

```javascript
// 1. 找到搜索框
const input = document.querySelector('YOUR_SELECTOR');

// 2. 手动触发初始化
if (input) {
  console.log('Found input, triggering re-initialization...');
  // 触发 DOM 变化，让 MutationObserver 检测到
  input.parentElement.appendChild(document.createElement('span'));
}
```

## Related Files

- `src/content/adapters/GitHubAdapter.ts` - GitHub 适配器
- `src/content/adapters/GoogleAdapter.ts` - Google 适配器
- `src/content/adapters/BaiduAdapter.ts` - Baidu 适配器
- `src/content/adapters/BingAdapter.ts` - Bing 适配器
- `src/content/adapters/StackOverflowAdapter.ts` - Stack Overflow 适配器
- `src/content/index.ts` - MutationObserver 实现
- `docs/SPA_NAVIGATION_FIX.md` - SPA 导航修复文档
