import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
  index?: number; // for staggered animation delay
}

const colorMap: Record<string, {
  radial: string;
  iconBg: string;
  iconBorder: string;
  badgeBg: string;
  badgeText: string;
  hoverBorder: string;
  hoverShadow: string;
  hoverBtn: string;
  hoverBtnText: string;
}> = {
  "#ef4444": { radial: "from-red-500/40",    iconBg: "bg-red-500/15",    iconBorder: "border-red-500/30",    badgeBg: "bg-red-500/20",    badgeText: "text-red-400",    hoverBorder: "hover:border-red-500/40",    hoverShadow: "hover:shadow-red-500/10",    hoverBtn: "group-hover:bg-red-500/10 group-hover:border-red-500/30",    hoverBtnText: "group-hover:text-red-400" },
  "#f59e0b": { radial: "from-amber-500/40",  iconBg: "bg-amber-500/15",  iconBorder: "border-amber-500/30",  badgeBg: "bg-amber-500/20",  badgeText: "text-amber-400",  hoverBorder: "hover:border-amber-500/40",  hoverShadow: "hover:shadow-amber-500/10",  hoverBtn: "group-hover:bg-amber-500/10 group-hover:border-amber-500/30",  hoverBtnText: "group-hover:text-amber-400" },
  "#10b981": { radial: "from-emerald-500/40",iconBg: "bg-emerald-500/15",iconBorder: "border-emerald-500/30",badgeBg: "bg-emerald-500/20",badgeText: "text-emerald-400",hoverBorder: "hover:border-emerald-500/40",hoverShadow: "hover:shadow-emerald-500/10",hoverBtn: "group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30",hoverBtnText: "group-hover:text-emerald-400" },
  "#06b6d4": { radial: "from-cyan-500/40",   iconBg: "bg-cyan-500/15",   iconBorder: "border-cyan-500/30",   badgeBg: "bg-cyan-500/20",   badgeText: "text-cyan-400",   hoverBorder: "hover:border-cyan-500/40",   hoverShadow: "hover:shadow-cyan-500/10",   hoverBtn: "group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30",   hoverBtnText: "group-hover:text-cyan-400" },
  "#3b82f6": { radial: "from-blue-500/40",   iconBg: "bg-blue-500/15",   iconBorder: "border-blue-500/30",   badgeBg: "bg-blue-500/20",   badgeText: "text-blue-400",   hoverBorder: "hover:border-blue-500/40",   hoverShadow: "hover:shadow-blue-500/10",   hoverBtn: "group-hover:bg-blue-500/10 group-hover:border-blue-500/30",   hoverBtnText: "group-hover:text-blue-400" },
  "#6366f1": { radial: "from-indigo-500/40", iconBg: "bg-indigo-500/15", iconBorder: "border-indigo-500/30", badgeBg: "bg-indigo-500/20", badgeText: "text-indigo-400", hoverBorder: "hover:border-indigo-500/40", hoverShadow: "hover:shadow-indigo-500/10", hoverBtn: "group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30", hoverBtnText: "group-hover:text-indigo-400" },
  "#8b5cf6": { radial: "from-violet-500/40", iconBg: "bg-violet-500/15", iconBorder: "border-violet-500/30", badgeBg: "bg-violet-500/20", badgeText: "text-violet-400", hoverBorder: "hover:border-violet-500/40", hoverShadow: "hover:shadow-violet-500/10", hoverBtn: "group-hover:bg-violet-500/10 group-hover:border-violet-500/30", hoverBtnText: "group-hover:text-violet-400" },
  "#ec4899": { radial: "from-pink-500/40",   iconBg: "bg-pink-500/15",   iconBorder: "border-pink-500/30",   badgeBg: "bg-pink-500/20",   badgeText: "text-pink-400",   hoverBorder: "hover:border-pink-500/40",   hoverShadow: "hover:shadow-pink-500/10",   hoverBtn: "group-hover:bg-pink-500/10 group-hover:border-pink-500/30",   hoverBtnText: "group-hover:text-pink-400" },
  "#0ea5e9": { radial: "from-sky-500/40",    iconBg: "bg-sky-500/15",    iconBorder: "border-sky-500/30",    badgeBg: "bg-sky-500/20",    badgeText: "text-sky-400",    hoverBorder: "hover:border-sky-500/40",    hoverShadow: "hover:shadow-sky-500/10",    hoverBtn: "group-hover:bg-sky-500/10 group-hover:border-sky-500/30",    hoverBtnText: "group-hover:text-sky-400" },
  "default":  { radial: "from-violet-500/40",iconBg: "bg-violet-500/15", iconBorder: "border-violet-500/30", badgeBg: "bg-violet-500/20", badgeText: "text-violet-400", hoverBorder: "hover:border-[#7C3AED]/40",  hoverShadow: "hover:shadow-[#7C3AED]/10",  hoverBtn: "group-hover:bg-[#7C3AED]/10 group-hover:border-[#7C3AED]/30",  hoverBtnText: "group-hover:text-[#A78BFA]" },
};

// Stagger delay mapping (capped at 8 for perf)
const staggerDelays = ["delay-75","delay-100","delay-150","delay-200","delay-300","delay-400","delay-500","delay-600","delay-700","delay-800"];

export default function ToolCard({
  title, description, href, icon: Icon,
  color = "#6366f1", badge, index = 0
}: ToolCardProps) {
  const styles  = colorMap[color] || colorMap["default"];
  const delayClass = staggerDelays[Math.min(index % 8, staggerDelays.length - 1)];
  const isPopular = badge?.toLowerCase() === "popular";

  return (
    <Link
      href={href}
      className={`
        animate-fade-up ${delayClass}
        bg-[#0d0d20] border border-white/[0.07] rounded-2xl p-5
        flex flex-col gap-5 relative overflow-hidden h-full group no-underline
        transition-all duration-300
        hover:-translate-y-1.5
        ${styles.hoverBorder}
        hover:shadow-xl ${styles.hoverShadow}
        hover:bg-[#10102a]
        cursor-pointer
      `}
    >
      {/* Card-edge glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${color}22` }}
      />

      {/* Corner glow orb */}
      <div
        className={`absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none opacity-40 group-hover:opacity-80 group-hover:scale-[1.8] transition-all duration-700 ease-out bg-[radial-gradient(circle,var(--tw-gradient-from)_0%,transparent_70%)] ${styles.radial}`}
      />

      {/* Icon */}
      <div
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${styles.iconBg} ${styles.iconBorder} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
      >
        <Icon size={22} color={color} strokeWidth={2} />
        {/* Icon inner glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: `0 0 12px ${color}40` }} />
      </div>

      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors duration-200">
            {title}
          </h3>
          {badge && (
            <span className={`relative text-[0.65rem] font-bold px-2.5 py-0.5 rounded-md tracking-wider uppercase ${styles.badgeBg} ${styles.badgeText}`}>
              {badge}
              {/* Pulse ring for "Popular" badge */}
              {isPopular && (
                <span className="absolute -inset-0.5 rounded-md border border-current opacity-50 animate-ping" />
              )}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed mb-4 transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Use Tool button */}
      <div className="mt-auto pt-4 relative z-10">
        <div className={`w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.07] rounded-xl py-2.5 px-4 ${styles.hoverBtn} ${styles.hoverBtnText} transition-all duration-250`}>
          Use Tool
          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
        </div>
      </div>
    </Link>
  );
}
