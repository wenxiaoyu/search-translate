# Chrome Web Store Listing - Search Translate

## Basic Information

### Extension Name
```
Search Translate
```

### Short Description (132 characters max)
```
Real-time translation for search engines. Translate Chinese to English instantly for better search results.
```

### Detailed Description (16,000 characters max)

```
🌐 Search Translate - Your Smart Search Companion

Search Translate helps you search more effectively by providing real-time translation suggestions as you type. Perfect for users who want to search in English for better, more comprehensive results.

✨ KEY FEATURES

🔄 Real-Time Translation
• Automatically detects Chinese input and translates to English
• Instant suggestions appear as you type
• Smart caching for lightning-fast results

🎯 One-Click Actions
• Click translated text to fill search box and search automatically
• Copy translations to clipboard with one click
• Drag and reposition the suggestion window anywhere

🌍 Multi-Engine Support
• Google Search
• Bing Search
• Baidu Search
• GitHub Search
• Stack Overflow
• Stack Exchange

⚡ Performance Optimized
• Debounced input for smooth typing experience
• Local caching reduces API calls
• Lightweight and fast - won't slow down your browser

🎨 Beautiful Design
• Elegant glass-morphism UI
• Subtle light and shadow effects
• Dark mode support
• Responsive and adaptive positioning

🔒 Privacy First
• All translations cached locally
• No tracking or analytics
• No personal data collection
• Open source and transparent

📱 Smart Features
• Automatic boundary detection - never goes off-screen
• Intelligent positioning based on available space
• Keyboard shortcuts (ESC to close)
• Click outside to dismiss

🎓 PERFECT FOR

• Developers searching for technical documentation
• Students researching academic papers
• Professionals looking for international resources
• Anyone who wants better search results in English

💡 HOW IT WORKS

1. Visit any supported search engine
2. Start typing in Chinese
3. See instant English translation suggestions
4. Click to search or copy the translation
5. Get better, more comprehensive results

🚀 WHY SEARCH TRANSLATE?

English search queries often return more comprehensive and up-to-date results, especially for:
• Technical documentation
• Programming tutorials
• Scientific research
• International news
• Product reviews

Search Translate bridges the language gap, making it easy to search in English without manually translating your queries.

🔧 CUSTOMIZABLE

• Enable/disable for specific search engines
• Configure translation preferences
• Adjust suggestion display settings

📝 OPEN SOURCE

Search Translate is open source and welcomes contributions. Visit our GitHub repository to:
• Report issues
• Suggest features
• Contribute code
• Review the source

🆓 FREE FOREVER

No subscriptions, no hidden fees, no premium features. Search Translate is completely free and always will be.

---

⭐ If you find Search Translate helpful, please leave a review and share it with others!

🐛 Found a bug or have a suggestion? Contact us through the support tab or visit our GitHub repository.

🌟 Happy searching!
```

### Category
```
Productivity
```

### Language
```
English (United States)
```

---

## Store Listing Assets

### Icon (128x128)
```
Location: src/icons/icon-128.png
Status: ✅ Ready
```

### Screenshots (1280x800 or 640x400)

**Required: 1-5 screenshots**

#### Screenshot 1: Main Feature - Translation Suggestion
**Title:** Real-Time Translation Suggestions
**Description:** Get instant English translations as you type in Chinese

#### Screenshot 2: One-Click Search
**Title:** One-Click Search
**Description:** Click translated text to automatically fill and search

#### Screenshot 3: Multi-Engine Support
**Title:** Works Everywhere
**Description:** Supports Google, Bing, Baidu, GitHub, and Stack Overflow

#### Screenshot 4: Beautiful Design
**Title:** Elegant & Intuitive
**Description:** Glass-morphism design with dark mode support

#### Screenshot 5: Privacy Focused
**Title:** Privacy First
**Description:** All data stored locally, no tracking

**Note:** Screenshots need to be created. Recommended tool: Browser screenshot or design tool

---

## Promotional Assets (Optional but Recommended)

### Small Promo Tile (440x280)
```
Status: ⚠️ To be created
Content: Extension icon + "Search Translate" text + tagline
```

### Large Promo Tile (920x680)
```
Status: ⚠️ To be created
Content: Feature showcase with screenshots
```

