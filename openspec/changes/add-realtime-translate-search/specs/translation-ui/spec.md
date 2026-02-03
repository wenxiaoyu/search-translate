## ADDED Requirements

### Requirement: 翻译建议浮层显示

系统 SHALL 在搜索框下方显示翻译建议浮层。

#### Scenario: 浮层位置

- **WHEN** 翻译结果返回
- **THEN** 系统 SHALL 在搜索框正下方显示浮层
- **AND** 浮层 SHALL 与搜索框左对齐
- **AND** 浮层 SHALL 不遮挡搜索框或搜索建议

#### Scenario: 浮层样式

- **WHEN** 浮层显示时
- **THEN** 浮层 SHALL 使用卡片样式(阴影、圆角、白色背景)
- **AND** 浮层 SHALL 显示翻译图标(🌐)和翻译结果
- **AND** 浮层 SHALL 有明显的视觉层级(z-index 高于页面内容)

#### Scenario: 响应式布局

- **WHEN** 搜索框宽度变化
- **THEN** 浮层宽度 SHALL 自动适配搜索框宽度
- **AND** 浮层 SHALL 在移动端正确显示

### Requirement: 用户交互

系统 SHALL 提供便捷的交互方式填入翻译结果。

#### Scenario: 点击填入

- **WHEN** 用户点击翻译建议
- **THEN** 系统 SHALL 将英文翻译填入搜索框
- **AND** 系统 SHALL 隐藏翻译浮层
- **AND** 搜索框 SHALL 获得焦点

#### Scenario: 复制翻译

- **WHEN** 用户点击"复制"按钮
- **THEN** 系统 SHALL 将翻译结果复制到剪贴板
- **AND** 系统 SHALL 显示"已复制"提示(1 秒后消失)

#### Scenario: 关闭浮层

- **WHEN** 用户点击浮层外部区域或按 ESC 键
- **THEN** 系统 SHALL 隐藏翻译浮层
- **AND** 搜索框内容 SHALL 保持不变

#### Scenario: 键盘导航

- **WHEN** 用户按 Tab 键
- **THEN** 焦点 SHALL 移动到翻译建议
- **AND** 用户按 Enter 键 SHALL 填入翻译结果

### Requirement: 加载状态

系统 SHALL 显示翻译请求的加载状态。

#### Scenario: 加载中

- **WHEN** 翻译请求正在进行
- **THEN** 系统 SHALL 显示加载动画(旋转图标或进度条)
- **AND** 浮层 SHALL 显示"翻译中..."文本

#### Scenario: 加载超时

- **WHEN** 翻译请求超过 5 秒未返回
- **THEN** 系统 SHALL 显示"翻译超时"提示
- **AND** 系统 SHALL 提供"重试"按钮

### Requirement: 错误提示

系统 SHALL 友好地显示错误信息。

#### Scenario: 翻译失败

- **WHEN** 翻译 API 返回错误
- **THEN** 系统 SHALL 显示"翻译失败,请稍后重试"
- **AND** 系统 SHALL 提供"重试"按钮
- **AND** 错误提示 SHALL 在 3 秒后自动消失

#### Scenario: 网络错误

- **WHEN** 网络连接失败
- **THEN** 系统 SHALL 显示"网络连接失败"提示
- **AND** 系统 SHALL 建议检查网络连接

### Requirement: 样式隔离

系统 SHALL 确保浮层样式不受页面样式影响。

#### Scenario: CSS 隔离

- **WHEN** 浮层注入到页面
- **THEN** 浮层 SHALL 使用 Shadow DOM 或唯一的 CSS 类名前缀
- **AND** 页面样式 SHALL NOT 影响浮层样式
- **AND** 浮层样式 SHALL NOT 影响页面布局
