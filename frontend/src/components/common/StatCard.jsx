import { motion } from "framer-motion";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { cn } from "../../lib/cn.js";

/**
 * Premium Bento Stat Card
 *
 * Props:
 *  - icon: React element
 *  - label: string
 *  - value: string | number
 *  - color: "primary" | "success" | "warning" | "danger" | "info" | "flame"
 *  - trend: { value: number, label: string, direction: "up" | "down" }
 *  - sparkline: optional array of numbers (needs at least 2 valid numbers)
 *  - onClick: optional
 */
const StatCard = ({
  icon,
  label,
  value,
  color = "primary",
  trend = null,
  sparkline = null,
  onClick,
  className = "",
}) => {
  const palette = {
    primary: {
      gradient: "from-royal-500 to-royal-600",
      glow: "shadow-royal-500/30",
      orb: "bg-royal-500/25",
      text: "text-royal-300",
      border: "border-royal-400/20",
      bgTint: "from-royal-500/[0.08] via-royal-500/[0.02] to-transparent",
    },
    flame: {
      gradient: "from-flame-500 to-flame-600",
      glow: "shadow-flame-500/30",
      orb: "bg-flame-500/25",
      text: "text-flame-300",
      border: "border-flame-400/20",
      bgTint: "from-flame-500/[0.08] via-flame-500/[0.02] to-transparent",
    },
    success: {
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/30",
      orb: "bg-emerald-500/25",
      text: "text-emerald-300",
      border: "border-emerald-400/20",
      bgTint: "from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent",
    },
    warning: {
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
      orb: "bg-amber-500/25",
      text: "text-amber-300",
      border: "border-amber-400/20",
      bgTint: "from-amber-500/[0.08] via-amber-500/[0.02] to-transparent",
    },
    danger: {
      gradient: "from-red-500 to-rose-600",
      glow: "shadow-red-500/30",
      orb: "bg-red-500/25",
      text: "text-red-300",
      border: "border-red-400/20",
      bgTint: "from-red-500/[0.08] via-red-500/[0.02] to-transparent",
    },
    info: {
      gradient: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/30",
      orb: "bg-cyan-500/25",
      text: "text-cyan-300",
      border: "border-cyan-400/20",
      bgTint: "from-cyan-500/[0.08] via-cyan-500/[0.02] to-transparent",
    },
  };

  const c = palette[color] || palette.primary;

  // 🆕 Safe sparkline data preparation
  const validSparkline = Array.isArray(sparkline)
    ? sparkline.filter((v) => typeof v === "number" && !isNaN(v) && isFinite(v))
    : [];
  const hasSparkline = validSparkline.length >= 2;

  // 🆕 Compute points safely
  let polylinePoints = "";
  let polygonPoints = "";
  if (hasSparkline) {
    const max = Math.max(...validSparkline);
    const min = Math.min(...validSparkline);
    const range = max - min || 1;
    const len = validSparkline.length - 1 || 1;

    polylinePoints = validSparkline
      .map((v, i) => {
        const x = (i / len) * 100;
        const y = 30 - ((v - min) / range) * 28;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    polygonPoints = `0,30 ${polylinePoints} 100,30`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 cursor-pointer",
        "bg-ink-900/60 backdrop-blur-xl",
        "border border-white/[0.08]",
        "transition-shadow duration-500 hover:shadow-2xl",
        `hover:${c.glow}`,
        className
      )}
    >
      {/* Gradient tint background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100", c.bgTint)} />

      {/* Floating orb */}
      <div
        className={cn(
          "absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150",
          c.orb
        )}
      />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Content */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.18em] mb-2">
            {label}
          </p>
          <h3 className={cn("text-3xl sm:text-[34px] font-black tracking-tight leading-none", c.text)}>
            {value}
          </h3>

          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black",
                  trend.direction === "up"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                )}
              >
                {trend.direction === "up" ? <FiArrowUp size={9} /> : <FiArrowDown size={9} />}
                {trend.value}%
              </div>
              <span className="text-[10px] text-white/40 font-semibold">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Icon block */}
        <div
          className={cn(
            "relative w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
            c.gradient,
            c.glow
          )}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative">{icon}</span>
        </div>
      </div>

      {/* 🆕 Sparkline — only renders when safe data exists */}
      {hasSparkline && (
        <div className="relative mt-4 h-8 -mx-1">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className={c.text}>
              <polygon points={polygonPoints} fill={`url(#spark-${color})`} />
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;