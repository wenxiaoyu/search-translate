# 📌 图标转换待办事项

Chrome Web Store **要求使用 PNG 格式**的图标,不接受 SVG 格式。

## 🚨 当前状态

- ❌ 现有图标: SVG 格式 (src/icons/icon-*.svg)
- ✅ manifest.json: 已更新为使用 .png 扩展名
- ⏳ 需要: 生成 PNG 格式图标

## ✅ 快速解决方案 (推荐)

### 方法 1: 在线转换 (最简单)

访问以下任一网站上传 SVG 文件并下载 PNG:

1. **CloudConvert**: https://cloudconvert.com/svg-to-png
   - 上传 `src/icons/icon-16.svg` → 设置尺寸 16x16 → 下载为 `icon-16.png`
   - 上传 `src/icons/icon-48.svg` → 设置尺寸 48x48 → 下载为 `icon-48.png`
   - 上传 `src/icons/icon-128.svg` → 设置尺寸 128x128 → 下载为 `icon-128.png`

2. **Convertio**: https://convertio.co/svg-png/
   - 支持批量转换

3. 将下载的 PNG 文件放到 `src/icons/` 目录

### 方法 2: 使用 Node.js 脚本

```bash
# 安装依赖 (选择其一)
pnpm add -D sharp
# 或
pnpm add -D canvas

# 运行转换脚本
pnpm run icons:convert
# 或生成新的 PNG 图标
pnpm run icons:generate-png
```

### 方法 3: 使用图像编辑软件

- **Photoshop**: 打开 SVG → 导出为 PNG
- **GIMP**: 打开 SVG → 缩放 → 导出为 PNG
- **Inkscape**: 打开 SVG → 导出 PNG 图像

## 📋 需要的文件

确保以下 PNG 文件存在于 `src/icons/` 目录:

- [ ] icon-16.png (16x16 像素)
- [ ] icon-48.png (48x48 像素)
- [ ] icon-128.png (128x128 像素)

## 🎨 图标设计建议

当前占位符图标比较简单,建议为生产环境设计专业图标:

**设计要点:**
- 清晰简洁,在 16x16 尺寸下仍可辨识
- 体现翻译/语言转换的概念
- 使用品牌色彩
- 考虑深色/浅色背景的兼容性

**推荐工具:**
- Figma (免费)
- Canva (免费)
- RealFaviconGenerator (https://realfavicongenerator.net/)

## ✅ 完成后

1. 验证 PNG 文件已生成
2. 运行 `pnpm build` 测试构建
3. 在 Chrome 中加载 `dist` 目录测试
4. (可选) 删除 SVG 文件: `rm src/icons/*.svg`

## 📚 详细文档

查看 `docs/ICON_CONVERSION.md` 了解更多转换方法和图标设计指南。
