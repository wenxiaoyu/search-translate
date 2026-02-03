# Stack Overflow Adapter

## Overview

Stack Overflow 适配器支持在 Stack Overflow 和 Stack Exchange 网络站点上进行实时翻译。

**设计决策**: Stack Overflow 适配器使用**独立浮层模式**而不是原生集成模式。

## Why Standalone Overlay?

Stack Overflow 的搜索建议容器有以下特点：

1. **动态创建**: 建议容器只在用户开始输入时才动态创建
2. **复杂的显示逻辑**: 容器的显示/隐藏由 Stack Overflow 的 JavaScript 控制
3. **时机问题**: 我们的翻译建议可能在容器创建之前就准备好了
4. **冲突风险**: 插入到原生建议列表可能与 Stack Overflow 的逻辑冲突

因此，使用独立浮层模式更加：
- ✅ **可靠**: 不依赖 Stack Overflow 的 DOM 结构
- ✅ **稳定**: 不受 Stack Overflow 更新影响
- ✅ **一致**: 用户体验更可预测
- ✅ **简单**: 实现和维护更容易

## Supported Sites

- stackoverflow.com (主站)
- *.stackexchange.com (所有 Stack Exchange 网络站点)
  - askubuntu.com
  - superuser.com
  - serverfault.com
  - mathoverflow.net
  - 等等...

## Search Input Detection

### 搜索框选择器

按优先级尝试以下选择器：

1. **主搜索框**
   - `input[name="q"]` - 标准搜索输入
   - `input.s-input[type="text"]` - Stacks 设计系统输入框

2. **顶部搜索栏**
   - `input[placeholder*="Search"]` - 通过占位符文本识别
   - `input[aria-label*="Search"]` - 通过 ARIA 标签识别

3. **移动端搜索**
   - `input.js-search-field` - JavaScript 控制的搜索框

### 验证条件

- 元素存在
- 元素可见 (`offsetParent !== null`)
- 元素未禁用 (`!disabled`)

## Suggestion Container Detection

### 自动完成容器选择器

1. **搜索建议容器**
   - `.s-popover.js-search-hints` - Stack Overflow 的弹出提示
   - `.s-popover[role="menu"]` - 菜单角色的弹出层

2. **自动完成结果**
   - `.autocomplete-results` - 通用自动完成容器
   - `ul[role="listbox"]` - 列表框角色的容器

3. **搜索提示**
   - `.search-hints` - 搜索提示容器

### Fallback Behavior

如果没有找到合适的建议容器，返回 `null` 触发独立浮层模式。

## UI Styling

### Native Suggestion Item

遵循 Stack Overflow 的设计风格：

- **颜色方案**
  - 背景: 白色 (#ffffff)
  - 左边框: Stack Overflow 橙色 (#f48024)
  - 文本: 深灰色 (#232629)
  - 次要文本: 中灰色 (#6a737c)

- **布局**
  - 最小高度: 32px
  - 内边距: 6px 16px
  - Flexbox 行布局
  - 左侧: 🔍 图标 + 翻译文本
  - 右侧: "Search Translate" 标签

- **交互效果**
  - 悬停背景: 浅灰色 (#f1f2f3)
  - 悬停阴影: 橙色边框阴影
  - 平滑过渡: 0.15s ease

### CSS Classes

使用 Stack Overflow 的 Stacks 设计系统类名：
- `.s-block-link` - 块级链接样式
- `role="option"` - 选项角色（可访问性）

## Integration Modes

### Standalone Overlay Mode (Default)

Stack Overflow 适配器默认使用独立浮层模式：
- 显示在搜索框下方的独立浮层
- 毛玻璃透明效果
- 不依赖 Stack Overflow 的 DOM 结构
- 更可靠和稳定

**实现方式**:
```typescript
export class StackOverflowAdapter implements SearchEngineAdapter {
  name = 'Stack Overflow';
  
  // 优先使用独立浮层模式
  preferStandaloneOverlay = true;
  
  // ...
}
```

### Native Integration (Not Used)

虽然适配器实现了 `getSuggestionContainer()` 和 `createSuggestionItem()` 方法，但由于 `preferStandaloneOverlay = true`，这些方法不会被调用。

如果将来 Stack Overflow 的搜索建议变得更稳定，可以将 `preferStandaloneOverlay` 设置为 `false` 来启用原生集成。

## Testing Checklist

### Basic Functionality
- [ ] 主页搜索框检测
- [ ] 搜索结果页搜索框
- [ ] 问题页面搜索框
- [ ] 标签页面搜索框

### Translation Features
- [ ] 输入中文触发翻译
- [ ] 显示翻译建议
- [ ] 点击填入搜索框
- [ ] 触发搜索

### UI/UX
- [ ] 独立浮层样式正确
- [ ] 毛玻璃效果
- [ ] 悬停效果流畅
- [ ] 响应式布局
- [ ] 点击填入功能
- [ ] 复制功能

### Stack Exchange Network
- [ ] askubuntu.com
- [ ] superuser.com
- [ ] serverfault.com
- [ ] 其他 Stack Exchange 站点

## Known Limitations

1. **动态加载**: Stack Overflow 使用部分 AJAX 加载，某些页面导航可能需要重新初始化
2. **建议容器**: 建议容器可能不总是可见，会自动降级到独立浮层
3. **多个搜索框**: 某些页面可能有多个搜索框，适配器返回第一个可见的

## Performance Considerations

- 使用 MutationObserver 持续监听 DOM 变化
- 500ms 防抖避免频繁检查
- 自动清理和重新初始化支持 SPA 导航

## Related Files

- `src/content/adapters/StackOverflowAdapter.ts` - 适配器实现
- `src/content/adapters/AdapterFactory.ts` - 工厂类注册
- `src/manifest.json` - 权限配置
