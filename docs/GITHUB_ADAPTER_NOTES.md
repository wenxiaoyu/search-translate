# GitHub Adapter Implementation Notes

## Overview

GitHub has multiple search interfaces with different DOM structures. The adapter needs to handle all of them gracefully and fall back to standalone overlay mode when native integration isn't possible.

## Search Interface Types

### 1. Global Header Search
- **Location**: Top navigation bar (all pages)
- **Selectors**:
  - `input.header-search-input`
  - `input[data-target="qbsearch-input.inputButtonText"]`
- **Suggestion Container**: `[data-target="qbsearch-input.results"]`

### 2. Repository Search
- **Location**: Within repository pages
- **Selectors**:
  - `input[name="q"][type="text"]`
- **Suggestion Container**: `.jump-to-suggestions`

### 3. Code Search (Query Builder)
- **Location**: New code search interface
- **Selectors**:
  - `#query-builder-test`
  - `input[data-target="query-builder.input"]`
- **Suggestion Container**: `[data-testid="search-suggestions"]`

## Implementation Strategy

### Search Input Detection
The adapter tries selectors in priority order:
1. New query builder (most specific)
2. Repository search
3. Global header search
4. Generic search patterns

Each selector is validated for:
- Element exists
- Element is visible (`offsetParent !== null`)
- Element is not disabled

### Suggestion Container Detection
Similar priority-based approach for suggestion containers:
1. New search results container
2. Jump-to suggestions
3. Code search suggestions
4. Generic autocomplete

**Fallback Behavior**: If no suitable container is found, returns `null` to trigger standalone overlay mode.

## Native Integration vs Standalone Overlay

### Native Integration Mode (Preferred)
- Integrates translation suggestion into GitHub's native suggestion dropdown
- Matches GitHub's UI style (white background, blue left border)
- Appears as first item in suggestion list

### Standalone Overlay Mode (Fallback)
- Shows translation in independent floating overlay
- Used when:
  - Suggestion container not found
  - Suggestion container not visible
  - DOM structure incompatible

## Styling

### Native Suggestion Item
- **Background**: White (#ffffff)
- **Border**: 3px solid blue (#1f6feb) on left
- **Height**: 32px minimum
- **Padding**: 6px 16px
- **Layout**: Flexbox row
  - Left: 🔍 icon + translation text
  - Right: "Search Translate" label
- **Hover**: Light gray background (#f6f8fa) with subtle shadow

### Responsive Behavior
- Translation text truncates with ellipsis if too long
- Icons and label remain visible
- Smooth transitions (0.15s ease)

## Testing Checklist

- [ ] Global header search (any GitHub page)
- [ ] Repository search (within a repo)
- [ ] Code search (new interface)
- [ ] Fallback to overlay when suggestions not available
- [ ] Click to fill search input
- [ ] Hover effects work correctly
- [ ] No style conflicts with GitHub's UI

## Known Limitations

1. **Dynamic Loading**: GitHub uses heavy client-side rendering. The adapter may need to re-initialize when navigating between pages.

2. **Suggestion Visibility**: GitHub's suggestion containers may not always be visible (e.g., when user hasn't typed anything yet). The adapter correctly falls back to overlay mode in these cases.

3. **Multiple Search Boxes**: Some GitHub pages have multiple search inputs. The adapter returns the first visible, enabled input.

## Future Improvements

1. **MutationObserver**: Add observer to detect when GitHub's search interface changes dynamically
2. **Better Container Detection**: Monitor when suggestion containers become visible
3. **A11y**: Ensure proper ARIA attributes for screen readers
4. **Keyboard Navigation**: Integrate with GitHub's keyboard shortcuts
