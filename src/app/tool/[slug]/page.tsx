import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pseoData, getIcon } from "@/lib/pseo-data";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface PseoPageProps {
  params: {
    slug: string;
  };
}

// Generate Static Params for programmatic pages
export async function generateStaticParams() {
  return pseoData.map((page) => ({
    slug: page.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PseoPageProps): Promise<Metadata> {
  const page = pseoData.find((p) => p.slug === params.slug);
  
  if (!page) {
    return {
      title: "Page Not Found | CosmoxHub",
    };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://cosmoxhub.com/tool/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "article",
      url: `https://cosmoxhub.com/tool/${page.slug}`,
    }
  };
}

function DynamicIcon({ iconName }: { iconName: any }) {
  const Icon = getIcon(iconName);
  return <Icon size={32} />;
}

export default function DynamicSeoPage({ params }: PseoPageProps) {
  const page = pseoData.find((p) => p.slug === params.slug);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white">
      {/* JSON-LD Structured Data for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": page.title,
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "All",
            "description": page.metaDescription,
            "url": `https://cosmoxhub.com/tool/${page.slug}`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-8">
            <DynamicIcon iconName={page.iconName} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-6">
            {page.h1}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            {page.metaDescription}
          </p>

          <Link
            href={page.targetToolLink}
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
          >
            {page.targetToolName}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 prose prose-invert prose-indigo max-w-none">
            {page.content.map((paragraph, idx) => (
              <p key={idx} className="text-slate-300 text-lg leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features/benefits typical of CosmoxHub */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-white mb-2">100% Free & Private</h3>
                <p className="text-slate-400 text-sm">Everything happens in your browser. No data is sent to external servers.</p>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-slate-400 text-sm">Optimized for speed. Get immediate results with zero loading delays.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
