import { NextRequest, NextResponse } from "next/server";

const PLATFORMS: { name: string; url: string; check: string }[] = [
  { name: "GitHub", url: "https://github.com/{}", check: "https://github.com/{}" },
  { name: "Twitter/X", url: "https://twitter.com/{}", check: "https://twitter.com/{}" },
  { name: "Instagram", url: "https://instagram.com/{}", check: "https://www.instagram.com/{}/" },
  { name: "Reddit", url: "https://reddit.com/u/{}", check: "https://www.reddit.com/user/{}" },
  { name: "TikTok", url: "https://tiktok.com/@{}", check: "https://www.tiktok.com/@{}" },
  { name: "LinkedIn", url: "https://linkedin.com/in/{}", check: "https://www.linkedin.com/in/{}" },
  { name: "YouTube", url: "https://youtube.com/@{}", check: "https://www.youtube.com/@{}" },
  { name: "Pinterest", url: "https://pinterest.com/{}", check: "https://pinterest.com/{}" },
  { name: "Dev.to", url: "https://dev.to/{}", check: "https://dev.to/{}" },
  { name: "Medium", url: "https://medium.com/@{}", check: "https://medium.com/@{}" },
  { name: "HackerNews", url: "https://news.ycombinator.com/user?id={}", check: "https://news.ycombinator.com/user?id={}" },
  { name: "GitLab", url: "https://gitlab.com/{}", check: "https://gitlab.com/{}" },
  { name: "Twitch", url: "https://twitch.tv/{}", check: "https://www.twitch.tv/{}" },
  { name: "Mastodon", url: "https://mastodon.social/@{}", check: "https://mastodon.social/@{}" },
  { name: "Keybase", url: "https://keybase.io/{}", check: "https://keybase.io/{}" },
  { name: "ProductHunt", url: "https://producthunt.com/@{}", check: "https://www.producthunt.com/@{}" },
  { name: "Dribbble", url: "https://dribbble.com/{}", check: "https://dribbble.com/{}" },
  { name: "Behance", url: "https://behance.net/{}", check: "https://www.behance.net/{}" },
  { name: "Codepen", url: "https://codepen.io/{}", check: "https://codepen.io/{}" },
  { name: "Npm", url: "https://npmjs.com/~{}", check: "https://www.npmjs.com/~{}" },
  { name: "Stackoverflow", url: "https://stackoverflow.com/users/{}", check: "https://stackoverflow.com/users/{}" },
  { name: "HuggingFace", url: "https://huggingface.co/{}", check: "https://huggingface.co/{}" },
];

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  const results = await Promise.allSettled(
    PLATFORMS.map(async (platform) => {
      const url = platform.check.replace(/\{\}/g, encodeURIComponent(username));
      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(4000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; CosmoxHub-OSINT)" },
          next: { revalidate: 0 },
        });
        const found = res.status === 200 || res.status === 301 || res.status === 302;
        return { name: platform.name, url: platform.url.replace(/\{\}/g, username), found, status: res.status };
      } catch {
        return { name: platform.name, url: platform.url.replace(/\{\}/g, username), found: false, status: 0 };
      }
    })
  );

  const data = results.map((r, i) =>
    r.status === "fulfilled" ? r.value : { name: PLATFORMS[i].name, url: PLATFORMS[i].url.replace(/\{\}/g, username), found: false, status: 0 }
  );

  return NextResponse.json({ username, platforms: data });
}
