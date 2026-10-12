import { cn } from "../../lib/cn.js";

/**
 * Premium Skeleton — branded shimmer loader
 */
const Skeleton = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "bg-white/[0.04]",
    text: "bg-white/[0.04] h-3 rounded-md",
    title: "bg-white/[0.04] h-5 rounded-md",
    avatar: "bg-white/[0.04] rounded-full",
    card: "bg-white/[0.04] rounded-2xl",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        variants[variant],
        className
      )}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
};

export default Skeleton;