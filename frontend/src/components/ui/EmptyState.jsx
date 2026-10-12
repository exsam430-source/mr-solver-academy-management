import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";

/**
 * Premium Empty State — beautiful illustrations for empty data
 */
const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  action = null,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {/* Icon with aurora glow */}
      {icon && (
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 border border-white/10 flex items-center justify-center text-3xl text-flame-400 shadow-xl">
            {icon}
          </div>
        </div>
      )}

      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-sm mb-6">{description}</p>

      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;