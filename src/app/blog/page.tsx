import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blogPosts';
import { Metadata } from 'next';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Developer Guides | CosmoxHub',
  description: 'Actionable tutorials, free tool alternatives, and developer guides. Learn how to work faster with PDFs, images, AI and more — without paying a cent.',
  openGraph: {
    title: 'CosmoxHub Blog — Free Tool Guides & Developer Tutorials',
    description: 'Actionable tips, free alternatives, and tutorials to enhance your digital workflows.',
    type: 'website',
  },
};

// Map slugs / keywords to cover image + category
function getPostMeta(slug: string, title: string) {
  const t = title.toLowerCase() + slug.toLowerCase();
  if (t.includes('pdf') || t.includes('compress') || t.includes('merge') || t.includes('split') || t.includes('unlock') || t.includes('print') || t.includes('bypass')) {
    return { cover: '/blog-covers/pdf.png', category: 'PDF Tools', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' };
  }
  if (t.includes('image') || t.includes('photo') || t.includes('png') || t.includes('jpg') || t.includes('webp') || t.includes('heic') || t.includes('upscale') || t.includes('resize') || t.includes('remove.bg') || t.includes('background') || t.includes('thumbnail') || t.includes('midjourney') || t.includes('ai art')) {
    return { cover: '/blog-covers/image.png', category: 'Image Tools', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-400' };
  }
  if (t.includes('password') || t.includes('security') || t.includes('safe') || t.includes('privacy') || t.includes('secure') || t.includes('hack') || t.includes('encrypt')) {
    return { cover: '/blog-covers/security.png', category: 'Security', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' };
  }
  if (t.includes('api') || t.includes('cors') || t.includes('webhook') || t.includes('postman') || t.includes('developer') || t.includes('json') || t.includes('regex') || t.includes('code') || t.includes('zapier') || t.includes('make')) {
    return { cover: '/blog-covers/developer.png', category: 'Developer', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' };
  }
  return { cover: '/blog-covers/text.png', category: 'Productivity', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' };
}

// Sort newest first
const sorted = [...blogPosts].reverse();
const featured = sorted[0];
const rest = sorted.slice(1);

export default function BlogIndex() {
  const featuredMeta = getPostMeta(featured.slug, featured.title);

  return (
    <main className="min-h-screen bg-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">CosmoxHub</span> Blog
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Actionable tutorials, free tool alternatives, and developer guides — to supercharge your workflow without paying a dime.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />PDF Tools</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" />Image Tools</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />Developer</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Security</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Productivity</span>
          </div>
        </div>

        {/* ── Featured Post ───────────────────────────────────── */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-300 bg-slate-800/30 hover:bg-slate-800/50 shadow-xl hover:shadow-indigo-500/5">
            <div className="grid md:grid-cols-2 items-stretch">
              {/* Cover Image */}
              <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                <Image
                  src={featuredMeta.cover}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent md:hidden" />
                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${featuredMeta.bg} ${featuredMeta.color} ${featuredMeta.border}`}>
                    ✦ Featured · {featuredMeta.category}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-4 ${featuredMeta.color}`}>
                  <span className={`w-2 h-2 rounded-full ${featuredMeta.dot}`} />
                  Latest Article
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight group-hover:text-indigo-300 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {featured.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readingTime}
                  </span>
                </div>
                <div className={`inline-flex items-center gap-2 font-bold text-sm ${featuredMeta.color} group-hover:gap-3 transition-all`}>
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* ── All Articles Grid ───────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
            <span className="w-1 h-6 bg-indigo-500 rounded-full" />
            All Articles
            <span className="text-sm font-normal text-slate-500">({blogPosts.length} guides)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => {
              const meta = getPostMeta(post.slug, post.title);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                >
                  {/* Card Cover */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={meta.cover}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border} backdrop-blur-sm`}>
                        {meta.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {post.readingTime}
                      </span>
                      <span className={`flex items-center gap-1 font-semibold ${meta.color} group-hover:gap-2 transition-all`}>
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
