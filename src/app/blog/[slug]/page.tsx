import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-slate-400">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <div className="prose prose-invert prose-blue max-w-none prose-lg
          prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300
          prose-img:rounded-xl prose-img:shadow-xl relative bg-slate-800/20 rounded-3xl p-8 md:p-12 border border-slate-700/50">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
