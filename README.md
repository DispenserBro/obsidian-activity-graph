# Activity Graph Plugin for Obsidian

[![Version](https://img.shields.io/badge/version-1.2.2-blue)](https://github.com/DispenserBro/obsidian-activity-graph/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

🌐 **[Русская версия](README_ru.md)**

A GitHub-style activity graph plugin for Obsidian that visualizes your writing activity or completed tasks as a beautiful heatmap.

## Features

- 📊 **GitHub-style Commit Graph** - Visualize your activity with a familiar heatmap
- 📅 **Calendar View** - Monthly calendar with activity levels
- 📋 **Calendar Sheet View** - Single-month sidebar view similar to obsidian-calendar-plugin
- ✅ **Tasks Integration** - Track completed tasks from Tasks plugin
- � **Task Status Indicators** - Visual dots showing task completion status in Calendar Sheet
- �🎨 **Customizable Colors** - Full control over activity level colors for light and dark themes
- 🎭 **Activity Dot Positioning** - Choose where to display activity indicators (center, corners)
- 🌍 **Localization** - English and Russian language support (auto-detected from Obsidian settings)
- 📝 **Code Block Embedding** - Embed graphs directly in your notes
- 🔗 **Daily Notes Integration** - Click on any day to open its daily note

## Installation

### Manual Installation

1. Download the latest release
2. Extract files to `.obsidian/plugins/activity-graph/`
3. Enable the plugin in Obsidian Settings → Community Plugins

### From Source

```bash
cd .obsidian/plugins/activity-graph
npm install
npm run build
```

## Usage

### Panel View

Click the bar chart icon in the ribbon or use the command palette:
- **Open Activity Graph** - Opens the activity graph panel

### Code Block Embedding

Embed activity graphs directly in your notes using the `activity-graph` code block:

#### Basic Usage

~~~markdown
```activity-graph
```
~~~

#### With Custom Title

~~~markdown
```activity-graph
title: My Activity
```
~~~

#### Custom Period

~~~markdown
```activity-graph
title: Last 3 Months
period: 3months
```
~~~

Available periods: `1month`, `3months`, `6months`, `12months`

#### Custom Date Range

~~~markdown
```activity-graph
title: Q4 2025
startDate: 2025-10-01
endDate: 2025-12-31
```
~~~

#### Display Style

~~~markdown
```activity-graph
title: Calendar View
style: calendar
period: 1month
```
~~~

Available styles: `commitGraph`, `calendar`

#### Tasks Mode

~~~markdown
```activity-graph
title: Completed Tasks
tasks: true
period: 6months
```
~~~

#### Highlight Today

~~~markdown
```activity-graph
highlightToday: true
highlightColor: #7c3aed
```
~~~

#### Custom Colors

~~~markdown
```activity-graph
title: Custom Colors
colors: ["#ebedf0", "#c6e48b", "#7bc96f", "#449945", "#196127"]
```
~~~

#### Custom Text Colors

~~~markdown
```activity-graph
title: Custom Text Colors
style: calendar
colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#ff0000"]
textColors: ["#ffffff", "#00ff00", "#ffff00", "#ff8800", "#000000"]
```
~~~

Available text color options:
- `textColors` - Same text colors for both light and dark themes
- `lightTextColors` - Text colors for light theme only
- `darkTextColors` - Text colors for dark theme only

**Note:** Text colors work only for Calendar and Calendar Sheet views.

#### Full Example

~~~markdown
```activity-graph
title: My Writing Progress
style: commitGraph
period: 6months
tasks: false
highlightToday: true
highlightColor: #ff6b6b
colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
```
~~~

## Settings

### General Settings

| Setting | Description |
|---------|-------------|
| **Highlight Today** | Add a visual highlight to the current day |
| **Highlight Color** | Choose the color for today's highlight |
| **Display only Tasks** | Show completed tasks instead of file activity |
| **Display Style** | Choose between Commit Graph and Calendar view |
| **First Day of Week** | Set week start to Sunday or Monday |
| **Display Period** | Select time period (1/3/6/12 months or custom) |

### Activity Level Colors

Customize colors for each activity level (0-4) separately for light and dark themes.

Default Light Theme:
- Level 0: `#ebedf0`
- Level 1: `#9be9a8`
- Level 2: `#40c463`
- Level 3: `#30a14e`
- Level 4: `#216e39`

Default Dark Theme:
- Level 0: `#161b22`
- Level 1: `#0e4429`
- Level 2: `#006d32`
- Level 3: `#26a641`
- Level 4: `#39d353`

## Tasks Plugin Integration

The plugin supports the Tasks plugin format for tracking completed tasks:

- Emoji format: `- [x] Task ✅ 2025-12-12`
- Dataview format: `- [x] Task [done:: 2025-12-12]`

Enable "Display only Tasks" in settings to switch to tasks tracking mode.

## Localization

The plugin automatically detects your Obsidian language setting and displays the interface in:
- **English** (default)
- **Russian** (Русский)

If your language is not supported, English will be used as fallback.

## Development

### Project Structure

```
activity-graph/
├── src/
│   ├── main.js              # Plugin entry point
│   ├── constants.js         # Default settings and constants
│   ├── utils.js             # Utility functions
│   ├── localization.js      # i18n support
│   ├── tasks-parser.js      # Tasks plugin integration
│   ├── views/
│   │   └── activity-graph-view.js
│   ├── renderers/
│   │   ├── base-renderer.js
│   │   ├── commit-graph-renderer.js
│   │   └── calendar-renderer.js
│   ├── processors/
│   │   └── code-block-processor.js
│   ├── settings/
│   │   └── settings-tab.js
│   └── styles/
│       ├── base.css
│       ├── commit-graph.css
│       ├── calendar.css
│       ├── legend-tooltip.css
│       └── settings.css
├── main.js                  # Bundled output
├── styles.css               # Bundled styles
├── manifest.json
└── package.json
```

### Build Commands

```bash
# Development build (with watch)
npm run dev

# Production build
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Dis_Bro** - [GitHub](https://github.com/DispenserBro)

---

If you find this plugin useful, consider giving it a ⭐ on GitHub!
