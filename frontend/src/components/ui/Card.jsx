import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";

/**
 * Premium Card — glass effect, animated borders, optional tilt
 *
 * Variants: glass | solid | gradient | elevated
 */
const Card = ({
  children,
  variant = "glass",
  hover = true,
  padding = "md",
  className = "",
  onClick,
  ...props
}) => {
  const variants = {
    glass:
      "bg-ink-900/60 backdrop-blur-2xl border border-white/[0.08] shadow-xl shadow-black/20",
    solid:
      "bg-ink-900 border border-ink-800",
    gradient:
      "bg-gradient-to-br from-royal-600/20 via-ink-900/80 to-flame-500/10 border border-white/[0.08] backdrop-blur-xl",
    elevated:
      "bg-ink-900 border border-ink-800 shadow-2xl shadow-black/40",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6 sm:p-8",
    xl: "p-8 sm:p-10",
  };

  const MotionTag = onClick ? motion.button : motion.div;

  return (
    <MotionTag
      onClick={onClick}
      whileHover={
        hover
          ? { y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }
          : undefined
      }
      className={cn(
        "relative rounded-2xl overflow-hidden transition-shadow duration-500",
        variants[variant],
        paddings[padding],
        hover && "hover:shadow-2xl hover:border-white/[0.15]",
        onClick && "cursor-pointer text-left w-full",
        className
      )}
      {...props}
    >
      {/* Top hairline shimmer */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </MotionTag>
  );
};

export default Card;