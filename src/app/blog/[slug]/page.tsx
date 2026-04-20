import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

function getPostMeta(slug: string, title: string) {
  const t = title.toLowerCase() + slug.toLowerCase();
  if (t.includes('pdf') || t.includes('compress') || t.includes('merge') || t.includes('split') || t.includes('unlock') || t.includes('print') || t.includes('bypass')) {
    return { cover: '/blog-covers/pdf.png', category: 'PDF Tools', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  }
  if (t.includes('image') || t.includes('photo') || t.includes('png') || t.includes('jpg') || t.includes('webp') || t.includes('heic') || t.includes('upscale') || t.includes('resize') || t.includes('remove.bg') || t.includes('background') || t.includes('thumbnail') || t.includes('midjourney')) {
    return { cover: '/blog-covers/image.png', category: 'Image Tools', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
  }
  if (t.includes('password') || t.includes('security') || t.includes('safe') || t.includes('privacy') || t.includes('secure') || t.includes('hack') || t.includes('encrypt')) {
    return { cover: '/blog-covers/security.png', category: 'Security', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  }
  if (t.includes('api') || t.includes('cors') || t.includes('webhook') || t.includes('postman') || t.includes('json') || t.includes('regex') || t.includes('zapier') || t.includes('make') || t.includes('developer')) {
    return { cover: '/blog-covers/developer.png', category: 'Developer', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
  }
  return { cover: '/blog-covers/text.png', category: 'Productivity', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Not Found' };
  const meta = getPostMeta(post.slug, post.title);

  return {
    title: `${post.title} | CosmoxHub Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: [post.author],
      images: [{ url: meta.cover, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const meta = getPostMeta(post.slug, post.title);

  // Get 3 related posts (excluding current)
  const related = blogPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-900">

      {/* ── Hero Cover ─────────────────────────────────────────── */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src={meta.cover}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
        {/* Back link */}
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white bg-slate-900/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl transition-all hover:bg-slate-900/80"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        {/* Category badge over image */}
        <div className="absolute top-6 right-4 md:right-8 z-10">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm ${meta.bg} ${meta.color} ${meta.border}`}>
            {meta.category}
          </span>
        </div>
      </div>

      {/* ── Article Content ─────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">

        {/* Article Header Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-10 mb-10 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6 border-l-2 border-indigo-500 pl-4">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-semibold text-slate-300">{post.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>
        </div>

        {/* Markdown Body */}
        <div className="prose prose-invert prose-blue max-w-none prose-lg
          prose-headings:font-black prose-headings:text-white
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-700/50 prose-h2:pb-3
          prose-h3:text-xl prose-h3:text-slate-100 prose-h3:mt-8
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-indigo-400 hover:prose-a:text-indigo-300
          prose-strong:text-white
          prose-code:text-indigo-300 prose-code:bg-slate-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
          prose-pre:bg-slate-800/80 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-2xl
          prose-ul:text-slate-300 prose-ol:text-slate-300
          prose-li:marker:text-indigo-400
          prose-blockquote:border-indigo-500 prose-blockquote:text-slate-400
          prose-img:rounded-2xl prose-img:shadow-xl">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* ── Related Posts ─────────────────────────────────────── */}
        <div className="mt-16 pt-12 border-t border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-indigo-500 rounded-full" />
            More Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rp) => {
              const rm = getPostMeta(rp.slug, rp.title);
              return (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
                >
                  <div className="relative h-28 overflow-hidden">
                    <Image src={rm.cover} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full border ${rm.bg} ${rm.color} ${rm.border}`}>{rm.category}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">{rp.title}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />{rp.readingTime}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-12 pb-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <ArrowLeft className="w-4 h-4" /> View All Articles
          </Link>
        </div>

      </article>
    </main>
  );
}
