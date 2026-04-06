import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Use TinyURL's free API (no key needed)
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Shortening service unavailable" },
        { status: 502 }
      );
    }

    const shortUrl = await response.text();

    // Validate that we got a proper shortened URL back
    if (!shortUrl.startsWith("https://tinyurl.com/")) {
      return NextResponse.json(
        { error: "Invalid response from shortener" },
        { status: 502 }
      );
    }

    return NextResponse.json({ shortUrl });
  } catch {
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}
