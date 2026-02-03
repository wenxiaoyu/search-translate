# Icon Conversion Guide

Chrome Web Store requires PNG format icons, not SVG. This guide explains how to convert the existing SVG icons to PNG.

## Quick Solution: Online Conversion

The easiest way is to use online tools:

1. **CloudConvert** (https://cloudconvert.com/svg-to-png)
   - Upload each SVG file (icon-16.svg, icon-48.svg, icon-128.svg)
   - Set output size to match (16x16, 48x48, 128x128)
   - Download the PNG files

2. **Convertio** (https://convertio.co/svg-png/)
   - Similar process, supports batch conversion

3. **SVGOMG** (https://jakearchibald.github.io/svgomg/)
   - Optimize SVG first, then convert

## Method 1: Using Node.js Scripts

We provide two scripts for automatic conversion:

### Option A: Using Sharp (Recommended)

```bash
# Install sharp
pnpm add -D sharp

# Run conversion script
node scripts/convert-svg-to-png.js
```

### Option B: Using Canvas

```bash
# Install canvas
pnpm add -D canvas

# Run generation script
node scripts/generate-png-icons.js
```

## Method 2: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Convert each icon
magick src/icons/icon-16.svg -resize 16x16 src/icons/icon-16.png
magick src/icons/icon-48.svg -resize 48x48 src/icons/icon-48.png
magick src/icons/icon-128.svg -resize 128x128 src/icons/icon-128.png
```

## Method 3: Using Inkscape (GUI)

1. Open each SVG file in Inkscape
2. File → Export PNG Image
3. Set width and height to match the icon size
4. Export to `src/icons/icon-{size}.png`

## Method 4: Using GIMP (GUI)

1. Open each SVG file in GIMP
2. Image → Scale Image
3. Set dimensions to match (16x16, 48x48, 128x128)
4. File → Export As → PNG
5. Save to `src/icons/icon-{size}.png`

## After Conversion

1. ✅ Verify PNG files exist in `src/icons/`:
   - icon-16.png
   - icon-48.png
   - icon-128.png

2. ✅ manifest.json has been updated to use .png extensions

3. ✅ Test the extension:
   ```bash
   pnpm build
   # Load dist folder in Chrome
   ```

4. ✅ (Optional) Delete SVG files:
   ```bash
   rm src/icons/*.svg
   ```

## Icon Requirements for Chrome Web Store

- **Format**: PNG (required)
- **Sizes**: 16x16, 48x48, 128x128 (all required)
- **Transparency**: Supported
- **Color Space**: RGB
- **Max File Size**: No specific limit, but keep reasonable (< 1MB each)

## Design Tips

For better icons:

1. **Use a professional tool**: Figma, Sketch, Adobe Illustrator
2. **Follow Material Design**: https://material.io/design/iconography
3. **Test at all sizes**: Ensure clarity at 16x16
4. **Use simple shapes**: Avoid fine details at small sizes
5. **Consider dark mode**: Test on both light and dark backgrounds

## Recommended Icon Generators

- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/
- **IconKitchen**: https://icon.kitchen/

These tools can generate all required sizes from a single source image.

## Current Icon Design

The current placeholder icons feature:
- Gradient background (purple to blue)
- Globe emoji (🌐) representing translation
- Rounded corners

For production, consider creating a custom icon that:
- Represents translation/language
- Is recognizable at small sizes
- Matches your brand identity