### Marquee Promo Tile (1400x560)
```
Status: ⚠️ To be created
Content: Hero image with key features
```

---

## Additional Information

### Official Website
```
https://github.com/wenxiaoyu/search-translate
```

### Support URL
```
https://github.com/wenxiaoyu/search-translate/issues
```

### Privacy Policy URL
```
See: PRIVACY_POLICY.md
```

---

## Permissions Justification

### Storage Permission
```
Reason: Store user preferences and translation cache locally for better performance
```

**Detailed Explanation:**
```
The storage permission is required to:
1. Cache translation results locally for faster performance and reduced API calls
2. Store user preferences (enable/disable settings, preferred search engines)
3. Save usage statistics (translation count, search count) for display in the popup

All data is stored locally on the user's device. No data is transmitted to external servers or third parties.
```

### Host Permissions
```
Reason: Access search engine pages to inject translation functionality and call translation APIs
```

**Search Engine Hosts:**
```
*://*.google.com/*
*://*.google.com.hk/*
*://*.baidu.com/*
*://*.bing.com/*
*://github.com/*
*://*.stackoverflow.com/*
*://*.stackexchange.com/*
```

**Justification:**
```
Host permissions for search engine domains are required to:
1. Inject the translation suggestion UI into search engine pages
2. Detect when users type in search boxes on these sites
3. Display translation suggestions in real-time
4. Enable one-click search functionality

These permissions are essential for the extension's core functionality. The extension only activates on these specific search engine domains.
```

**Translation API Hosts:**
```
https://api.mymemory.translated.net/*
https://fanyi.baidu.com/*
```

**Justification:**
```
Host permissions for translation API domains are required to:
1. Send text to translation services for Chinese-to-English translation
2. Receive translation results from these APIs
3. Provide the core translation functionality

These are public translation APIs. The extension only sends the search query text (no personal information) to these services.
```

---

## Single Purpose Statement

**Single Purpose:**
```
This extension serves a single purpose: to provide real-time translation suggestions from Chinese to English on search engine pages, helping users search more effectively.
```

**Detailed Explanation:**
```
Search Translate is designed exclusively to enhance the search experience by automatically translating Chinese search queries into English. The extension:

1. Detects when users type Chinese text in search boxes
2. Provides instant English translation suggestions
3. Allows users to click the translation to automatically search

All functionality is focused on this single purpose: facilitating better search results through real-time translation. The extension does not collect user data, display ads, or perform any other functions beyond translation assistance for search queries.
```

---

## Version Information

### Version Number
```
0.2.0
```

### Version Description
```
Initial public release with core translation features:
- Real-time translation suggestions
- Multi-engine support (Google, Bing, Baidu, GitHub, Stack Overflow)
- One-click search and copy
- Beautiful glass-morphism UI
- Dark mode support
- Privacy-focused local caching
```

---

## Distribution

### Visibility
```
Public
```

### Regions
```
All regions
```

### Pricing
```
Free
```

---

## Review Checklist

Before submitting:

- [ ] All required fields filled
- [ ] Extension name is clear and descriptive
- [ ] Description highlights key features and benefits
- [ ] Screenshots showcase main functionality (1-5 images)
- [ ] Icon is 128x128 PNG with transparent background
- [ ] Privacy policy is accessible
- [ ] Support URL is valid
- [ ] Extension has been tested in Chrome
- [ ] No prohibited content or functionality
- [ ] Permissions are justified and minimal
- [ ] Version number follows semantic versioning

---

## Post-Launch

### Marketing Channels
- [ ] Product Hunt launch
- [ ] Reddit (r/chrome, r/productivity)
- [ ] Twitter/X announcement
- [ ] LinkedIn post
- [ ] Dev.to article
- [ ] Hacker News (Show HN)
- [ ] GitHub README badge

### Monitoring
- [ ] Set up GitHub Issues for bug reports
- [ ] Monitor Chrome Web Store reviews
- [ ] Track installation metrics
- [ ] Collect user feedback

---

## Contact Information

**Developer Name:** [Your Name]
**Developer Email:** [Your Email]
**Support Email:** [Support Email]

---

*Last Updated: 2026-02-03*
