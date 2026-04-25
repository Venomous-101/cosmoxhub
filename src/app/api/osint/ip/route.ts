import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip");
  if (!ip) return NextResponse.json({ error: "IP required" }, { status: 400 });

  try {
    const [geoRes, dnsRes] = await Promise.allSettled([
      fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,query`, { next: { revalidate: 0 } }),
      fetch(`https://dns.google/resolve?name=${ip}&type=PTR`, { next: { revalidate: 0 } }),
    ]);

    let geo: any = null;
    if (geoRes.status === "fulfilled" && geoRes.value.ok) {
      geo = await geoRes.value.json();
    }

    let rdns = null;
    if (dnsRes.status === "fulfilled" && dnsRes.value.ok) {
      const dns = await dnsRes.value.json();
      rdns = dns.Answer?.[0]?.data || null;
    }

    return NextResponse.json({ geo, rdns });
  } catch {
    return NextResponse.json({ error: "IP lookup failed" }, { status: 500 });
  }
}
