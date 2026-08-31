import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedItem {
  name: string;
  path: string;
  description: string;
  type: 'tool' | 'post';
}

interface BlogRelatedContentProps {
  items: RelatedItem[];
}

export function BlogRelatedContent({ items }: BlogRelatedContentProps) {
  if (!items || items.length === 0) return null;

  const tools = items.filter(item => item.type === 'tool');
  const posts = items.filter(item => item.type === 'post');

  return (
    <div className="mt-16 space-y-12">
      {/* Related Tools */}
      {tools.length > 0 && (
        <div className="pt-12 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full" />
              Related Tools
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.path}
                  className="group block p-5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-indigo-500/30 rounded-xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">
                        {tool.name}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Posts */}
      {posts.length > 0 && (
        <div className="pt-12 border-t border-slate-700/50">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full" />
              Related Articles
            </h3>
            
            <div className="space-y-3">
              {posts.map((post, idx) => (
                <Link
                  key={idx}
                  href={post.path}
                  className="group flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-purple-500/30 rounded-xl transition-all hover:-translate-x-1"
                >
                  <p className="font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                    {post.name}
                  </p>
                  <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
