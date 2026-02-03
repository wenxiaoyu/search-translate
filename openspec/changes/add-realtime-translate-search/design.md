## Context

当前 Chrome 插件已有基础脚手架(popup、background、content script、options),需要在此基础上添加实时翻译搜索功能。用户在搜索引擎输入中文时,插件应实时翻译并提供英文建议,帮助用户进行更准确的英文搜索。

技术约束:
- 使用 Manifest V3 规范
- Content script 运行在页面上下文,需要注入 UI
- Background service worker 处理 API 调用
- 需要支持多个搜索引擎网站

## Goals / Non-Goals

**Goals:**
- 实现实时翻译功能,响应时间 < 1 秒
- 支持 Google、Baidu、Bing、GitHub、Stack Overflow 五个主流搜索引擎
- 提供流畅的用户体验(防抖、缓存、加载状态)
- 使用免费翻译 API,无需用户配置
- 代码架构清晰,易于扩展新搜索引擎

**Non-Goals:**
- 不支持其他语言对(仅中文→英文)
- 不提供翻译历史记录功能(可后续添加)
- 不支持自定义翻译 API(第一版使用 MyMemory)
- 不提供语音输入/输出功能

## Decisions

### Decision 1: 翻译 API 选择 - MyMemory

**选择**: 使用 MyMemory Translation API (https://mymemory.translated.net/doc/spec.php)

**理由**:
- 免费,每天 1000 次调用,无需注册
- RESTful API,简单易用
- 翻译质量可接受
- 无需管理 API key

**备选方案**:
- 百度翻译 API: 需要注册和 API key 管理,增加用户配置复杂度
- Google Translate API: 付费,不适合免费插件
- LibreTranslate: 需要自建服务器

**API 调用示例**:
```
GET https://api.mymemory.translated.net/get?q=机器学习&langpair=zh|en
```

### Decision 2: 架构模式 - 适配器模式

**选择**: 使用适配器模式支持多个搜索引擎

**理由**:
- 每个搜索引擎的 DOM 结构不同,需要独立的选择器和逻辑
- 适配器模式便于添加新搜索引擎,无需修改核心代码
- 统一接口简化主逻辑

**接口设计**:
```typescript
interface SearchEngineAdapter {
  name: string;
  matches(url: string): boolean;
  getSearchInput(): HTMLInputElement | null;
  getInsertPosition(): HTMLElement | null;
}
```

**实现**:
- `GoogleAdapter`: 支持 google.com, google.com.hk
- `BaiduAdapter`: 支持 baidu.com
- `BingAdapter`: 支持 bing.com
- `GitHubAdapter`: 支持 github.com
- `StackOverflowAdapter`: 支持 stackoverflow.com, stackexchange.com

### Decision 3: UI 注入方式 - 动态创建 DOM

**选择**: 使用 JavaScript 动态创建 DOM 元素,不使用 React 组件

**理由**:
- Content script 注入到页面,使用 React 会增加包体积
- 简单的浮层 UI 不需要复杂的状态管理
- 避免与页面的 React 版本冲突

**实现**:
- 创建独立的 `TranslationSuggestion` 类
- 使用 Shadow DOM 隔离样式
- 手动管理 DOM 更新和事件监听

### Decision 4: 防抖策略 - 500ms 延迟

**选择**: 用户停止输入 500ms 后触发翻译

**理由**:
- 500ms 是用户感知的合理延迟
- 减少不必要的 API 调用
- 平衡响应速度和性能

**实现**:
```typescript
const debounce = (fn: Function, delay: number) => {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
```

### Decision 5: 缓存策略 - localStorage + 30 天过期

**选择**: 使用 localStorage 存储翻译缓存,30 天自动过期

**理由**:
- localStorage 容量足够(5-10MB),适合存储翻译结果
- 30 天过期平衡缓存命中率和数据新鲜度
- 使用 MD5 hash 作为键,避免键名冲突

**缓存结构**:
```typescript
interface CacheEntry {
  source: string;
  translation: string;
  timestamp: number;
}
```

**存储键**: `translate_cache_${md5(sourceText)}`

### Decision 6: 消息通信 - chrome.runtime.sendMessage

**选择**: Content script 通过 chrome.runtime.sendMessage 与 background 通信

**理由**:
- Manifest V3 标准通信方式
- Background service worker 处理 API 调用,避免 CORS 问题
- 便于集中管理缓存和 API 调用逻辑

**消息格式**:
```typescript
// Request
{
  type: 'TRANSLATE',
  payload: { text: string }
}

// Response
{
  success: boolean,
  translation?: string,
  error?: string
}
```

### Decision 7: 语言检测 - 正则表达式

**选择**: 使用正则表达式检测中文字符

**理由**:
- 简单高效,无需额外库
- 准确识别中文字符范围

**实现**:
```typescript
const hasChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text);
```

## Risks / Trade-offs

### Risk 1: MyMemory API 限流或不可用
**影响**: 用户无法使用翻译功能
**缓解**:
- 使用缓存减少 API 调用
- 显示友好的错误提示
- 后续版本可添加备用 API 支持

### Risk 2: 搜索引擎 DOM 结构变化
**影响**: 适配器失效,无法识别搜索框
**缓解**:
- 使用多个选择器作为备选
- 添加错误日志,便于快速定位问题
- 定期测试主流搜索引擎

### Risk 3: 浮层样式被页面样式覆盖
**影响**: UI 显示异常
**缓解**:
- 使用 Shadow DOM 隔离样式
- 使用高优先级的 CSS 选择器
- 添加 !important 标记关键样式

### Risk 4: 性能影响
**影响**: 页面加载变慢或卡顿
**缓解**:
- 使用防抖减少计算
- 缓存翻译结果
- 异步加载,不阻塞页面渲染
- 使用 MutationObserver 的 debounce

### Risk 5: 翻译质量不佳
**影响**: 用户体验下降
**缓解**:
- 显示原文和译文,用户可对比
- 后续版本可添加多个翻译源对比
- 收集用户反馈优化

## Migration Plan

**部署步骤**:
1. 开发完成后本地测试所有支持的搜索引擎
2. 打包插件并在 Chrome 中加载测试
3. 发布到 Chrome Web Store
4. 监控错误日志和用户反馈

**回滚策略**:
- 如果发现严重 bug,可快速发布禁用翻译功能的版本
- 通过 Options 页面提供功能开关,用户可自行禁用

**兼容性**:
- 新功能不影响现有 popup 和 options 功能
- 可通过配置完全禁用翻译功能

## Open Questions

1. **是否需要支持更多语言对?** (如英文→中文)
   - 决策: 第一版仅支持中文→英文,根据用户反馈决定是否扩展

2. **是否需要翻译历史记录?**
   - 决策: 第一版不实现,可作为后续功能

3. **是否需要支持自定义翻译 API?**
   - 决策: 第一版不支持,保持简单

4. **缓存容量限制如何处理?**
   - 决策: 限制最多 1000 条,使用 LRU 策略清理
