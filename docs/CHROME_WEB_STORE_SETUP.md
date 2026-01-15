# Chrome Web Store 自动发布设置指南

本指南将帮助你配置自动发布到 Chrome Web Store 的功能。

## 前提条件

1. Chrome Web Store 开发者账号（需支付 $5 一次性注册费）
2. 已在 Chrome Web Store 上传过至少一次你的扩展（获取 Extension ID）

## 步骤 1: 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 记下项目 ID:
   项目名称
   demumu
   项目编号
   744033335035
   项目 ID
   demumu

## 步骤 2: 启用 Chrome Web Store API

1. 在 Google Cloud Console 中，进入 "APIs & Services" > "Library"
2. 搜索 "Chrome Web Store API"
3. 点击启用

## 步骤 3: 创建 OAuth 2.0 凭证

1. 进入 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth client ID"
3. 如果提示配置同意屏幕，选择 "External" 并填写必要信息
4. 应用类型选择 "Web application"
5. 添加授权重定向 URI: `https://developers.google.com/oauthplayground`
6. 创建后，记下：
   - **Client ID**
   - **Client Secret**

## 步骤 4: 获取 Refresh Token

1. 访问 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. 点击右上角的设置图标（齿轮）
3. 勾选 "Use your own OAuth credentials"
4. 输入你的 Client ID 和 Client Secret
5. 在左侧 "Step 1" 中：
   - 找到 "Chrome Web Store API v1.1"
   - 选择 `https://www.googleapis.com/auth/chromewebstore`
6. 点击 "Authorize APIs"
7. 登录你的 Google 账号并授权
8. 在 "Step 2" 中，点击 "Exchange authorization code for tokens"
9. 记下 **Refresh Token**

## 步骤 5: 获取 Extension ID

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 找到你的扩展
3. Extension ID 显示在扩展名称下方（格式类似：`abcdefghijklmnopqrstuvwxyz123456`）

## 步骤 6: 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 "Settings" > "Secrets and variables" > "Actions"
3. 点击 "New repository secret" 并添加以下 secrets：

| Secret Name            | 值                 | 说明       |
| ---------------------- | ------------------ | ---------- |
| `CHROME_CLIENT_ID`     | 你的 Client ID     | 来自步骤 3 |
| `CHROME_CLIENT_SECRET` | 你的 Client Secret | 来自步骤 3 |
| `CHROME_REFRESH_TOKEN` | 你的 Refresh Token | 来自步骤 4 |
| `CHROME_EXTENSION_ID`  | 你的 Extension ID  | 来自步骤 5 |

## 步骤 7: 测试自动发布

1. 更新 `package.json` 和 `src/manifest.json` 中的版本号
2. 提交更改并推送到 GitHub
3. 创建版本标签：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. GitHub Actions 将自动：
   - 构建扩展
   - 上传到 Chrome Web Store
   - 创建 GitHub Release

## 故障排查

### 错误: "Invalid refresh token"

- Refresh token 可能已过期
- 重新执行步骤 4 获取新的 refresh token

### 错误: "Extension not found"

- 检查 Extension ID 是否正确
- 确保扩展已在 Chrome Web Store 上发布过至少一次

### 错误: "Insufficient permissions"

- 确保 OAuth 凭证有正确的权限范围
- 重新授权并获取新的 refresh token

### 上传成功但未发布

- 检查 Chrome Web Store Developer Dashboard
- 可能需要手动审核或有其他问题

## 安全注意事项

⚠️ **重要**:

- 永远不要将 secrets 提交到代码仓库
- 定期轮换 refresh token
- 只给必要的人员访问 GitHub secrets 的权限
- 监控 Chrome Web Store 的发布活动

## 手动发布（备选方案）

如果自动发布失败，你可以手动发布：

1. 运行 `pnpm build` 构建扩展
2. 将 `dist` 文件夹压缩为 zip
3. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. 上传 zip 文件
5. 填写更新说明并提交审核

## 参考资料

- [Chrome Web Store API 文档](https://developer.chrome.com/docs/webstore/api_index/)
- [chrome-webstore-upload 文档](https://github.com/fregante/chrome-webstore-upload)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
