import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  try {
    const [certsRes, dnsRes, reverseRes] = await Promise.allSettled([
      // crt.sh - certificate transparency logs for subdomains
      fetch(`https://crt.sh/?q=%.${clean}&output=json`, { next: { revalidate: 0 } }),
      // Google DNS - get IPs
      fetch(`https://dns.google/resolve?name=${clean}&type=A`, { next: { revalidate: 0 } }),
      // RDAP for WHOIS
      fetch(`https://rdap.org/domain/${clean}`, { next: { revalidate: 0 } }),
    ]);

    // Subdomains from crt.sh
    let subdomains: string[] = [];
    if (certsRes.status === "fulfilled" && certsRes.value.ok) {
      const certs = await certsRes.value.json();
      const names = new Set<string>();
      for (const cert of certs) {
        const n = cert.name_value as string;
        n.split("\n").forEach(name => {
          const trimmed = name.trim().replace(/^\*\./, "");
          if (trimmed.endsWith(clean) && !trimmed.startsWith("*")) names.add(trimmed);
        });
      }
      subdomains = Array.from(names).slice(0, 30);
    }

    // IPs from DNS
    let ips: string[] = [];
    if (dnsRes.status === "fulfilled" && dnsRes.value.ok) {
      const dns = await dnsRes.value.json();
      ips = (dns.Answer || []).filter((r: any) => r.type === 1).map((r: any) => r.data);
    }

    // Reverse IP lookup for each IP (HackerTarget free)
    const reverseIpData: Record<string, string[]> = {};
    for (const ip of ips.slice(0, 3)) {
      try {
        const r = await fetch(`https://api.hackertarget.com/reverseiplookup/?q=${ip}`, { next: { revalidate: 0 } });
        const text = await r.text();
        if (!text.includes("error") && !text.includes("API count")) {
          reverseIpData[ip] = text.split("\n").filter(Boolean).slice(0, 20);
        }
      } catch {}
    }

    // RDAP / WHOIS
    let whois: any = null;
    if (reverseRes.status === "fulfilled" && reverseRes.value.ok) {
      const raw = await reverseRes.value.json();
      whois = {
        name: raw.ldhName,
        status: raw.status,
        registrar: raw.entities?.find((e: any) => e.roles?.includes("registrar"))?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3] || "Unknown",
        created: raw.events?.find((e: any) => e.eventAction === "registration")?.eventDate,
        expires: raw.events?.find((e: any) => e.eventAction === "expiration")?.eventDate,
        updated: raw.events?.find((e: any) => e.eventAction === "last changed")?.eventDate,
        nameservers: raw.nameservers?.map((ns: any) => ns.ldhName) || [],
      };
    }

    return NextResponse.json({ domain: clean, subdomains, ips, reverseIpData, whois });
  } catch (err) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
