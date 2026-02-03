# Chrome Web Store 发布检查清单

## Manifest V3 合规性

- [x] 使用 `manifest_version: 3`
- [x] Background 使用 Service Worker (不是 background page)
- [x] Content Security Policy 符合要求
- [x] 权限最小化原则
- [x] 明确的 host_permissions

## 代码质量要求

- [x] 无混淆代码 (所有代码可读)
- [x] 无 `eval()` 或 `new Function()`
- [x] 无内联脚本 (使用 DOM API 而不是 innerHTML)
- [x] 无远程托管的代码
- [x] 所有依赖都打包在扩展中

## 隐私和安全

- [x] 隐私政策文档 (PRIVACY_POLICY.md)
- [x] 明确说明数据收集和使用
- [x] 本地存储数据 (localStorage + chrome.storage)
- [x] 用户可以清除所有数据
- [x] 第三方 API 使用透明 (MyMemory Translation API)

## 用户体验

- [x] 清晰的扩展描述
- [x] 功能易于理解
- [x] Options 页面提供配置
- [x] 错误处理友好
- [x] 加载状态提示

## 图标和资源

- [x] 16x16, 48x48, 128x128 图标
- [x] 图标清晰可辨识
- [x] 所有资源文件包含在扩展包中

## 权限说明

### storage
用于保存用户偏好设置和翻译缓存

### host_permissions
- `*://*.google.com/*` - 在 Google 搜索页面注入翻译功能
- `*://*.google.com.hk/*` - 在 Google 香港搜索页面注入翻译功能
- `*://*.baidu.com/*` - 在百度搜索页面注入翻译功能
- `*://*.bing.com/*` - 在 Bing 搜索页面注入翻译功能
- `*://github.com/*` - 在 GitHub 搜索页面注入翻译功能
- `https://api.mymemory.translated.net/*` - 调用翻译 API

## 发布前测试

### 功能测试
- [ ] 在 Google 搜索测试翻译功能
- [ ] 在 Baidu 搜索测试翻译功能
- [ ] 在 Bing 搜索测试翻译功能
- [ ] 在 GitHub 搜索测试翻译功能
- [ ] 测试缓存功能
- [ ] 测试 Options 页面配置
- [ ] 测试清空缓存功能

### 边界情况测试
- [ ] 纯英文输入不触发翻译
- [ ] 少于 2 个字符不触发翻译
- [ ] API 失败时显示友好错误
- [ ] 网络断开时的处理
- [ ] 快速连续输入的防抖效果

### 性能测试
- [ ] 缓存响应时间 < 100ms
- [ ] API 响应时间 < 5 秒
- [ ] 页面加载不受影响
- [ ] 内存占用合理

### 兼容性测试
- [ ] Chrome 最新版本
- [ ] Chrome 稳定版本
- [ ] 不同操作系统 (Windows, macOS, Linux)

## 提交材料准备

### 必需文件
- [x] manifest.json (符合 V3 规范)
- [x] 所有源代码文件
- [x] 图标文件 (16, 48, 128)
- [x] README.md
- [x] PRIVACY_POLICY.md

### Web Store 列表信息
- [ ] 扩展名称: Smart Search Translate
- [ ] 简短描述 (132 字符以内)
- [ ] 详细描述 (包含功能说明、使用方法)
- [ ] 分类: Productivity
- [ ] 语言: 中文、英文
- [ ] 截图 (至少 1 张, 推荐 3-5 张)
  - 搜索框翻译建议示例
  - Options 页面
  - 不同搜索引擎的使用场景
- [ ] 宣传图 (可选, 440x280 或 920x680)
- [ ] 宣传视频 (可选, YouTube 链接)

### 审核准备
- [ ] 测试账号 (如果需要)
- [ ] 使用说明文档
- [ ] 隐私政策链接
- [ ] 支持邮箱或网站

## 常见拒绝原因及预防

### 权限过度
✅ 已解决: 只请求必要的 storage 和 host_permissions

### 代码混淆
✅ 已解决: 所有代码可读,使用 TypeScript 编译但不混淆

### 隐私政策缺失
✅ 已解决: 提供了完整的 PRIVACY_POLICY.md

### CSP 违规
✅ 已解决: 不使用 eval, innerHTML 改用 DOM API

### 功能不明确
✅ 已解决: 清晰的描述和 Options 页面

## 发布后维护

- [ ] 监控用户反馈
- [ ] 及时修复 bug
- [ ] 定期更新以适应搜索引擎页面变化
- [ ] 保持与 Chrome 最新版本兼容

## 参考资源

- [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/)
