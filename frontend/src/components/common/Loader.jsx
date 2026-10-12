import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const Loader = ({ fullScreen = false, label = "Loading" }) => {
  const containerClass = fullScreen
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/60 backdrop-blur-xl"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6">
        {/* Spinning rings + logo */}
        <div className="relative w-24 h-24">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-full blur-2xl opacity-50 animate-pulse" />

          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#F06E23",
              borderRightColor: "#1956A9",
            }}
          />

          {/* Inner counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: "#FB923C",
              borderLeftColor: "#60a5fa",
            }}
          />

          {/* Logo center */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-white shadow-2xl overflow-hidden flex items-center justify-center"
          >
            <img src={logo} alt="MR SOLVER" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Brand + label */}
        <div className="text-center">
          <p className="text-sm font-black text-white tracking-tight">
            MR <span className="text-gradient-flame">SOLVER</span>
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold">
              {label}
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-flame-400 text-xs font-black"
            >
              •••
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;