import axios from "axios";
import * as cheerio from "cheerio";

// Type definitions
export interface FaviconOptions {
  timeout?: number;
  userAgent?: string;
}

/**
 * Batch favicon extraction for multiple URLs
 * @param urls - Array of URLs to process
 * @param options - Configuration options
 * @returns Promise resolving to array of results with URL and favicon info
 */
export interface BatchResult {
  url: string;
  hostname: string | null;
  favicon: string | null;
  success: boolean;
  error?: string;
}

interface BatchOptions extends FaviconOptions {
  concurrency?: number;
}

/**
 * Extract favicon from a given URL using multiple methods
 * @param url - The website URL to extract favicon from
 * @param options - Configuration options
 * @returns Promise resolving to favicon URL or null if not found
 */
export async function getFavicon(
  url: string,
  options: FaviconOptions = {}
): Promise<string | null> {
  const {
    timeout = 10000,
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  } = options;

  try {
    // Ensure URL has proper scheme
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    // Method 1: Parse HTML for favicon links
    const response = await axios.get(url, {
      timeout,
      headers: { "User-Agent": userAgent },
    });

    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      // Look for various favicon link tags
      const faviconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
        'link[rel*="icon"]',
      ];

      for (const selector of faviconSelectors) {
        const faviconElement = $(selector).first();
        const href = faviconElement.attr("href");
        if (faviconElement.length && href) {
          let faviconUrl = href;

          // Convert relative URLs to absolute
          if (faviconUrl.startsWith("//")) {
            faviconUrl = parsedUrl.protocol + faviconUrl;
          } else if (faviconUrl.startsWith("/")) {
            faviconUrl = new URL(faviconUrl, baseUrl).href;
          } else if (!faviconUrl.startsWith("http")) {
            faviconUrl = new URL(faviconUrl, url).href;
          }

          // Verify the favicon URL is accessible
          try {
            const faviconResponse = await axios.head(faviconUrl, {
              timeout: 5000,
              headers: { "User-Agent": userAgent },
            });

            if (faviconResponse.status === 200) {
              return faviconUrl;
            }
          } catch (error) {
            // This favicon URL failed, try next one
            continue;
          }
        }
      }
    }

    // Method 3: Try Google's favicon service as fallback
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.host}&sz=64`;
    return googleFavicon;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const parsedUrlCatch = new URL(
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`
    );
    const baseUrlCatch = `${parsedUrlCatch.protocol}//${parsedUrlCatch.host}`;

    if (
      axios.isAxiosError(error) &&
      error.response &&
      typeof error.response.data === "string"
    ) {
      const $ = cheerio.load(error.response.data);

      // Look for various favicon link tags
      const faviconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
        'link[rel*="icon"]',
      ];

      for (const selector of faviconSelectors) {
        const faviconElement = $(selector).first();
        const href = faviconElement.attr("href");
        if (faviconElement.length && href) {
          let faviconUrl = href;

          // Convert relative URLs to absolute
          if (faviconUrl.startsWith("//")) {
            faviconUrl = parsedUrlCatch.protocol + faviconUrl;
          } else if (faviconUrl.startsWith("/")) {
            faviconUrl = new URL(faviconUrl, baseUrlCatch).href;
          } else if (!faviconUrl.startsWith("http")) {
            faviconUrl = new URL(faviconUrl, url).href;
          }

          // Verify the favicon URL is accessible
          try {
            const faviconResponse = await axios.head(faviconUrl, {
              timeout: 5000,
              headers: { "User-Agent": userAgent },
            });

            if (faviconResponse.status === 200) {
              return faviconUrl;
            }
          } catch {
            // This favicon URL failed, try next one
            continue;
          }
        }
      } // Method 2: Try standard favicon.ico location
      const standardFavicon: string = new URL("/favicon.ico", baseUrlCatch)
        .href;

      try {
        const headResponse = await axios.head(standardFavicon, {
          timeout,
          headers: { "User-Agent": userAgent },
        });

        if (headResponse.status === 200) {
          return standardFavicon;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
      }
    }

    throw new Error(errorMessage);
  }
}

async function extractHostnameKeyword(url: string) {
  try {
    const hostname = new URL(url).hostname; // e.g., www.linkedin.com
    const parts = hostname.replace(/^www\./, "").split(".");
    return parts[0] || null; // returns 'linkedin' from 'www.linkedin.com'
  } catch (e) {
    return null; // invalid URL
  }
}

export default async function getFavicons(
  urls: string[],
  options: BatchOptions = {}
): Promise<BatchResult[]> {
  const { concurrency = 5, ...faviconOptions } = options;
  const results: BatchResult[] = [];
  // Process URLs in batches to avoid overwhelming servers
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(async (url): Promise<BatchResult> => {
      try {
        const favicon = await getFavicon(url, faviconOptions);
        const hostname = await extractHostnameKeyword(url);
        return { url, hostname, favicon, success: favicon !== null };
      } catch (error: unknown) {
        return {
          url,
          hostname: null,
          favicon: null,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(
      ...batchResults.map((result) =>
        result.status === "fulfilled"
          ? result.value
          : {
              url: "unknown",
              hostname: "unknown",
              favicon: null,
              success: false,
              error: String(result.reason),
            }
      )
    );
  }
  return results;
}

// Example usage and testing
// async function testFaviconExtraction() {
//   const testUrls = [
//     "https://marketplace.unisonglobal.com/fbweb/fbobuyDetails.do",
//     "https://www.youtube.com/channel/UCauiWZqo0AbBm2A90Nk7OVw/community",
//   ];
//   console.log("Testing favicon extraction...\n");

//   // Test batch processing
//   console.log("\nTesting batch processing...");
//   const batchResults = await getFaviconsBatch(testUrls.slice(0, 2));
//   console.log("Batch results:", JSON.stringify(batchResults, null, 2));
// }
// Run tests if this file is executed directly
// if (require.main === module) {
// testFaviconExtraction().catch(console.error);

// module.exports = getFaviconsBatch;
