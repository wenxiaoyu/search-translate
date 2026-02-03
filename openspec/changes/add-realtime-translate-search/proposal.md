## Why

当用户在搜索引擎(Google、Baidu、GitHub等)使用中文搜索时,搜索结果的准确性和相关性往往不如英文搜索。特别是在技术领域,英文搜索能获得更丰富、更准确的结果。本插件通过实时翻译用户输入,提供英文搜索建议,帮助用户快速切换到英文搜索,提升搜索体验。

## What Changes

- 新增实时翻译功能,监听搜索框输入并自动翻译中文为英文
- 在搜索框下方显示翻译建议浮层,用户可一键填入
- 集成免费翻译 API (MyMemory),支持离线缓存
- 支持主流搜索引擎: Google, Baidu, Bing, GitHub
- 添加性能优化: 防抖、缓存、智能语言检测
- 提供 Options 页面配置翻译功能开关和支持的网站

## Capabilities

### New Capabilities
- `realtime-translation`: 实时翻译搜索框输入,提供英文建议
- `search-engine-integration`: 在多个搜索引擎网站注入翻译功能
- `translation-ui`: 翻译建议浮层的 UI 组件和交互
- `translation-cache`: 翻译结果的本地缓存管理

### Modified Capabilities
<!-- 无现有功能需要修改 -->

## Impact

- `src/content/index.ts`: 扩展 content script,添加搜索框监听和翻译 UI 注入
- `src/background/index.ts`: 添加翻译 API 调用和缓存管理
- `src/options/Options.tsx`: 添加翻译功能配置选项
- `src/manifest.json`: 添加必要的权限(storage, 网络请求)
- 新增文件:
  - `src/content/translator.ts`: 翻译核心逻辑
  - `src/content/ui/TranslationSuggestion.tsx`: 翻译建议 UI 组件
  - `src/content/sites/`: 各搜索引擎的适配器
  - `src/utils/translationApi.ts`: 翻译 API 封装
  - `src/utils/cache.ts`: 缓存工具
