import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  try {
    const res = await fetch(
      `http://web.archive.org/cdx/search/cdx?url=${clean}/*&output=json&fl=timestamp,statuscode,mimetype&limit=200&collapse=timestamp:6`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return NextResponse.json({ snapshots: [] });
    const raw = await res.json() as string[][];
    const [, ...rows] = raw; // skip header row

    const snapshots = rows.map(([ts, status, mime]) => ({
      timestamp: ts,
      year: ts.slice(0, 4),
      month: ts.slice(4, 6),
      date: `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`,
      url: `https://web.archive.org/web/${ts}/${clean}`,
      status,
      mime,
    }));

    // Group by year for timeline
    const byYear: Record<string, number> = {};
    snapshots.forEach(s => { byYear[s.year] = (byYear[s.year] || 0) + 1; });

    return NextResponse.json({ domain: clean, snapshots: snapshots.slice(0, 50), byYear, total: snapshots.length });
  } catch {
    return NextResponse.json({ error: "Wayback lookup failed" }, { status: 500 });
  }
}
