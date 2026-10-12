import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn.js";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Premium Input — floating label, focus glow, validation animation
 */
const Input = forwardRef(
  (
    {
      label,
      type = "text",
      icon = null,
      iconRight = null,
      error = null,
      hint = null,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2">
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && (
            <div
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300",
                focused ? "text-flame-400" : "text-white/40"
              )}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            className={cn(
              "w-full bg-white/[0.04] border rounded-xl py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 backdrop-blur-sm",
              icon ? "pl-11" : "pl-4",
              iconRight ? "pr-11" : "pr-4",
              error
                ? "border-red-400/60 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-white/10 focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)]",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-white/50">
              {iconRight}
            </div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400 font-semibold"
            >
              <FiAlertCircle size={12} /> {error}
            </motion.p>
          )}
          {!error && hint && (
            <p className="mt-1.5 text-xs text-white/40">{hint}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;