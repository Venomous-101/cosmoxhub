import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Articles',
  description: 'Learn tips, tricks, and discover free alternatives for your favorite digital tools on the CosmoxHub Blog.',
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CosmoxHub</span> Blog
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Actionable tips, free alternatives, and tutorials to enhance your digital workflows—without sacrificing your privacy or your wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-colors group flex flex-col h-full"
            >
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-slate-400 line-clamp-3">
                  {post.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500 font-medium">
                <span>{post.author}</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
