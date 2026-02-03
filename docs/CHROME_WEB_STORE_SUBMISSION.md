# Chrome Web Store Submission Guide

## Single Purpose Description (单一用途说明)

### English Version

**Single Purpose Statement:**
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

### 中文版本

**单一用途声明：**
```
本扩展仅服务于单一目的：在搜索引擎页面上提供中文到英文的实时翻译建议，帮助用户更有效地搜索。
```

**详细说明：**
```
Search Translate 专门设计用于通过自动将中文搜索查询翻译成英文来增强搜索体验。扩展功能包括：

1. 检测用户在搜索框中输入的中文文本
2. 提供即时的英文翻译建议
3. 允许用户点击翻译自动执行搜索

所有功能都专注于这一单一目的：通过实时翻译促进更好的搜索结果。扩展不收集用户数据、不显示广告，也不执行翻译辅助搜索查询之外的任何其他功能。
```

---

## Permission Justifications (权限理由)

### 1. Storage Permission (存储权限)

**Permission:** `storage`

**Justification (English):**
```
The storage permission is required to:
1. Cache translation results locally for faster performance and reduced API calls
2. Store user preferences (enable/disable settings, preferred search engines)
3. Save usage statistics (translation count, search count) for display in the popup

All data is stored locally on the user's device. No data is transmitted to external servers or third parties.
```

**理由说明（中文）：**
```
存储权限用于：
1. 在本地缓存翻译结果，以提高性能并减少 API 调用
2. 存储用户偏好设置（启用/禁用设置、首选搜索引擎）
3. 保存使用统计数据（翻译次数、搜索次数）以在弹出窗口中显示

所有数据都存储在用户设备本地。不会将数据传输到外部服务器或第三方。
```

---

### 2. Host Permissions (主机权限)

#### Search Engine Hosts

**Permissions:**
```
*://*.google.com/*
*://*.google.com.hk/*
*://*.baidu.com/*
*://*.bing.com/*
*://github.com/*
*://*.stackoverflow.com/*
*://*.stackexchange.com/*
```

**Justification (English):**
```
Host permissions for search engine domains are required to:
1. Inject the translation suggestion UI into search engine pages
2. Detect when users type in search boxes on these sites
3. Display translation suggestions in real-time
4. Enable one-click search functionality

These permissions are essential for the extension's core functionality of providing translation assistance on search engines. The extension only activates on these specific search engine domains and does not access or modify content on any other websites.
```

**理由说明（中文）：**
```
搜索引擎域名的主机权限用于：
1. 将翻译建议 UI 注入到搜索引擎页面
2. 检测用户在这些网站的搜索框中输入的内容
3. 实时显示翻译建议
4. 启用一键搜索功能

这些权限对于扩展提供搜索引擎翻译辅助的核心功能至关重要。扩展仅在这些特定的搜索引擎域名上激活，不会访问或修改任何其他网站的内容。
```

#### Translation API Hosts

**Permissions:**
```
https://api.mymemory.translated.net/*
https://fanyi.baidu.com/*
```

**Justification (English):**
```
Host permissions for translation API domains are required to:
1. Send text to translation services for Chinese-to-English translation
2. Receive translation results from these APIs
3. Provide the core translation functionality

These are public translation APIs used to perform the actual translation. The extension only sends the search query text (no personal information) to these services for translation purposes only.
```

**理由说明（中文）：**
```
翻译 API 域名的主机权限用于：
1. 将文本发送到翻译服务进行中文到英文的翻译
2. 从这些 API 接收翻译结果
3. 提供核心翻译功能

这些是用于执行实际翻译的公共翻译 API。扩展仅将搜索查询文本（不包含个人信息）发送到这些服务，仅用于翻译目的。
```

---

## Privacy Practices (隐私实践)

### Data Collection Statement

