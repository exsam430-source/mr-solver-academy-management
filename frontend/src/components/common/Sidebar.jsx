import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../redux/slices/authSlice.js";
import logo from "../../assets/logo.png";
import {
  FiHome, FiUsers, FiBook, FiDollarSign, FiCalendar,
  FiAlertCircle, FiBarChart2, FiMapPin, FiLogOut,
  FiUserPlus, FiX, FiTrendingUp, FiShield,
} from "react-icons/fi";
import { Avatar, Badge } from "../ui";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Admin navigation
  const adminGroups = [
    {
      label: "Overview",
      links: [
        { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
        { to: "/branches", icon: <FiMapPin />, label: "Branches" },
      ],
    },
    {
      label: "Academic",
      links: [
        { to: "/students", icon: <FiUsers />, label: "Students" },
        { to: "/courses", icon: <FiBook />, label: "Courses" },
        { to: "/teachers", icon: <FiUserPlus />, label: "Teachers" },
        { to: "/sub-admins", icon: <FiShield />, label: "Sub-Admins" },
        { to: "/attendance", icon: <FiCalendar />, label: "Attendance" },
      ],
    },
    {
      label: "Finance",
      links: [
        { to: "/fees", icon: <FiDollarSign />, label: "Fee Management" },
        { to: "/pending-fees", icon: <FiAlertCircle />, label: "Pending Fees", badge: "!" },
        { to: "/monthly-collection", icon: <FiTrendingUp />, label: "Collections" },
      ],
    },
    {
      label: "Insights",
      links: [
        { to: "/reports", icon: <FiBarChart2 />, label: "Reports" },
      ],
    },
  ];

  // Sub-Admin navigation — no branches, no teachers, no sub-admins, no reports, no collections
  const subAdminGroups = [
    {
      label: "Overview",
      links: [
        { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
      ],
    },
    {
      label: "Academic",
      links: [
        { to: "/students", icon: <FiUsers />, label: "Students" },
        { to: "/courses", icon: <FiBook />, label: "Courses" },
        { to: "/attendance", icon: <FiCalendar />, label: "Attendance" },
      ],
    },
    {
      label: "Finance",
      links: [
        { to: "/fees", icon: <FiDollarSign />, label: "Fee Management" },
        { to: "/pending-fees", icon: <FiAlertCircle />, label: "Pending Fees", badge: "!" },
      ],
    },
  ];

  // Teacher navigation
  const teacherGroups = [
    {
      label: "Teaching",
      links: [
        { to: "/attendance", icon: <FiCalendar />, label: "Mark Attendance" },
      ],
    },
  ];

  const groups =
    user?.role === "admin"
      ? adminGroups
      : user?.role === "sub-admin"
      ? subAdminGroups
      : teacherGroups;

  const roleBadgeVariant =
    user?.role === "admin"
      ? "flame"
      : user?.role === "sub-admin"
      ? "primary"
      : "success";

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "sub-admin"
      ? "Sub-Admin"
      : "Teacher";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : typeof window !== "undefined" && window.innerWidth >= 1024 ? 0 : -280,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed top-0 left-0 z-50 h-screen w-[260px] flex flex-col lg:translate-x-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15, 60, 130, 0.85) 0%, rgba(10, 25, 41, 0.95) 60%, rgba(6, 14, 30, 0.98) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Glow accents */}
        <div className="absolute -top-32 -left-20 w-64 h-64 bg-royal-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-flame-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-flame-500/40 to-transparent pointer-events-none" />

        {/* Header / Logo */}
        <div className="relative flex items-center justify-between p-5 border-b border-white/[0.08]">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-flame-400 to-royal-400 rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <img
                src={logo}
                alt="MR SOLVER"
                className="relative w-11 h-11 rounded-2xl object-cover ring-2 ring-white/20 bg-white shadow-xl"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-black text-white leading-tight tracking-tight">
                MR <span className="text-gradient-flame">SOLVER</span>
              </h1>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.18em] font-bold mt-0.5">
                Learning Hub
              </p>
            </div>
          </NavLink>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* User Card */}
        <div className="relative px-4 pt-4">
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-flame-500/30 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3">
              <Avatar name={user?.name} status="online" size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] text-white/50 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>
            {/* Show assigned branch for sub-admin */}
            {user?.role === "sub-admin" && user?.assignedBranch && (
              <div className="relative mt-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-royal-500/20 border border-royal-400/20">
                <FiMapPin size={10} className="text-royal-300 flex-shrink-0" />
                <span className="text-[10px] text-royal-200 font-bold truncate">
                  {user.assignedBranch.name}
                </span>
              </div>
            )}
            <div className="relative mt-3 flex items-center justify-between">
              <Badge variant={roleBadgeVariant} size="sm" pulse>
                {roleLabel}
              </Badge>
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          {groups.map((group, gIdx) => (
            <div key={group.label} className={gIdx > 0 ? "mt-5" : ""}>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.22em] px-3 mb-2">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "text-white"
                          : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="active-nav-pill"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-flame-500 to-flame-600 shadow-lg shadow-flame-600/40"
                          />
                        )}
                        {isActive && (
                          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/15 to-transparent pointer-events-none" />
                        )}
                        <span
                          className={`relative z-10 text-[15px] transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-white/70 group-hover:text-flame-400"
                          }`}
                        >
                          {link.icon}
                        </span>
                        <span className="relative z-10 flex-1">{link.label}</span>
                        {link.badge && (
                          <span className="relative z-10 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-red-500/50">
                            {link.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="relative p-3 border-t border-white/[0.08]">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 hover:border-red-400/40 transition-all cursor-pointer"
          >
            <FiLogOut className="text-[15px] group-hover:rotate-12 transition-transform" />
            <span className="flex-1 text-left">Sign Out</span>
            <span className="text-[10px] text-red-400/60 font-mono">⌘Q</span>
          </motion.button>

          <div className="mt-3 flex items-center justify-between px-2">
            <p className="text-[9px] text-white/30 font-bold tracking-wider uppercase">
              v1.0 • 2025
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
                Online
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;