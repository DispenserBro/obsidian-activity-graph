# Release v1.2.2

## 🐛 Bug Fixes

### Custom Colors in Code Blocks
Fixed a critical bug where custom colors specified in code blocks were not displaying at all. The issue was caused by quoted color values in the parsed array, making them invalid CSS values.

**Example that now works:**
```activity-graph
colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#ff0000"]
```

**Technical details:**
- Updated color parser to strip quotes from hex color values
- Changed from CSS variables to dynamic `<style>` elements with unique IDs
- Injected custom styles into `document.head` with `!important` for proper specificity
- Added `data-style-id` attributes for scoped CSS application

## ✨ New Features

### Text Color Customization for Calendar Views
You can now customize text colors for day numbers in Calendar and Calendar Sheet views, with separate colors for each activity level.

**New code block options:**
- `textColors` - Same text colors for both light and dark themes
- `lightTextColors` - Text colors for light theme only  
- `darkTextColors` - Text colors for dark theme only

**Example:**
```activity-graph
style: calendar
colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#ff0000"]
textColors: ["#ffffff", "#00ff00", "#ffff00", "#ff8800", "#000000"]
```

Each array should contain 5 colors (for activity levels 0-4).

**Where it works:**
- ✅ Calendar view - day number text colors
- ✅ Calendar Sheet view - day number text colors
- ❌ Commit Graph view - not applicable (no text to style)

## 🔧 Technical Improvements

- Enhanced `ColorScheme` interface with optional `textLevel0-4` properties
- Improved CSS variable application logic in all renderers
- Added activity level classes to calendar sheet day cells for better styling control
- Optimized color parsing in `CodeBlockProcessor`

## 📦 Installation

Download `activity-graph-9e2b309.zip` and extract to your `.obsidian/plugins/activity-graph/` folder, or wait for the Community Plugins update.

## 🙏 Acknowledgments

Thanks to all users who reported the custom colors bug!
