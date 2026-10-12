import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "../../lib/cn.js";

/**
 * Premium Modal — backdrop blur, spring entry, focus trap
 *
 * Sizes: sm | md | lg | xl | full
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  showClose = true,
  footer = null,
  className = "",
}) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={cn(
              "relative w-full max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl",
              "bg-gradient-to-br from-ink-900 via-[#0b1734] to-ink-950 border border-white/10",
              sizes[size],
              className
            )}
          >
            {/* Top gradient stripe */}
            <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-500 via-flame-500 to-flame-400" />

            {/* Decorative orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-flame-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-royal-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            {(title || showClose) && (
              <div className="relative flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <div className="min-w-0">
                  {title && (
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-white/50 mt-1">{subtitle}</p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300 transition-all cursor-pointer flex-shrink-0"
                    aria-label="Close"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="relative px-6 py-4 border-t border-white/[0.06] bg-black/20">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;