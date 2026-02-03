# Privacy Policy for Smart Search Translate

**Last Updated:** February 3, 2026

## Overview

Smart Search Translate is a Chrome extension that provides real-time translation suggestions for search engines. We are committed to protecting your privacy.

## Data Collection

### What We Collect

- **Translation Cache**: The extension stores your translation history locally in your browser's localStorage to improve performance and reduce API calls.
- **User Preferences**: Your settings (enabled/disabled features, selected search engines) are stored using Chrome's storage API.

### What We DO NOT Collect

- We do NOT collect any personal information
- We do NOT track your browsing history
- We do NOT send your search queries to our servers
- We do NOT share any data with third parties (except the translation API as described below)

## Third-Party Services

### MyMemory Translation API

When you input Chinese text in a search box, the extension sends the text to MyMemory Translation API (https://mymemory.translated.net) to get English translations.

- **What is sent**: Only the Chinese text you type in search boxes
- **Purpose**: To provide translation suggestions
- **MyMemory's Privacy Policy**: https://mymemory.translated.net/doc/spec.php

## Data Storage

All data is stored locally on your device:

- **localStorage**: Translation cache (can be cleared in Options page)
- **chrome.storage.local**: General extension settings
- **chrome.storage.sync**: Translation preferences (synced across your Chrome browsers if signed in)

## Data Retention

- Translation cache is automatically cleaned after 30 days
- You can manually clear all cached data at any time from the Options page
- Uninstalling the extension removes all stored data

## Permissions

The extension requests the following permissions:

- **storage**: To save your preferences and translation cache
- **host_permissions**: To inject translation functionality on supported search engines (Google, Baidu, Bing, GitHub)
- **api.mymemory.translated.net**: To call the translation API

## Your Rights

You have the right to:

- View your cached translations (stored locally in your browser)
- Clear all cached data (Options page → Clear Cache button)
- Disable the extension at any time
- Uninstall the extension to remove all data

## Changes to This Policy

We may update this privacy policy from time to time. We will notify users of any material changes by updating the "Last Updated" date.

## Contact

If you have any questions about this privacy policy, please open an issue on our GitHub repository or contact us at [your-email@example.com].

## Compliance

This extension complies with:

- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
