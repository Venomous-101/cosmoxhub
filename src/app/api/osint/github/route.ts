import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  try {
    // 1. Get user profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "CosmoxHub-OSINT" },
      next: { revalidate: 0 }
    });
    if (!profileRes.ok) return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    const profile = await profileRes.json();

    // 2. Get repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
      headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "CosmoxHub-OSINT" },
      next: { revalidate: 0 }
    });
    const repos = await reposRes.json();

    // 3. Harvest emails from commits across repos
    const emails = new Map<string, number>();
    const commitHours: number[] = [];
    let techStack: Record<string, number> = {};

    for (const repo of repos.slice(0, 8)) {
      try {
        // Get languages
        const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, {
          headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "CosmoxHub-OSINT" },
          next: { revalidate: 0 }
        });
        const langs = await langRes.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          techStack[lang] = (techStack[lang] || 0) + (bytes as number);
        }

        // Get commits
        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=15`, {
          headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "CosmoxHub-OSINT" },
          next: { revalidate: 0 }
        });
        if (!commitsRes.ok) continue;
        const commits = await commitsRes.json();
        if (!Array.isArray(commits)) continue;

        for (const commit of commits) {
          const authorEmail = commit?.commit?.author?.email;
          const committerEmail = commit?.commit?.committer?.email;
          const dateStr = commit?.commit?.author?.date;

          if (authorEmail && !authorEmail.includes("noreply") && !authorEmail.includes("users.noreply")) {
            emails.set(authorEmail, (emails.get(authorEmail) || 0) + 1);
          }
          if (committerEmail && !committerEmail.includes("noreply") && committerEmail !== authorEmail) {
            emails.set(committerEmail, (emails.get(committerEmail) || 0) + 1);
          }
          if (dateStr) {
            const d = new Date(dateStr);
            commitHours.push(d.getUTCHours());
          }
        }
      } catch {}
    }

    // 4. Infer timezone from commit hours
    let inferredTimezone = "Unknown";
    let confidence = 0;
    if (commitHours.length > 5) {
      const hourCounts = Array(24).fill(0);
      commitHours.forEach(h => hourCounts[h]++);
      const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
      // Assume active hours are 9-11 UTC local — find offset
      const offsetGuess = Math.round((14 - peakHour + 24) % 24) - 12;
      const offsetStr = offsetGuess >= 0 ? `UTC+${offsetGuess}` : `UTC${offsetGuess}`;
      inferredTimezone = offsetStr;
      confidence = Math.min(95, Math.floor((commitHours.length / 50) * 100));
    }

    // 5. Sort tech stack
    const sortedTech = Object.entries(techStack)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([lang, bytes]) => ({ lang, bytes }));

    const totalBytes = sortedTech.reduce((s, t) => s + t.bytes, 0);
    const techWithPercent = sortedTech.map(t => ({
      lang: t.lang,
      percent: Math.round((t.bytes / totalBytes) * 100)
    }));

    // 6. Work pattern from commit hours
    const workPattern = Array(24).fill(0);
    commitHours.forEach(h => workPattern[h]++);

    return NextResponse.json({
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar_url,
        location: profile.location,
        blog: profile.blog,
        company: profile.company,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        created: profile.created_at,
        twitterUsername: profile.twitter_username,
      },
      emails: Array.from(emails.entries())
        .sort(([, a], [, b]) => b - a)
        .map(([email, count]) => ({ email, count })),
      timezone: { inferred: inferredTimezone, confidence },
      techStack: techWithPercent,
      workPattern,
      commitCount: commitHours.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
