# favicon-extractor

[![npm version](https://badge.fury.io/js/favicon-extractor.svg)](https://badge.fury.io/js/favicon-extractor)
[![npm downloads](https://img.shields.io/npm/dm/favicon-extractor.svg)](https://www.npmjs.com/package/favicon-extractor)
[![license](https://img.shields.io/npm/l/favicon-extractor.svg)](https://github.com/yourusername/favicon-extractor/blob/main/LICENSE)

A lightweight **Node.js backend utility** to fetch and extract favicons from any website URL. Designed specifically for server-side applications, APIs, and backend services that need quick access to site icons.

## ✨ Features

- **Backend-focused**: Built exclusively for Node.js server environments
- Fetch favicons from a single URL or multiple URLs
- Returns detailed favicon information with success status
- Simple, promise-based API
- Works with Node.js and server-side JavaScript runtimes
- Lightweight with minimal dependencies
- Handles common favicon formats and locations
- Perfect for APIs, web scrapers, and backend services

## 📦 Installation

```bash
npm install favicon-extractor
```

or with Yarn:

```bash
yarn add favicon-extractor
```

## 🚀 Usage

**Note: This package is designed for backend/server-side use only and requires a Node.js environment.**

```javascript
import getFavicons, { getFavicon, type BatchResult } from "favicon-extractor";

// Fetch favicons from multiple URLs
const Favicons = await getFavicons([
  "https://www.google.com",
  "https://www.github.com",
]);
console.log(Favicons);

// Fetch favicon from a single URL
const Favicon = await getFavicon("https://www.google.com");
console.log(Favicon);

// TypeScript usage with interface
const favicon: BatchResult = await getFavicon("https://www.example.com");
```

### CommonJS Usage

```javascript
const { getFavicons, getFavicon, BatchResult } = require("favicon-extractor");

// Usage remains the same
const favicon = await getFavicon("https://www.example.com");
```

## 📚 API Documentation

### TypeScript Interface

```typescript
interface BatchResult {
  url: string;
  hostname: string | null;
  favicon: string | null;
  success: boolean;
  error?: string;
}
```

The package exports the `BatchResult` interface for TypeScript users to ensure type safety when working with the returned favicon data.

### `getFavicons(urls: string[]): Promise<BatchResult[]>`

Fetch favicons for multiple URLs.

**Parameters:**
- `urls` (string[]): Array of website URLs to extract favicons from

**Returns:**
- `Promise<BatchResult[]>`: An array of `BatchResult` objects

**Example:**
```javascript
const favicons = await getFavicons([
  "https://www.google.com",
  "https://www.github.com"
]);
```

### `getFavicon(url: string): Promise<BatchResult>`

Fetch favicon for a single URL.

**Parameters:**
- `url` (string): Website URL to extract favicon from

**Returns:**
- `Promise<BatchResult>`: A `BatchResult` object with detailed information

**Example:**
```javascript
const favicon = await getFavicon("https://www.google.com");
```

## 🛠 Example Output

### Multiple URLs
```json
[
  {
    "url": "https://www.google.com",
    "hostname": "google",
    "favicon": "https://www.google.com/s2/favicons?domain=google.com&sz=64",
    "success": true
  },
  {
    "url": "https://www.github.com",
    "hostname": "github",
    "favicon": "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    "success": true
  }
]
```

### Single URL
```json
{
  "url": "https://brew.beer",
  "hostname": "brew",
  "favicon": "https://www.google.com/s2/favicons?domain=brew.beer&sz=64",
  "success": true
}
```

### When favicon extraction fails
```json
{
  "url": "https://invalid-site.com",
  "hostname": "invalid-site",
  "favicon": null,
  "success": false,
  "error": "Request timeout"
}
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

- Invalid URLs return `success: false` with `favicon: null` and optional `error` message
- Network timeouts return `success: false` with `favicon: null` and `error: "Request timeout"`
- Websites without favicons return `success: false` with `favicon: null`
- All responses include the original URL and extracted hostname (or `null` if extraction fails)
- Optional `error` field provides additional context when failures occur
- No exceptions are thrown - all errors are handled internally

## 🖥️ Backend Environment Requirements

This package is specifically designed for **backend environments** and requires:

- Node.js (version 14 or higher recommended)
- Server-side JavaScript runtime
- Network access for HTTP/HTTPS requests

**Not suitable for:**
- Browser/frontend applications
- Client-side JavaScript
- Edge functions with limited Node.js APIs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Nitish Kumar M

---

**Keywords:** favicon, icon, website, scraper, extractor, url, node.js, javascript, utility, backend, server-side
