import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../lib/cn.js";

/**
 * Premium Dropdown — smooth height animation, stagger items
 */
const Dropdown = ({
  trigger,
  items = [],
  align = "right",
  className = "",
  menuClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={cn(
              "absolute top-full mt-2 min-w-[200px] z-50 rounded-2xl overflow-hidden",
              "bg-ink-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50",
              align === "right" ? "right-0" : "left-0",
              menuClassName
            )}
          >
            <div className="p-1.5">
              {items.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left",
                    item.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;