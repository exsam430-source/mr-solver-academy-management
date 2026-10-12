import { cn } from "../../lib/cn.js";

/**
 * Premium Avatar — gradient ring, online pulse, fallback initials
 *
 * Sizes: xs | sm | md | lg | xl
 * Status: online | offline | busy | away
 */
const Avatar = ({
  src = null,
  name = "?",
  size = "md",
  status = null,
  ring = true,
  className = "",
}) => {
  const sizes = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };

  const statusColors = {
    online: "bg-emerald-400",
    offline: "bg-ink-500",
    busy: "bg-red-400",
    away: "bg-amber-400",
  };

  const statusSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
  };

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={cn("relative inline-block flex-shrink-0", className)}>
      {ring && (
        <div className="absolute -inset-0.5 bg-gradient-to-br from-royal-500 to-flame-500 rounded-full blur-[2px] opacity-60" />
      )}

      <div
        className={cn(
          "relative rounded-full overflow-hidden flex items-center justify-center font-black text-white",
          "bg-gradient-to-br from-royal-600 to-flame-600",
          ring && "ring-2 ring-ink-950",
          sizes[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-ink-950",
            statusColors[status],
            statusSizes[size]
          )}
        >
          {status === "online" && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          )}
        </span>
      )}
    </div>
  );
};

export default Avatar;