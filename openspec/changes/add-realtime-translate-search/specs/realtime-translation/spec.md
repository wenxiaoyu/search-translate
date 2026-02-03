## ADDED Requirements

### Requirement: 自动检测中文输入

系统 SHALL 自动检测搜索框中的中文输入并触发翻译。

#### Scenario: 检测到中文字符

- **WHEN** 用户在搜索框输入包含中文字符的文本
- **THEN** 系统 SHALL 识别为需要翻译的内容
- **AND** 系统 SHALL 在用户停止输入 500ms 后触发翻译请求

#### Scenario: 纯英文输入不触发

- **WHEN** 用户输入的内容全部为英文字符
- **THEN** 系统 SHALL NOT 触发翻译
- **AND** 翻译建议浮层 SHALL 保持隐藏状态

#### Scenario: 最小字符数限制

- **WHEN** 用户输入少于 2 个字符
- **THEN** 系统 SHALL NOT 触发翻译
- **AND** 翻译建议浮层 SHALL 保持隐藏状态

### Requirement: 调用翻译 API

系统 SHALL 使用 MyMemory 翻译 API 将中文翻译为英文。

#### Scenario: 成功翻译

- **WHEN** 系统发送翻译请求到 MyMemory API
- **THEN** 系统 SHALL 接收英文翻译结果
- **AND** 系统 SHALL 在 3 秒内返回结果
- **AND** 翻译结果 SHALL 保存到本地缓存

#### Scenario: API 请求失败

- **WHEN** 翻译 API 请求失败或超时
- **THEN** 系统 SHALL 显示友好的错误提示
- **AND** 系统 SHALL 尝试从缓存中查找历史翻译
- **AND** 系统 SHALL 记录错误日志

#### Scenario: API 限流处理

- **WHEN** API 返回限流错误(429)
- **THEN** 系统 SHALL 显示"翻译服务繁忙"提示
- **AND** 系统 SHALL 使用缓存的翻译结果(如果存在)

### Requirement: 防抖优化

系统 SHALL 实现防抖机制以减少不必要的 API 调用。

#### Scenario: 用户连续输入

- **WHEN** 用户连续快速输入字符
- **THEN** 系统 SHALL 等待用户停止输入 500ms
- **AND** 系统 SHALL 仅对最终输入内容发起一次翻译请求

#### Scenario: 取消待处理请求

- **WHEN** 用户在翻译请求发送前修改输入
- **THEN** 系统 SHALL 取消之前的待处理请求
- **AND** 系统 SHALL 重新开始防抖计时

### Requirement: 翻译结果缓存

系统 SHALL 缓存翻译结果以提升性能和减少 API 调用。

#### Scenario: 缓存命中

- **WHEN** 用户输入之前翻译过的内容
- **THEN** 系统 SHALL 直接从缓存返回翻译结果
- **AND** 系统 SHALL NOT 发起新的 API 请求
- **AND** 响应时间 SHALL 少于 100ms

#### Scenario: 缓存存储

- **WHEN** 系统获得新的翻译结果
- **THEN** 系统 SHALL 将结果存储到 localStorage
- **AND** 缓存键 SHALL 为输入文本的 hash 值
- **AND** 缓存 SHALL 包含翻译结果和时间戳

#### Scenario: 缓存过期

- **WHEN** 缓存条目超过 30 天
- **THEN** 系统 SHALL 自动清理过期缓存
- **AND** 系统 SHALL 为该内容发起新的翻译请求
