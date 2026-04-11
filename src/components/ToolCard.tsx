import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
}

const colorMap: Record<string, { radial: string, iconBg: string, iconBorder: string, badgeBg: string, badgeText: string, arrow: string }> = {
  "#ef4444": { radial: "from-red-500/30", iconBg: "bg-red-500/15", iconBorder: "border-red-500/30", badgeBg: "bg-red-500/20", badgeText: "text-red-500", arrow: "text-red-500" },
  "#f59e0b": { radial: "from-amber-500/30", iconBg: "bg-amber-500/15", iconBorder: "border-amber-500/30", badgeBg: "bg-amber-500/20", badgeText: "text-amber-500", arrow: "text-amber-500" },
  "#10b981": { radial: "from-emerald-500/30", iconBg: "bg-emerald-500/15", iconBorder: "border-emerald-500/30", badgeBg: "bg-emerald-500/20", badgeText: "text-emerald-500", arrow: "text-emerald-500" },
  "#06b6d4": { radial: "from-cyan-500/30", iconBg: "bg-cyan-500/15", iconBorder: "border-cyan-500/30", badgeBg: "bg-cyan-500/20", badgeText: "text-cyan-500", arrow: "text-cyan-500" },
  "#3b82f6": { radial: "from-blue-500/30", iconBg: "bg-blue-500/15", iconBorder: "border-blue-500/30", badgeBg: "bg-blue-500/20", badgeText: "text-blue-500", arrow: "text-blue-500" },
  "#6366f1": { radial: "from-indigo-500/30", iconBg: "bg-indigo-500/15", iconBorder: "border-indigo-500/30", badgeBg: "bg-indigo-500/20", badgeText: "text-indigo-500", arrow: "text-indigo-500" },
  "#8b5cf6": { radial: "from-violet-500/30", iconBg: "bg-violet-500/15", iconBorder: "border-violet-500/30", badgeBg: "bg-violet-500/20", badgeText: "text-violet-500", arrow: "text-violet-500" },
  "#ec4899": { radial: "from-pink-500/30", iconBg: "bg-pink-500/15", iconBorder: "border-pink-500/30", badgeBg: "bg-pink-500/20", badgeText: "text-pink-500", arrow: "text-pink-500" },
  "#0ea5e9": { radial: "from-sky-500/30", iconBg: "bg-sky-500/15", iconBorder: "border-sky-500/30", badgeBg: "bg-sky-500/20", badgeText: "text-sky-500", arrow: "text-sky-500" },
  "default": { radial: "from-indigo-500/30", iconBg: "bg-indigo-500/15", iconBorder: "border-indigo-500/30", badgeBg: "bg-indigo-500/20", badgeText: "text-indigo-500", arrow: "text-indigo-500" }
};

export default function ToolCard({ title, description, href, icon: Icon, color = "#6366f1", badge }: ToolCardProps) {
  const styles = colorMap[color] || colorMap["default"];

  return (
    <Link 
      href={href} 
      className="card p-6 flex flex-col gap-5 relative overflow-hidden h-full group no-underline transition-all duration-200 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-lg hover:shadow-[#7C3AED]/10 cursor-pointer"
    >
      {/* Glow effect */}
      <div 
        className={`absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none opacity-50 group-hover:scale-[2] transition-transform duration-700 ease-out bg-[radial-gradient(circle,var(--tw-gradient-from)_0%,transparent_70%)] ${styles.radial}`} 
      />

      {/* Icon */}
      <div 
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${styles.iconBg} ${styles.iconBorder} group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon size={22} color={color} strokeWidth={2} />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          {badge && (
            <span 
              className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-md tracking-wider uppercase ${styles.badgeBg} ${styles.badgeText}`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>
      </div>

      {/* Arrow hint */}
      <div 
        className={`pt-3 mt-auto mb-6 text-sm font-bold opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ${styles.arrow} flex items-center gap-1`}
      >
        Use Tool <span>&rarr;</span>
      </div>
    </Link>
  );
}
