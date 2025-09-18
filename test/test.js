// ESM-friendly dynamic import for Jest
let getFavicons;
beforeAll(async () => {
  const module = await import("../dist/index.js");
  getFavicons = module.default;
});

describe("getFavicons function", () => {
  // Test data - valid websites
  const validWebsites = [
    "https://example.com",
    "https://wikipedia.org",
    "https://github.com", // Using a more reliable URL
  ];

  // Expected response structure (more flexible for real-world testing)
  const expectedValidResponse = [
    {
      url: "https://example.com",
      hostname: "example",
      favicon: expect.any(String), // We expect a string, but don't care about exact URL
      success: true,
    },
    {
      url: "https://wikipedia.org",
      hostname: "wikipedia",
      favicon: expect.any(String),
      success: true,
    },
    {
      url: "https://github.com",
      hostname: "github",
      favicon: expect.any(String),
      success: true,
    },
  ];

  // Invalid URLs for testing error handling
  const invalidWebsites = [
    "https://stealth.ninja",
    "https://eco.green",
    "https://museum.art",
  ];

  const resultinvalidURls = [
    {
      url: "https://stealth.ninja",
      hostname: null,
      favicon: null,
      success: false,
      error: "timeout of 10000ms exceeded",
    },
    {
      url: "https://eco.green",
      hostname: null,
      favicon: null,
      success: false,
      error: "getaddrinfo ENOTFOUND eco.green",
    },
    {
      url: "https://museum.art",
      hostname: null,
      favicon: null,
      success: false,
      error: "getaddrinfo ENOTFOUND museum.art",
    },
  ];

  // Test for successful favicon fetching
  test("should return favicon objects for valid URLs", async () => {
    const result = await getFavicons(validWebsites);

    // Check that we get an array
    expect(result).toEqual(expectedValidResponse);
    // Check that we get the right number of results
    expect(result).toHaveLength(expectedValidResponse.length);

    // Check each result has the expected structure
    result.forEach((item, index) => {
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("hostname");
      expect(item).toHaveProperty("favicon");
      expect(item).toHaveProperty("success");

      // Check that URL matches input
      expect(item.url).toBe(validWebsites[index]);

      // For successful results
      if (item.success) {
        expect(item.hostname).toBeTruthy();
        expect(item.favicon).toBeTruthy();
        expect(typeof item.favicon).toBe("string");
        // Check that favicon URL is valid
        expect(item.favicon).toMatch(/^https?:\/\/.+/);
      }
    });
  }, 30000); // 30 second timeout for network requests

  // Test for handling invalid URLs
  test("should handle invalid URLs gracefully", async () => {
    const result = await getFavicons(invalidWebsites);

    // Check that we get an array
    expect(result).toEqual(resultinvalidURls);
    // Check that we get the right number of results
    expect(result).toHaveLength(resultinvalidURls.length);

    result.forEach((item, index) => {
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("success");
      expect(item.url).toBe(invalidWebsites[index]);

      // For failed requests
      if (!item.success) {
        expect(item).toHaveProperty("error");
        expect(typeof item.error).toBe("string");
        expect(item.favicon).toBeNull();
        expect(item.hostname).toBeNull();
      }
    });
  }, 30000);

  // Test for empty input
  test("should handle empty array input", async () => {
    const result = await getFavicons([]);
    expect(result).toEqual([]);
  });

  // Test for single URL (if your function supports it)
  test("should handle single URL input", async () => {
    const singleUrl = "https://example.com";
    const result = await getFavicons([singleUrl]);

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe(singleUrl);
    expect(result[0]).toHaveProperty("success");
  }, 15000);

  // Test for malformed URLs
  test("should handle malformed URLs", async () => {
    const malformedUrls = [
      "not-a-url",
      "ftp://example.com", // Different protocol
      "https://", // Incomplete URL
    ];

    const result = await getFavicons(malformedUrls);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(malformedUrls.length);

    // Most should fail gracefully
    result.forEach((item) => {
      expect(item).toHaveProperty("success");
      if (!item.success) {
        expect(item).toHaveProperty("error");
      }
    });
  }, 15000);

  // Test response structure more strictly for one reliable site
  test("should return correct structure for a reliable site", async () => {
    const result = await getFavicons(["https://example.com"]);

    expect(result[0]).toEqual({
      url: "https://example.com",
      hostname: expect.any(String),
      favicon: expect.stringMatching(/^https?:\/\/.+/), // Valid URL format
      success: true,
    });
  }, 15000);
});

// Additional tests for edge cases
describe("getFavicons edge cases", () => {
  // Test timeout behavior (if your function has timeout)
  test("should handle timeout gracefully", async () => {
    // Using a URL that's likely to timeout
    const slowUrl = "https://httpstat.us/200?sleep=15000";
    const result = await getFavicons([slowUrl]);

    // Should either succeed or fail with timeout error
    expect(result[0]).toHaveProperty("success");
    if (!result[0].success) {
      expect(result[0].error).toMatch(
        /timeout|exceeded|socket hang up|ECONNRESET|ETIMEDOUT/i
      );
    }
  }, 20000);

  // Test mixed valid and invalid URLs
  test("should handle mixed valid and invalid URLs", async () => {
    const mixedUrls = [
      "https://example.com", // Valid
      "https://definitely-not-real-12345.com", // Invalid
      "https://github.com", // Valid
    ];

    const result = await getFavicons(mixedUrls);

    expect(result).toHaveLength(3);

    // Should have mix of successes and failures
    const successes = result.filter((r) => r.success);
    const failures = result.filter((r) => !r.success);

    expect(successes.length).toBeGreaterThan(0);
    expect(failures.length).toBeGreaterThan(0);
  }, 30000);
});
