import getFavicons from "favicon-extractor";
interface BatchResult {
  url: string;
  favicon: string | null;
  success: boolean;
  error?: string;
}

function normalizeBodyToUrls(body: unknown): string[] {
  if (Array.isArray(body)) {
    return body
      .filter((v) => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  if (typeof body === "string") {
    return [body].filter(Boolean);
  }
  if (body && typeof body === "object") {
    const anyBody = body as Record<string, unknown>;
    if (Array.isArray(anyBody.urls)) {
      return anyBody.urls
        .filter((v) => typeof v === "string")
        .map((v: string) => v.trim())
        .filter(Boolean);
    }
    if (typeof anyBody.url === "string") {
      return [anyBody.url].filter(Boolean);
    }
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => undefined);
    const urls = normalizeBodyToUrls(body);
    if (urls.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Provide URL(s) in body as array, {url}, {urls}",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result: BatchResult[] = await getFavicons(urls);
    console.log(result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urls: string[] = [];
    const repeated = searchParams.getAll("url");
    if (repeated.length > 0) {
      urls.push(...repeated.map((v) => v.trim()).filter(Boolean));
    }
    const csv = searchParams.get("urls");
    if (csv) {
      urls.push(
        ...csv
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      );
    }

    if (urls.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Provide ?url=... (repeatable) or ?urls=a,b,c",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result: BatchResult[] = await getFavicons(urls);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
