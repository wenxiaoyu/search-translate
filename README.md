# Search Translate - Chrome Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](https://github.com/wenxiaoyu/search-translate)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Chrome extension that provides real-time translation suggestions for search engines, helping you search in English for better results.

## ✨ Features

- 🌐 **Real-time Translation**: Automatically translates Chinese input to English as you type
- 🔍 **Multi-Engine Support**: Works on Google, Baidu, Bing, GitHub, and Stack Overflow
- ⚡ **Smart Caching**: Caches translations locally for instant results
- 🎯 **One-Click Search**: Click to fill and search automatically
- 📋 **Copy Support**: Copy translations to clipboard
- 🎨 **Beautiful Design**: Glass-morphism UI with dark mode support
- ⚙️ **Customizable**: Configure which search engines to enable
- 🚀 **Performance Optimized**: Debouncing and caching for smooth experience
- 🔒 **Privacy First**: All data stored locally, no tracking

## 🎯 Use Case

When searching for technical content, English keywords often yield better results than Chinese. This extension helps you:

1. Type your search query in Chinese
2. Get instant English translation suggestions
3. Click to fill and search automatically
4. Get more accurate and comprehensive search results

## 🚀 Quick Start

### For Users

1. **Install from Chrome Web Store** (coming soon)
   - Or load unpacked from `dist` folder for development

2. **Visit any supported search engine**
   - Google, Baidu, Bing, GitHub, Stack Overflow

3. **Start typing in Chinese**
   - Translation suggestions appear automatically

4. **Click to search**
   - Click the translation to fill and search
   - Or copy to clipboard

## 📦 Installation

### From Chrome Web Store (Recommended)
Coming soon! The extension is currently under review.

### Manual Installation (Development)

1. Download or clone this repository
2. Run `npm install` and `npm run build`
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the `dist` folder

## 🛠️ For Developers

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository:

```bash
git clone https://github.com/wenxiaoyu/search-translate.git
cd search-translate
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

#### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── background/          # Background service worker
│   └── index.ts        # Translation API calls and caching
├── content/            # Content scripts
│   ├── adapters/       # Search engine adapters
│   │   ├── GoogleAdapter.ts
│   │   ├── BaiduAdapter.ts
│   │   ├── BingAdapter.ts
│   │   ├── GitHubAdapter.ts
│   │   └── StackOverflowAdapter.ts
│   ├── ui/             # UI components
│   │   └── TranslationSuggestion.ts
│   ├── TranslationManager.ts
│   └── index.ts
├── popup/              # Extension popup UI (React)
├── options/            # Options/settings page (React)
├── utils/              # Utility functions
│   ├── translationApi.ts
│   ├── cache.ts
│   ├── debounce.ts
│   └── languageDetector.ts
└── manifest.json       # Extension manifest (V3)
```

## 🔧 Technical Details

### Architecture

- **Manifest V3**: Fully compliant with Chrome's latest extension API
- **Service Worker**: Background processing for API calls
- **Content Scripts**: Injected into search engine pages
- **Adapter Pattern**: Easy to add support for new search engines
- **Shadow DOM**: Style isolation for UI components

### Translation API

Uses [MyMemory Translation API](https://mymemory.translated.net):
- Free tier: 1000 calls/day
- No API key required
- Good translation quality

### Performance Optimizations

- **Debouncing**: 500ms delay to reduce API calls
- **Caching**: 30-day local cache with LRU eviction
- **Language Detection**: Only translates Chinese input
- **Minimum Length**: Requires at least 2 characters

### Privacy & Security

- ✅ **No Data Collection**: We don't collect any personal data
- ✅ **Local Storage**: All data stored in your browser
- ✅ **No Tracking**: No analytics or tracking scripts
- ✅ **CSP Compliant**: Strict Content Security Policy
- ✅ **Minimal Permissions**: Only requests necessary permissions

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## 🌐 Supported Search Engines

- ✅ Google (google.com, google.com.hk)
- ✅ Baidu (baidu.com)
- ✅ Bing (bing.com)
- ✅ GitHub (github.com)
- ✅ Stack Overflow (stackoverflow.com, stackexchange.com)

Want to add more? Check out the [adapter pattern](src/content/adapters/) - it's easy to extend!

## 📦 Building for Production

```bash
pnpm build
```

This creates an optimized build in the `dist` folder.

### Publishing to Chrome Web Store

See [docs/WEB_STORE_CHECKLIST.md](docs/WEB_STORE_CHECKLIST.md) for the complete checklist.

## 🤖 CI/CD

GitHub Actions workflows:

- **CI Pipeline** (`ci.yml`): Runs on every push/PR
  - Linting and type checking
  - Build verification

- **Release Pipeline** (`release.yml`): Triggered by version tags
  - Production build
  - Zip package creation
  - Chrome Web Store upload
  - GitHub Release creation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 5
- **Package Manager**: pnpm
- **Code Quality**: ESLint 9, Prettier, Husky
- **CI/CD**: GitHub Actions
- **Chrome API**: Manifest V3

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php)
- [OpenSpec Documentation](openspec/project.md)

## 🙏 Acknowledgments

- Translation powered by [MyMemory](https://mymemory.translated.net)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Note**: This extension is designed to help users get better search results by providing English translations. It does not modify search results or inject ads.
