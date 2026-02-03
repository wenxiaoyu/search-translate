# Implementation Tasks: 实时翻译搜索功能

## 1. 基础工具和 API 封装

- [x] 1.1 创建翻译 API 工具 (src/utils/translationApi.ts)
  - 封装 MyMemory API 调用
  - 实现错误处理和超时控制
  - _Requirements: realtime-translation/调用翻译 API_

- [x] 1.2 创建缓存工具 (src/utils/cache.ts)
  - 实现 localStorage 缓存读写
  - 实现 MD5 hash 键生成
  - 实现过期检查和清理
  - _Requirements: translation-cache/缓存存储, translation-cache/缓存读取_

- [x] 1.3 创建防抖工具 (src/utils/debounce.ts)
  - 实现通用防抖函数
  - _Requirements: realtime-translation/防抖优化_

- [x] 1.4 创建语言检测工具 (src/utils/languageDetector.ts)
  - 实现中文字符检测
  - 实现最小字符数检查
  - _Requirements: realtime-translation/自动检测中文输入_

## 2. 搜索引擎适配器

- [x] 2.1 创建适配器接口 (src/content/adapters/SearchEngineAdapter.ts)
  - 定义统一的适配器接口
  - _Requirements: search-engine-integration/站点适配器架构_

- [x] 2.2 实现 Google 适配器 (src/content/adapters/GoogleAdapter.ts)
  - 识别 Google 搜索框
  - 确定浮层插入位置
  - _Requirements: search-engine-integration/支持多个搜索引擎_

- [x] 2.3 实现 Baidu 适配器 (src/content/adapters/BaiduAdapter.ts)
  - 识别百度搜索框
  - 适配百度页面结构
  - _Requirements: search-engine-integration/支持多个搜索引擎_

- [x] 2.4 实现 Bing 适配器 (src/content/adapters/BingAdapter.ts)
  - 识别 Bing 搜索框
  - _Requirements: search-engine-integration/支持多个搜索引擎_

- [x] 2.5 实现 GitHub 适配器 (src/content/adapters/GitHubAdapter.ts)
  - 识别 GitHub 搜索框
  - _Requirements: search-engine-integration/支持多个搜索引擎_

- [x] 2.6 创建适配器工厂 (src/content/adapters/AdapterFactory.ts)
  - 根据 URL 选择适配器
  - _Requirements: search-engine-integration/站点适配器架构_

## 3. 翻译 UI 组件

- [x] 3.1 创建翻译建议浮层类 (src/content/ui/TranslationSuggestion.ts)
  - 创建浮层 DOM 结构
  - 使用 Shadow DOM 隔离样式
  - 实现位置计算和定位
  - _Requirements: translation-ui/翻译建议浮层显示_

- [x] 3.2 实现浮层样式 (src/content/ui/TranslationSuggestion.css)
  - 卡片样式(阴影、圆角、背景)
  - 响应式布局
  - 加载动画
  - _Requirements: translation-ui/翻译建议浮层显示_

- [x] 3.3 实现用户交互
  - 点击填入搜索框
  - 复制按钮功能
  - 关闭浮层(点击外部、ESC 键)
  - 键盘导航(Tab、Enter)
  - _Requirements: translation-ui/用户交互_

- [x] 3.4 实现加载状态显示
  - 加载动画
  - 加载超时提示
  - _Requirements: translation-ui/加载状态_

- [x] 3.5 实现错误提示
  - 翻译失败提示
  - 网络错误提示
  - 重试按钮
  - _Requirements: translation-ui/错误提示_

## 4. Content Script 核心逻辑

- [x] 4.1 扩展 content script 主文件 (src/content/index.ts)
  - 初始化适配器
  - 监听搜索框输入事件
  - 集成防抖和语言检测
  - _Requirements: search-engine-integration/搜索框识别_

