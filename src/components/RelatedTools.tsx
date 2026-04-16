"use client";

import Link from "next/link";
import { categories, Tool } from "@/lib/tools-data";

interface RelatedToolsProps {
  currentPath: string;
  isSidebar?: boolean; // kept for API compatibility, ignored
}

export default function RelatedTools({ currentPath }: RelatedToolsProps) {
  // Find the current category
  const currentCategory = categories.find((cat) =>
    cat.tools.some((tool) => tool.href === currentPath)
  );

  // Get tools from same category first
  const suggestedTools: Tool[] = currentCategory
    ? currentCategory.tools.filter((tool) => tool.href !== currentPath)
    : [];

  // Pad with tools from other categories if needed
  if (suggestedTools.length < 4) {
    const otherTools = categories
      .filter((cat) => cat.id !== currentCategory?.id)
      .flatMap((cat) => cat.tools)
      .slice(0, 8);

    for (const tool of otherTools) {
      if (suggestedTools.length >= 4) break;
      if (
        tool.href !== currentPath &&
        !suggestedTools.find((t) => t.href === tool.href)
      ) {
        suggestedTools.push(tool);
      }
    }
  }

  const finalTools = suggestedTools.slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {finalTools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-[#7C3AED]/40 hover:bg-white/[0.06] transition-all duration-200 group"
        >
          <p className="text-white text-sm font-semibold group-hover:text-[#A78BFA] transition-colors mb-2">
            {tool.title}
          </p>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
