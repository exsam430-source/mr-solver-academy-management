import { cn } from "../../lib/cn.js";

/**
 * Premium Badge — glass + glow + optional pulse
 *
 * Variants: primary | success | warning | danger | info | neutral | flame
 */
const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  pulse = false,
  icon = null,
  className = "",
}) => {
  const variants = {
    primary:
      "bg-royal-500/15 text-royal-300 border-royal-400/30 shadow-royal-500/10",
    flame:
      "bg-flame-500/15 text-flame-300 border-flame-400/30 shadow-flame-500/10",
    success:
      "bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-emerald-500/10",
    warning:
      "bg-amber-500/15 text-amber-300 border-amber-400/30 shadow-amber-500/10",
    danger:
      "bg-red-500/15 text-red-300 border-red-400/30 shadow-red-500/10",
    info:
      "bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-cyan-500/10",
    neutral:
      "bg-white/8 text-white/80 border-white/15 shadow-white/5",
  };

  const sizes = {
    sm: "text-[9px] px-2 py-0.5 gap-1",
    md: "text-[10px] px-2.5 py-1 gap-1.5",
    lg: "text-xs px-3 py-1.5 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-black uppercase tracking-widest rounded-full border backdrop-blur-md shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;