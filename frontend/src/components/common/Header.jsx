import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiBell, FiSearch, FiCommand, FiSettings,
  FiLogOut, FiUser, FiHelpCircle,
} from "react-icons/fi";
import { logout } from "../../redux/slices/authSlice.js";
import BranchSwitcher from "./BranchSwitcher.jsx";
import logo from "../../assets/logo.png";
import { Avatar, Badge } from "../ui";

const Header = ({ setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for elevation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Mock notifications — replace with your real data
  const notifications = [
    {
      title: "New student enrolled",
      desc: "Ahmad Khan joined Web Development course",
      time: "2m ago",
      color: "success",
    },
    {
      title: "Fee payment received",
      desc: "Rs. 15,000 collected from Fatima Ali",
      time: "1h ago",
      color: "flame",
    },
    {
      title: "Pending fees alert",
      desc: "5 students have overdue payments",
      time: "3h ago",
      color: "danger",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{
        background: scrolled
          ? "rgba(6, 14, 30, 0.75)"
          : "rgba(6, 14, 30, 0.5)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flame-500/30 to-transparent" />

      <div className="flex items-center gap-3 px-4 lg:px-6">
        {/* ─── Mobile Menu Button ─── */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-flame-400 hover:border-flame-400/30 transition-all cursor-pointer flex-shrink-0"
          aria-label="Open menu"
        >
          <FiMenu size={18} />
        </button>

        {/* ─── Mobile Logo ─── */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <img src={logo} alt="" className="w-8 h-8 rounded-lg" />
          <span className="text-sm font-black text-white">
            MR <span className="text-gradient-flame">SOLVER</span>
          </span>
        </div>

        {/* ─── Search Bar (Desktop) ─── */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            className="group flex items-center gap-3 w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer"
            onClick={() => {
              /* TODO: open command palette */
            }}
          >
            <FiSearch className="text-white/40 group-hover:text-flame-400 transition-colors" size={14} />
            <span className="text-[13px] text-white/40 font-medium flex-1 text-left">
              Search students, courses...
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
              <FiCommand size={9} className="text-white/50" />
              <span className="text-[10px] text-white/50 font-mono font-bold">K</span>
            </span>
          </button>
        </div>

        {/* ─── Right Section ─── */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Branch Switcher */}
          <BranchSwitcher />

          {/* Search (mobile) */}
          <button className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-flame-400 hover:border-flame-400/30 transition-all cursor-pointer">
            <FiSearch size={16} />
          </button>

          {/* Notifications */}
          <div className="relative" data-dropdown>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-flame-400 hover:border-flame-400/30 transition-all cursor-pointer group"
              aria-label="Notifications"
            >
              <FiBell size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-flame-500 to-red-500 text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-flame-500/50">
                3
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-flame-500 animate-ping opacity-40" />
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden glass-strong border border-white/10 shadow-2xl shadow-black/60 z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
                    <div>
                      <p className="text-sm font-black text-white">Notifications</p>
                      <p className="text-[10px] text-white/50 font-semibold mt-0.5">
                        You have 3 unread
                      </p>
                    </div>
                    <Badge variant="flame" size="sm">3 NEW</Badge>
                  </div>

                  {/* Items */}
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map((n, i) => {
                      const colors = {
                        success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                        flame: "bg-flame-500/20 text-flame-400 border-flame-500/30",
                        danger: "bg-red-500/20 text-red-400 border-red-500/30",
                      };
                      return (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="w-full flex items-start gap-3 p-3.5 hover:bg-white/[0.04] transition-colors text-left border-b border-white/[0.04] last:border-0 cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors[n.color]}`}
                          >
                            <FiBell size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold text-white truncate">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">
                              {n.desc}
                            </p>
                            <p className="text-[10px] text-white/40 mt-1.5 font-semibold">
                              {n.time}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <button className="w-full p-3 text-[11px] font-black text-flame-400 hover:bg-white/[0.04] border-t border-white/[0.08] uppercase tracking-widest cursor-pointer">
                    View All Notifications
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative pl-2 ml-1 border-l border-white/10" data-dropdown>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <Avatar name={user?.name} status="online" size="sm" />
              <div className="hidden lg:block text-left pr-1">
                <p className="text-[13px] font-bold text-white leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] text-flame-400 uppercase tracking-widest font-black leading-tight mt-0.5">
                  {user?.role}
                </p>
              </div>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden glass-strong border border-white/10 shadow-2xl shadow-black/60 z-50"
                >
                  {/* User block */}
                  <div className="p-4 bg-gradient-to-br from-royal-500/10 to-flame-500/10 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <Avatar name={user?.name} status="online" size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-1.5">
                    {[
                      { icon: <FiUser />, label: "My Profile" },
                      { icon: <FiSettings />, label: "Settings" },
                      { icon: <FiHelpCircle />, label: "Help & Support" },
                    ].map((item, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="text-flame-400">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-1.5 border-t border-white/[0.08]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <FiLogOut />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;