# Project Hyperlink

A Chrome extension that provides unlimited shortcuts and a clean developer workspace for managing your frequently visited links.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=flat&logo=google-chrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat)
![Version](https://img.shields.io/badge/Version-1.0-orange?style=flat)

---

## Overview

Project Hyperlink is a sleek, productivity-focused Chrome extension designed to help you organize and access your most important links with minimal friction. Whether you're a developer managing documentation, a designer saving inspiration boards, or anyone who needs quick access to a curated set of URLs, this extension provides an elegant solution.

Built with **Manifest V3** and using **chrome.storage.local** for data persistence, it offers a fast, reliable, and private way to manage your shortcuts directly within your browser.

---

## Features

### Category Organization

- **Tab-based navigation**: Organize your links into custom categories (tabs)
- **Default General category**: Every link starts in the default category
- **Create custom categories**: Add unlimited categories to group related links
- **Rename & Delete**: Edit category names or remove categories (with confirmation)
- **Persistent selection**: Remembers your active category between sessions

### Quick Link Management

- **Save Current Page**: One-click save of the currently active tab (title auto-truncated to 15 characters)
- **Manual Add**: Add any URL with a custom name via the modal
- **Edit Links**: Click the edit button to modify name or URL
- **Delete Links**: Remove individual links with confirmation
- **Auto-prefix**: Automatically adds `https://` if no protocol is specified

### Search Functionality

- **Real-time search**: Filter links as you type
- **Search name & URL**: Matches against both link names and URLs
- **Cross-category search**: Search shows results from all categories when active

### Visual Design

- **Dark theme**: Modern black aesthetic with subtle grid pattern
- **Sage green accents**: Professional, calming color scheme
- **Favicon display**: Icons pulled from Google's favicon service
- **Smooth animations**: Hover effects, modal transitions, and micro-interactions
- **Responsive grid**: 4-column layout that adapts to your content

### Developer Experience

- **XSS protection**: All user input is properly escaped
- **Keyboard support**: Enter to navigate form fields, Escape to close modals
- **Accessible**: Focus states and keyboard navigation support
- **Error handling**: Graceful fallbacks for missing favicons

---

## Installation

### From Source (Developer Mode)

1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/project-hyperlink.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** using the toggle in the top-right corner

4. Click **Load unpacked** and select the project folder

5. The extension icon will appear in your toolbar

### Pin to Toolbar

For quick access:
1. Click the puzzle piece icon (Extensions) in your Chrome toolbar
2. Find "Project Hyperlink"
3. Click the pin icon to keep it visible

---

## Usage Guide

### Adding a Link

**Option 1: Save Current Page**
- Navigate to the page you want to save
- Click the extension icon
- Click the "Save Current Page" button
- The page title and URL are automatically captured

**Option 2: Manual Add**
- Click the **+** button in the header
- Enter a name (e.g., "LeetCode")
- Enter a URL (e.g., "leetcode.com" or full URL)
- Click "Save"

### Organizing Links

- Click any category tab to switch between categories
- Create a new category by typing a new name when editing (future enhancement)
- Move links between categories by editing them

### Editing & Deleting

- **Edit**: Hover over a link and click the pencil (✎) icon
- **Delete**: Hover over a link and click the X icon
- **Edit Category**: Click the edit icon on a category tab
- **Delete Category**: Click the X on a category tab (warns about deleting all contained links)

### Searching

- Type in the search box to filter links across all categories
- Clear search to return to category-based view

---

## File Structure

```
project-hyperlink/
├── manifest.json       # Chrome extension manifest (MV3)
├── popup.html          # Main popup UI
├── js/
│   ├── newtab.js       # Core application logic
│   └── sortable.min.js # (Reserved for future drag-drop)
├── css/
│   └── style.css       # All styles (dark theme)
└── README.md           # This file
```

---

## Technical Details

### Manifest Configuration

- **Manifest Version**: 3
- **Permissions**: `storage`, `tabs`
- **Storage**: Uses `chrome.storage.local` for data persistence
- **No external dependencies**: Pure vanilla JavaScript

### Data Schema

```javascript
{
  hyperlinks: [
    {
      id: "1234567890",
      name: "LeetCode",
      url: "https://leetcode.com",
      categoryId: "default"
    }
  ],
  categories: [
    { id: "default", name: "General" }
  ],
  activeCategoryId: "default"
}
```

### Security

- All HTML output uses `escapeHtml()` function to prevent XSS
- Input validation ensures URLs have proper protocol
- No external API calls except Google Favicon service (read-only)

---

## Browser Support

- **Google Chrome** (primary)
- **Chromium-based browsers** (Edge, Brave, etc.)

> Requires Chrome 88+ for Manifest V3 support

---

## Contributing

Contributions are welcome! Whether you want to:

- Report a bug
- Suggest a new feature
- Submit a pull request
- Improve documentation

Feel free to open an issue or submit a PR.

---

## License

MIT License

---

## Acknowledgments

- Favicon service: [Google S2 Favicon](https://www.google.com/s2/favicons)
- Iconography: Unicode emoji for lightweight display
- Design inspiration: Modern minimal dark UIs