- [x] 4.2 创建翻译管理器 (src/content/TranslationManager.ts)
  - 协调适配器、UI、API 调用
  - 管理翻译请求生命周期
  - 处理缓存逻辑
  - _Requirements: realtime-translation/调用翻译 API_

- [x] 4.3 实现 MutationObserver
  - 监听动态加载的搜索框
  - 支持多个搜索框
  - _Requirements: search-engine-integration/搜索框识别_

## 5. Background Service Worker

- [x] 5.1 扩展 background script (src/background/index.ts)
  - 添加翻译消息监听器
  - 调用翻译 API
  - 管理缓存(读取和写入)
  - _Requirements: realtime-translation/调用翻译 API_

- [x] 5.2 实现消息通信协议
  - 定义 TRANSLATE 消息类型
  - 处理请求和响应
  - 错误处理
  - _Requirements: realtime-translation/调用翻译 API_

## 6. Options 页面配置

- [x] 6.1 扩展 Options 组件 (src/options/Options.tsx)
  - 添加翻译功能开关
  - 添加支持网站配置(启用/禁用)
  - 添加缓存统计显示
  - 添加清空缓存按钮
  - _Requirements: search-engine-integration/用户配置支持, translation-cache/缓存统计_

- [x] 6.2 实现配置存储
  - 使用 chrome.storage.sync 存储配置
  - 实现配置读取和更新
  - _Requirements: search-engine-integration/用户配置支持_

## 7. Manifest 和权限

- [x] 7.1 更新 manifest.json
  - 添加 storage 权限
  - 添加 host_permissions (翻译 API 域名)
  - 更新 content_scripts 匹配规则
  - _Requirements: search-engine-integration/支持多个搜索引擎_

## 8. 测试和优化

- [x] 8.1 本地测试所有搜索引擎
  - 测试 Google 搜索
  - 测试 Baidu 搜索
  - 测试 Bing 搜索
  - 测试 GitHub 搜索
  - _Requirements: search-engine-integration/支持多个搜索引擎_

- [x] 8.2 测试边界情况
  - 测试纯英文输入(不触发翻译)
  - 测试少于 2 字符(不触发翻译)
  - 测试 API 失败场景
  - 测试缓存命中和未命中
  - _Requirements: realtime-translation/自动检测中文输入_

- [x] 8.3 性能优化验证
  - 验证防抖效果
  - 验证缓存响应时间 < 100ms
  - 验证 API 响应时间 < 3 秒
  - _Requirements: realtime-translation/防抖优化, translation-cache/缓存读取_

- [x] 8.4 UI/UX 测试
  - 测试浮层位置和样式
  - 测试响应式布局
  - 测试键盘导航
  - 测试加载和错误状态
  - _Requirements: translation-ui/翻译建议浮层显示, translation-ui/用户交互_

## 9. Chrome Web Store 合规性

- [x] 9.1 Manifest V3 合规
  - 更新为 Manifest V3 格式
  - 使用 service_worker 替代 background page
  - 添加 CSP 策略
  - _Requirements: Chrome Web Store 技术要求_

- [x] 9.2 CSP 合规性修复
  - 移除所有 innerHTML 使用
  - 使用 DOM API (createElement, appendChild, textContent)
  - 验证无 eval 或动态代码执行
  - _Requirements: Chrome Web Store 技术要求_

- [x] 9.3 图标格式转换
  - 将 SVG 图标转换为 PNG 格式
  - 更新 manifest.json 引用 PNG 文件
  - 更新构建脚本复制 PNG 文件
  - _Requirements: Chrome Web Store 技术要求_

- [x] 9.4 隐私政策和文档
  - 创建 PRIVACY_POLICY.md
  - 创建 Web Store 发布检查清单
  - 更新 README.md 说明
  - _Requirements: Chrome Web Store 技术要求_

- [x] 9.5 构建验证
  - 修复 TypeScript 编译错误
  - 验证构建成功
  - 验证 dist 目录结构正确
  - _Requirements: Chrome Web Store 技术要求_
