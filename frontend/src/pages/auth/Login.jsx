import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice.js";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff,
  FiShield, FiZap, FiTrendingUp, FiAward,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import { Input, Button } from "../../components/ui";

const Login = () => {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { user, loading }       = useSelector((state) => state.auth);
  const { selectedBranch }      = useSelector((state) => state.branches);

  // ── Role-based redirect after login ──
  if (user) {
    if (user.role === "sub-admin")  return <Navigate to="/dashboard"      replace />;
    if (user.role === "admin")      return <Navigate to={selectedBranch ? "/dashboard" : "/select-branch"} replace />;
    return                                 <Navigate to="/attendance"      replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const features = [
    { icon: <FiShield />,    label: "Bank-grade Security"  },
    { icon: <FiZap />,       label: "Lightning Fast"       },
    { icon: <FiTrendingUp />,label: "Real-time Analytics"  },
    { icon: <FiAward />,     label: "Award-winning UX"     },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 relative">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-4 lg:gap-0 rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">

        {/* ══════════════════════════════════════════
            LEFT PANEL — BRAND CINEMATIC
            ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl lg:rounded-r-none p-8 sm:p-10 lg:p-12 min-h-[280px] lg:min-h-[640px] flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, #0F3C82 0%, #1956A9 45%, #0a1929 100%)" }}
        >
          {/* Decorative orbs */}
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-50"
            style={{ background: "radial-gradient(circle, #F06E23, transparent 70%)" }}
          />
          <motion.div
            animate={{ x: [0, -25, 20, 0], y: [0, 30, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent 70%)" }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-30 animate-pulse" />
                <img
                  src={logo}
                  alt="MR SOLVER"
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ring-2 ring-white/30 shadow-2xl bg-white object-cover"
                />
              </div>
              <div>
                <p className="text-white font-black text-base sm:text-lg leading-tight">
                  MR <span className="text-flame-400">SOLVER</span>
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                  Tech & IT Learning Hub
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero Text */}
          <div className="relative z-10 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[10px] font-black text-white/90 uppercase tracking-widest">
                  System Online • All Branches Active
                </p>
              </div>

              <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight mb-4">
                Empowering<br />
                Pakistan's <span className="text-gradient-flame">Future</span><br />
                Tech Leaders.
              </h1>
              <p className="text-base text-white/70 max-w-md leading-relaxed">
                A premium learning management system trusted by educators across the country to nurture, track, and grow students into industry-ready professionals.
              </p>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/10 backdrop-blur-xl"
                >
                  <span className="text-flame-400 text-sm">{f.icon}</span>
                  <span className="text-xs font-bold text-white/80">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative z-10 hidden lg:grid grid-cols-3 gap-3"
          >
            {[
              { value: "2,500+", label: "Active Students" },
              { value: "15+",    label: "Branches"        },
              { value: "98%",    label: "Success Rate"    },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden group hover:bg-white/10 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-flame-500/0 via-flame-500/10 to-flame-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="relative text-xl xl:text-2xl font-black text-white tracking-tight">{stat.value}</p>
                <p className="relative text-[10px] text-white/50 uppercase tracking-widest font-bold mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Mobile tagline */}
          <div className="relative z-10 lg:hidden">
            <p className="text-white/70 text-xs">Sign in to continue managing your academy ✨</p>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            RIGHT PANEL — LOGIN FORM
            ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative flex items-center justify-center p-6 sm:p-10 lg:p-12 rounded-3xl lg:rounded-l-none"
          style={{
            background: "linear-gradient(180deg, rgba(15, 29, 58, 0.95) 0%, rgba(6, 14, 30, 0.98) 100%)",
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-white/10 rounded-tl-3xl lg:rounded-tl-none pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-white/10 rounded-br-3xl pointer-events-none" />

          <div className="w-full max-w-sm relative z-10">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-flame-500/10 border border-flame-400/20 mb-4">
                <span className="text-[9px] font-black text-flame-300 uppercase tracking-widest">
                  ◆ Welcome Back
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Sign in to your<br />
                <span className="text-gradient-flame">dashboard</span>
              </h2>
              <p className="text-sm text-white/50 mt-3">
                Enter your credentials to access the academy management system.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mrsolver.edu.pk"
                icon={<FiMail size={15} />}
                required
                autoFocus
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                icon={<FiLock size={15} />}
                iconRight={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/50 hover:text-flame-400 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-flame-500 focus:ring-flame-500/20 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors font-medium">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs text-flame-400 hover:text-flame-300 font-bold transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                iconRight={!loading && <FiArrowRight />}
                className="mt-2"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </Button>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#0a1424] text-[10px] text-white/40 uppercase tracking-widest font-bold">
                  Secure Access
                </span>
              </div>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-2 text-[11px] text-white/40"
            >
              <FiShield size={11} className="text-emerald-400" />
              <span className="font-semibold">256-bit SSL encrypted • Your data is safe</span>
            </motion.div>

            {/* Role hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <p className="text-[10px] text-white/40 text-center font-semibold leading-relaxed">
                Access is role-based •{" "}
                <span className="text-flame-400 font-black">Admin</span>,{" "}
                <span className="text-royal-300 font-black">Sub-Admin</span> &{" "}
                <span className="text-emerald-400 font-black">Teacher</span> accounts supported
              </p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-6 pt-6 border-t border-white/[0.06] text-center"
            >
              <p className="text-[11px] text-white/40 font-medium">
                © 2025 <span className="text-white/60 font-bold">MR SOLVER</span> Tech & IT Learning Hub
              </p>
              <p className="text-[10px] text-white/30 mt-1 font-bold tracking-widest uppercase">
                Learn • Grow • Lead
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;