# GitHub Search Box Visibility Fix

## Problem

On GitHub search results pages (e.g., `https://github.com/search?q=...`), the search input box is initially hidden (`visible: false`) and becomes visible later via JavaScript. This caused the translation feature to not work because:

1. MutationObserver detects the hidden search box
2. TranslationManager initializes with the hidden input
3. GitHub's JavaScript makes the search box visible
4. But since it's the same DOM element, just with changed visibility, the observer doesn't re-initialize
5. Events bound to the hidden input don't fire when the box becomes visible

## Root Cause

The MutationObserver was only watching for DOM structure changes (`childList`), not attribute changes. When GitHub changes the search box from hidden to visible, it typically modifies:
- `style` attribute (e.g., `display: none` → `display: block`)
- `class` attribute (e.g., adding/removing visibility classes)
- `hidden` attribute

These changes don't trigger `childList` mutations, so the observer never detected the visibility change.

## Solution

### 1. Track Visibility State

Added `lastVisible` state tracking in `observeSearchInput()`:

```typescript
let lastInput: HTMLInputElement | null = null;
let lastVisible: boolean = false;

// Check if visibility changed
const isVisible = input ? input.offsetParent !== null : false;

if (input && (input !== lastInput || isVisible !== lastVisible)) {
  // Re-initialize when element OR visibility changes
  console.log('[SmartSearchTranslate] Search input changed, re-initializing...', {
    elementChanged: input !== lastInput,
    visibilityChanged: isVisible !== lastVisible,
    wasVisible: lastVisible,
    nowVisible: isVisible
  });
  
  // Cleanup and re-initialize
  if (translationManager) {
    translationManager.destroy();
  }
  
  lastInput = input;
  lastVisible = isVisible;
  initTranslation();
}
```

### 2. Observe Attribute Changes

Modified MutationObserver configuration to watch attribute changes:

```typescript
observer.observe(document.body, {
  childList: true,      // Watch for DOM structure changes
  subtree: true,        // Watch entire subtree
  attributes: true,     // Watch for attribute changes
  attributeFilter: ['style', 'class', 'hidden'],  // Only watch visibility-related attributes
});
```

## How It Works

1. **Initial Load**: Page loads with hidden search box
   - Observer detects `input#query-builder-test` (hidden)
   - TranslationManager initializes but input is not visible yet
   - `lastInput` = hidden input, `lastVisible` = false

2. **GitHub Makes Box Visible**: JavaScript changes `style` or `class`
   - Observer fires due to attribute change
   - Detects `isVisible` changed from false to true
   - Destroys old TranslationManager
   - Re-initializes with now-visible input
   - `lastInput` = same input, `lastVisible` = true

3. **User Types**: Input events now fire correctly
   - Translation feature works as expected

## Testing

To test this fix:

1. Navigate to GitHub search results: `https://github.com/search?q=test`
2. Open browser console (F12)
3. Look for these log messages:

```
[SmartSearchTranslate] Started observing DOM changes
[GitHubAdapter] Found search input with selector: input#query-builder-test visible: false
[TranslationManager] Initializing for GitHub
[SmartSearchTranslate] Search input changed, re-initializing... {
  elementChanged: false,
  visibilityChanged: true,
  wasVisible: false,
  nowVisible: true
}
[TranslationManager] Initializing for GitHub
```

4. Type in the search box - translation should work

## Performance Considerations

Watching attribute changes on the entire `document.body` could be expensive. We mitigate this by:

1. **Attribute Filter**: Only watch `style`, `class`, `hidden` attributes
2. **Debouncing**: 500ms debounce on the check function
3. **Early Exit**: Only re-initialize if visibility actually changed

## Related Files

- `src/content/index.ts` - MutationObserver implementation
- `src/content/adapters/GitHubAdapter.ts` - GitHub adapter
- `src/content/TranslationManager.ts` - Translation manager
- `docs/SPA_NAVIGATION_FIX.md` - Related SPA navigation fix
- `docs/DEBUGGING_SEARCH_INPUT.md` - Debugging guide

## Alternative Approaches Considered

### 1. Poll for Visibility
```typescript
setInterval(() => {
  const input = adapter.getSearchInput();
  const isVisible = input?.offsetParent !== null;
  // Check and re-initialize
}, 1000);
```
**Rejected**: Wasteful, runs even when nothing changes

### 2. Use IntersectionObserver
```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Re-initialize
    }
  });
});
```
**Rejected**: Doesn't detect `display: none` changes, only viewport visibility

### 3. Remove Visibility Check Entirely
```typescript
// Just initialize with hidden inputs
if (input && !input.disabled) {
  return input;
}
```
**Rejected**: Events don't fire on hidden inputs, wastes resources

## Conclusion

The fix successfully handles GitHub's dynamic search box visibility by:
- Tracking both element identity AND visibility state
- Observing attribute changes that affect visibility
- Re-initializing TranslationManager when visibility changes

This ensures the translation feature works correctly on GitHub search pages regardless of when the search box becomes visible.
