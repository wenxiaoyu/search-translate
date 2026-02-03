## ADDED Requirements

### Requirement: 支持多个搜索引擎

系统 SHALL 在多个主流搜索引擎网站上提供翻译功能。

#### Scenario: Google 搜索支持

- **WHEN** 用户访问 google.com 或 google.com.hk
- **THEN** 系统 SHALL 识别 Google 搜索框
- **AND** 系统 SHALL 注入翻译功能到搜索框
- **AND** 翻译建议 SHALL 显示在搜索框下方

#### Scenario: Baidu 搜索支持

- **WHEN** 用户访问 baidu.com
- **THEN** 系统 SHALL 识别百度搜索框
- **AND** 系统 SHALL 注入翻译功能到搜索框
- **AND** 翻译建议 SHALL 适配百度页面样式

#### Scenario: Bing 搜索支持

- **WHEN** 用户访问 bing.com
- **THEN** 系统 SHALL 识别 Bing 搜索框
- **AND** 系统 SHALL 注入翻译功能到搜索框

#### Scenario: GitHub 搜索支持

- **WHEN** 用户访问 github.com/search
- **THEN** 系统 SHALL 识别 GitHub 搜索框
- **AND** 系统 SHALL 注入翻译功能到搜索框

### Requirement: 搜索框识别

系统 SHALL 准确识别各搜索引擎的搜索输入框。

#### Scenario: 动态加载的搜索框

- **WHEN** 搜索框通过 JavaScript 动态加载
- **THEN** 系统 SHALL 使用 MutationObserver 监听 DOM 变化
- **AND** 系统 SHALL 在搜索框出现后立即注入功能

#### Scenario: 多个搜索框

- **WHEN** 页面存在多个搜索框(如首页和结果页)
- **THEN** 系统 SHALL 为所有搜索框注入翻译功能
- **AND** 每个搜索框 SHALL 有独立的翻译建议浮层

### Requirement: 站点适配器架构

系统 SHALL 使用适配器模式支持不同搜索引擎。

#### Scenario: 添加新搜索引擎

- **WHEN** 需要支持新的搜索引擎
- **THEN** 开发者 SHALL 创建新的适配器类
- **AND** 适配器 SHALL 实现统一的接口(getSearchInput, getInsertPosition)
- **AND** 系统 SHALL 自动加载并使用新适配器

#### Scenario: 适配器选择

- **WHEN** content script 在页面加载时运行
- **THEN** 系统 SHALL 根据当前域名选择对应的适配器
- **AND** 系统 SHALL 使用适配器提供的选择器定位搜索框

### Requirement: 用户配置支持

系统 SHALL 允许用户配置启用的搜索引擎。

#### Scenario: 禁用特定网站

- **WHEN** 用户在 Options 页面禁用某个搜索引擎
- **THEN** 系统 SHALL NOT 在该网站注入翻译功能
- **AND** 配置 SHALL 保存到 chrome.storage.sync

#### Scenario: 默认启用所有

- **WHEN** 用户首次安装插件
- **THEN** 所有支持的搜索引擎 SHALL 默认启用
- **AND** 用户 SHALL 可以在 Options 页面查看和修改
