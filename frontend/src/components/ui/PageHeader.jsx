import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";

/**
 * Premium Page Header — used on every page for consistent identity
 */
const PageHeader = ({
  title,
  subtitle = null,
  icon = null,
  action = null,
  breadcrumbs = null,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8",
        className
      )}
    >
      <div className="min-w-0">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

        <div className="flex items-center gap-3">
          {icon && (
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-600 to-flame-600 flex items-center justify-center text-white text-xl shadow-lg shadow-flame-600/30">
                {icon}
              </div>
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
};

export default PageHeader;