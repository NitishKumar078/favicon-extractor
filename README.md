# favicon-extractor

[![npm version](https://badge.fury.io/js/favicon-extractor.svg)](https://badge.fury.io/js/favicon-extractor)
[![npm downloads](https://img.shields.io/npm/dm/favicon-extractor.svg)](https://www.npmjs.com/package/favicon-extractor)
[![license](https://img.shields.io/npm/l/favicon-extractor.svg)](https://github.com/yourusername/favicon-extractor/blob/main/LICENSE)

A lightweight Node.js utility to fetch and extract favicons from any website URL. Perfect for apps, extensions, or APIs that need quick access to site icons.

## ✨ Features

- Fetch favicons from a single URL or multiple URLs
- Returns the best-matched favicon URL (or list)
- Simple, promise-based API
- Works with Node.js and modern JavaScript runtimes
- Lightweight with minimal dependencies
- Handles common favicon formats and locations

## 📦 Installation

```bash
npm install favicon-extractor
```

or with Yarn:

```bash
yarn add favicon-extractor
```

## 🚀 Usage

```javascript
import getFavicons, { getFavicon } from "favicon-extractor";

// Fetch favicons from multiple URLs
const Favicons = await getFavicons([
  "https://www.google.com",
  "https://www.github.com",
]);
console.log(Favicons);

// Fetch favicon from a single URL
const Favicon = await getFavicon("https://www.google.com");
console.log(Favicon);
```

### CommonJS Usage

```javascript
const { getFavicons, getFavicon } = require("favicon-extractor");

// Usage remains the same
const favicon = await getFavicon("https://www.example.com");
```

## 📚 API Documentation

### `getFavicons(urls: string[]): Promise<Record<string, string | null>>`

Fetch favicons for multiple URLs.

**Parameters:**
- `urls` (string[]): Array of website URLs to extract favicons from

**Returns:**
- `Promise<Record<string, string | null>>`: An object mapping each URL to its favicon URL (or `null` if not found)

**Example:**
```javascript
const favicons = await getFavicons([
  "https://www.google.com",
  "https://www.github.com"
]);
```

### `getFavicon(url: string): Promise<string | null>`

Fetch favicon for a single URL.

**Parameters:**
- `url` (string): Website URL to extract favicon from

**Returns:**
- `Promise<string | null>`: Favicon URL (or `null` if not found)

**Example:**
```javascript
const favicon = await getFavicon("https://www.google.com");
```

## 🛠 Example Output

### Multiple URLs
```json
{
  "https://www.google.com": "https://www.google.com/favicon.ico",
  "https://www.github.com": "https://github.githubassets.com/favicons/favicon.png"
}
```

### Single URL
```json
"https://www.google.com/favicon.ico"
```

### When favicon is not found
```json
null
```

## 🔧 Configuration Options

### Timeout Control
Set custom timeout values for requests to handle slow-responding websites:

```javascript
// 10 second timeout for a single favicon
const favicon = await getFavicon("https://slow-website.com", {
  timeout: 10000
});

// 3 second timeout for batch processing
const favicons = await getFavicons(urls, { timeout: 3000 });
```

### User Agent Customization
Some websites may block requests without proper user agents:

```javascript
const favicon = await getFavicon("https://protected-site.com", {
  userAgent: "Mozilla/5.0 (compatible; MyBot/1.0)"
});
```

### Concurrency Control
Control how many simultaneous requests are made when processing multiple URLs:

```javascript
// Process 3 URLs at a time instead of all at once
const favicons = await getFavicons(manyUrls, {
  concurrency: 3
});
```

## 🔧 Error Handling

The package gracefully handles various error scenarios:

- Invalid URLs return `null`
- Network timeouts return `null`
- Websites without favicons return `null`
- No exceptions are thrown - all errors are handled internally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Nitish Kumar M

---

**Keywords:** favicon, icon, website, scraper, extractor, url, node.js, javascript, utility
