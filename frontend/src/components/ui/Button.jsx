import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";
import { FiLoader } from "react-icons/fi";

/**
 * Premium Button — 6 variants, 4 sizes, shimmer hover, ring glow
 *
 * Variants: primary | secondary | ghost | danger | success | outline
 * Sizes:    sm | md | lg | xl
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-flame-500 to-flame-600 text-white shadow-lg shadow-flame-600/30 hover:shadow-flame-600/50 ring-1 ring-flame-400/30",
    secondary:
      "bg-gradient-to-r from-royal-600 to-royal-500 text-white shadow-lg shadow-royal-600/30 hover:shadow-royal-500/50 ring-1 ring-royal-400/30",
    ghost:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 ring-1 ring-red-400/30",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 ring-1 ring-emerald-400/30",
    outline:
      "bg-transparent border border-flame-500/40 text-flame-400 hover:bg-flame-500/10 hover:border-flame-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-6 py-3 text-sm gap-2 rounded-xl",
    xl: "px-8 py-4 text-base gap-2.5 rounded-2xl",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: disabled || loading ? 0 : -1, scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        // base
        "group relative inline-flex items-center justify-center font-bold tracking-tight overflow-hidden transition-shadow duration-300 cursor-pointer select-none whitespace-nowrap",
        // variant + size
        variants[variant],
        sizes[size],
        // states
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {/* Shimmer effect on hover */}
      {!disabled && !loading && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      <span className="relative flex items-center gap-2">
        {loading ? (
          <FiLoader className="animate-spin" />
        ) : (
          icon && <span className="flex items-center">{icon}</span>
        )}
        {children}
        {iconRight && !loading && <span className="flex items-center">{iconRight}</span>}
      </span>
    </motion.button>
  );
};

export default Button;