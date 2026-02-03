## ADDED Requirements

### Requirement: 缓存存储

系统 SHALL 使用 localStorage 存储翻译缓存。

#### Scenario: 缓存键生成

- **WHEN** 系统需要存储翻译结果
- **THEN** 系统 SHALL 使用输入文本的 MD5 hash 作为缓存键
- **AND** 缓存键 SHALL 包含语言对前缀(如 "zh-en:")

#### Scenario: 缓存值结构

- **WHEN** 系统存储缓存
- **THEN** 缓存值 SHALL 包含翻译结果、时间戳、源文本
- **AND** 缓存值 SHALL 使用 JSON 格式存储

#### Scenario: 存储容量管理

- **WHEN** localStorage 接近容量限制
- **THEN** 系统 SHALL 删除最旧的缓存条目
- **AND** 系统 SHALL 保留最近 1000 条缓存

### Requirement: 缓存读取

系统 SHALL 快速读取缓存的翻译结果。

#### Scenario: 缓存命中

- **WHEN** 用户输入已缓存的文本
- **THEN** 系统 SHALL 在 100ms 内返回缓存结果
- **AND** 系统 SHALL NOT 发起 API 请求

#### Scenario: 缓存未命中

- **WHEN** 用户输入未缓存的文本
- **THEN** 系统 SHALL 发起翻译 API 请求
- **AND** 系统 SHALL 在获得结果后更新缓存

### Requirement: 缓存过期

系统 SHALL 自动清理过期的缓存条目。

#### Scenario: 过期检查

- **WHEN** 系统读取缓存条目
- **THEN** 系统 SHALL 检查时间戳是否超过 30 天
- **AND** 过期条目 SHALL 被删除并重新翻译

#### Scenario: 定期清理

- **WHEN** 插件启动或每 24 小时
- **THEN** 系统 SHALL 扫描所有缓存条目
- **AND** 系统 SHALL 删除所有过期条目

### Requirement: 缓存同步

系统 SHALL 支持跨设备同步缓存(可选)。

#### Scenario: 使用 chrome.storage.sync

- **WHEN** 用户在 Options 启用"同步缓存"
- **THEN** 系统 SHALL 使用 chrome.storage.sync 存储常用翻译
- **AND** 缓存 SHALL 在用户的所有设备间同步
- **AND** 同步缓存 SHALL 限制在 100KB 以内

#### Scenario: 本地优先

- **WHEN** 同步功能禁用或不可用
- **THEN** 系统 SHALL 仅使用 localStorage
- **AND** 缓存 SHALL 保持在当前设备

### Requirement: 缓存统计

系统 SHALL 提供缓存使用统计信息。

#### Scenario: 统计数据

- **WHEN** 用户访问 Options 页面
- **THEN** 系统 SHALL 显示缓存条目数量
- **AND** 系统 SHALL 显示缓存占用空间
- **AND** 系统 SHALL 显示缓存命中率

#### Scenario: 清空缓存

- **WHEN** 用户点击"清空缓存"按钮
- **THEN** 系统 SHALL 删除所有翻译缓存
- **AND** 系统 SHALL 显示确认对话框
- **AND** 系统 SHALL 在清空后显示成功提示