**English:**
```
Search Translate does NOT collect, store, or transmit any personal user data. 

What we store locally:
- Translation cache (search queries and their translations)
- User preferences (enable/disable settings)
- Usage statistics (translation count, search count)

All data is stored locally on your device using Chrome's storage API. No data is sent to our servers because we don't have any servers. Translation requests are sent directly to public translation APIs (MyMemory, Baidu Translate) and only contain the search query text.
```

**中文：**
```
Search Translate 不收集、存储或传输任何个人用户数据。

我们在本地存储的内容：
- 翻译缓存（搜索查询及其翻译）
- 用户偏好设置（启用/禁用设置）
- 使用统计数据（翻译次数、搜索次数）

所有数据都使用 Chrome 的存储 API 存储在您的设备本地。我们不会将数据发送到我们的服务器，因为我们没有任何服务器。翻译请求直接发送到公共翻译 API（MyMemory、百度翻译），仅包含搜索查询文本。
```

---

## Minimal Permissions Explanation

**Why These Permissions Are Minimal and Necessary:**

1. **Storage** - Essential for caching and user preferences. No alternative exists for local data storage in Chrome extensions.

2. **Host Permissions (Search Engines)** - Required to inject UI and detect user input on search pages. Limited to only the search engines where the extension provides value.

3. **Host Permissions (Translation APIs)** - Required to perform translations. Limited to only the specific API endpoints used.

**What We DON'T Request:**
- ❌ Tabs permission (we don't need to see all your tabs)
- ❌ History permission (we don't track your browsing)
- ❌ Cookies permission (we don't access cookies)
- ❌ Broad host permissions like `<all_urls>` (we only work on specific search engines)
- ❌ Identity permission (we don't need to know who you are)
- ❌ WebRequest permission (we don't intercept network requests)

---

## Submission Form Answers

### Question: "What is the single purpose of your extension?"

**Answer:**
```
To provide real-time Chinese-to-English translation suggestions on search engine pages, helping users search more effectively by automatically translating their queries.
```

### Question: "Why does your extension need the requested permissions?"

**Answer:**
```
Storage: Cache translations locally for better performance and store user preferences.

Host Permissions (Search Engines): Inject translation UI into search pages and detect user input on Google, Bing, Baidu, GitHub, and Stack Overflow.

Host Permissions (Translation APIs): Send queries to public translation services (MyMemory, Baidu Translate) to perform Chinese-to-English translation.

All permissions are minimal and essential for the extension's core translation functionality. No personal data is collected or transmitted.
```

### Question: "Does your extension collect user data?"

**Answer:**
```
No. The extension does not collect, store, or transmit any personal user data. All data (translation cache, preferences, statistics) is stored locally on the user's device. Translation requests only contain the search query text and are sent directly to public translation APIs.
```

---

## Review Tips

### Do's ✅
- Emphasize the single, focused purpose
- Explain each permission clearly and specifically
- Highlight privacy protections
- Mention that permissions are minimal
- Reference the privacy policy

### Don'ts ❌
- Don't request unnecessary permissions
- Don't be vague about permission usage
- Don't claim "no data collection" if you use analytics
- Don't request broad permissions like `<all_urls>`
- Don't include unrelated functionality

---

## Additional Documentation

### Privacy Policy URL
```
https://github.com/wenxiaoyu/search-translate/blob/main/PRIVACY_POLICY.md
```

### Support URL
```
https://github.com/wenxiaoyu/search-translate/issues
```

### Homepage URL
```
https://github.com/wenxiaoyu/search-translate
```

---

## Common Review Issues and Solutions

### Issue: "Overly broad permissions"
**Solution:** Our permissions are already minimal and specific to search engines only.

### Issue: "Unclear single purpose"
**Solution:** Use the single purpose statement provided above - it's clear and specific.

### Issue: "Privacy concerns"
**Solution:** Reference the privacy policy and emphasize local-only data storage.

### Issue: "Functionality not matching description"
**Solution:** Ensure the description accurately reflects what the extension does (translation on search engines only).

---

*Last Updated: 2026-02-03*
