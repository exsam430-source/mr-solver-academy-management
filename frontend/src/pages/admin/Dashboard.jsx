import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../api/axios.js";
import Loader from "../../components/common/Loader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { Card, Button, Badge, Avatar, EmptyState } from "../../components/ui";

import {
  FiUsers, FiBook, FiDollarSign, FiCalendar, FiTrendingUp,
  FiAlertCircle, FiMapPin, FiCheckCircle, FiXCircle, FiActivity,
  FiTarget, FiAward, FiClock, FiRefreshCw, FiPieChart, FiBarChart2,
  FiArrowRight, FiPlus, FiShield,
} from "react-icons/fi";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CHART_COLORS = [
  "#1956A9", "#F06E23", "#10b981", "#60a5fa",
  "#fbbf24", "#06b6d4", "#ec4899", "#a78bfa",
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 bg-ink-950/95 backdrop-blur-xl border border-flame-400/30 shadow-2xl">
        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-black" style={{ color: entry.color }}>
            Rs. {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Quick Action ─── */
const QuickAction = ({ icon, label, color, onClick, delay = 0 }) => {
  const colors = {
    royal:   "from-royal-500 to-royal-600 shadow-royal-500/30",
    flame:   "from-flame-500 to-flame-600 shadow-flame-500/30",
    success: "from-emerald-500 to-green-600 shadow-emerald-500/30",
    danger:  "from-red-500 to-rose-600 shadow-red-500/30",
    info:    "from-cyan-500 to-blue-500 shadow-cyan-500/30",
    purple:  "from-violet-500 to-purple-600 shadow-violet-500/30",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
        {icon}
      </div>
      <p className="relative text-[11px] font-black text-white/80 text-center leading-tight">
        {label}
      </p>
    </motion.button>
  );
};

/* ─── Main Dashboard ─── */
const Dashboard = () => {
  const navigate   = useNavigate();
  const { user }   = useSelector((state) => state.auth);
  const { selectedBranch } = useSelector((state) => state.branches);

  const isSubAdmin = user?.role === "sub-admin";

  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now,        setNow]        = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, [selectedBranch]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) return <Loader />;

  // Chart data
  const feeChartData = (stats?.last6MonthsFee || []).map((item) => ({
    name: `${MONTH_NAMES[item._id?.month]} ${String(item._id?.year).slice(2)}`,
    amount: item.total || 0,
  }));

  const courseChartData = (stats?.studentsPerCourse || []).map((item, i) => ({
    name: item.courseName,
    value: item.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const attendanceData = [
    { name: "Present", value: stats?.todayAttendance?.present || 0, fill: "#10b981" },
    { name: "Absent",  value: stats?.todayAttendance?.absent  || 0, fill: "#ef4444" },
  ];

  const attendanceRate = stats?.todayAttendance?.total
    ? Math.round((stats.todayAttendance.present / stats.todayAttendance.total) * 100)
    : 0;

  const sparkline = feeChartData.map((d) => d.amount).filter((v) => !isNaN(v));

  const hour     = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Active branch display
  const activeBranch = isSubAdmin ? user?.assignedBranch : selectedBranch;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-[1600px] mx-auto">

      {/* ═══════════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 60, 130, 0.85) 0%, rgba(25, 86, 169, 0.7) 50%, rgba(240, 110, 35, 0.4) 100%)",
        }}
      >
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-flame-500/40 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 30, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-royal-500/40 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em]">
                {greeting}
              </span>
              <span className="text-base">👋</span>
              {isSubAdmin && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-500/20 border border-royal-400/30">
                  <FiShield size={10} className="text-royal-300" />
                  <span className="text-[9px] font-black text-royal-200 uppercase tracking-widest">
                    Sub-Admin
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.05] mb-3">
              Welcome back,<br />
              <span className="text-gradient-flame">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
            </h1>

            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              {isSubAdmin
                ? `Managing ${activeBranch?.name || "your branch"}. Here's what's happening today.`
                : "Here's what's happening at your academy today. Track collections, manage students, and grow your institute."
              }
            </p>

            {activeBranch && (
              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15">
                <FiMapPin className="text-flame-300" size={12} />
                <span className="text-xs font-bold text-white">{activeBranch.name}</span>
                <span className="text-[9px] font-black text-white/90 bg-white/15 px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                  {activeBranch.code}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 text-white">
              <FiClock size={13} className="text-flame-300" />
              <span className="text-[13px] font-bold">
                {now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-[11px] font-semibold text-white/70">
                {now.toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>

            <Button
              variant="ghost"
              size="md"
              onClick={handleRefresh}
              disabled={refreshing}
              icon={<FiRefreshCw className={refreshing ? "animate-spin" : ""} />}
              className="!bg-white/10 !border-white/15 !text-white hover:!bg-white/15"
            >
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          STAT CARDS
          ═══════════════════════════════════════════════════ */}
      <div className={`grid gap-4 ${isSubAdmin ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
        <StatCard
          icon={<FiUsers />}
          label="Total Students"
          value={(stats?.totalStudents || 0).toLocaleString()}
          color="primary"
          sparkline={[12, 18, 15, 22, 28, 35]}
          onClick={() => navigate("/students")}
        />
        <StatCard
          icon={<FiBook />}
          label="Active Courses"
          value={stats?.totalCourses || 0}
          color="info"
          onClick={() => navigate("/courses")}
        />

        {/* Total Collected — Admin Only */}
        {!isSubAdmin && (
          <StatCard
            icon={<FiDollarSign />}
            label="Total Collected"
            value={`Rs. ${((stats?.totalFeeCollected || 0) / 1000).toFixed(1)}k`}
            color="success"
            sparkline={sparkline.length >= 2 ? sparkline : [10, 25, 18, 32, 28, 40]}
            onClick={() => navigate("/fees")}
          />
        )}

        <StatCard
          icon={<FiAlertCircle />}
          label="Pending Fees"
          value={stats?.pendingFeeCount || 0}
          color="flame"
          onClick={() => navigate("/pending-fees")}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          SECONDARY STATS
          ═══════════════════════════════════════════════════ */}
      <div className={`grid gap-4 ${isSubAdmin ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>

        {/* This Month — Admin Only */}
        {!isSubAdmin && (
          <Card variant="glass" padding="md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <FiTrendingUp className="text-emerald-400" size={15} />
                </div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em]">
                  This Month
                </p>
              </div>
              <Badge variant="success" size="sm" pulse>Live</Badge>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rs. {(stats?.thisMonthCollection || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-white/40 mt-1.5 font-semibold">
              {now.toLocaleString("default", { month: "long", year: "numeric" })}
            </p>
          </Card>
        )}

        {/* Today Present */}
        <Card variant="glass" padding="md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-royal-500/15 border border-royal-400/25 flex items-center justify-center">
                <FiCheckCircle className="text-royal-300" size={15} />
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em]">
                Today Present
              </p>
            </div>
            <Badge variant="success" size="sm">{attendanceRate}%</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.todayAttendance?.present || 0}
            <span className="text-base text-white/40 font-bold ml-2">
              / {stats?.todayAttendance?.total || 0}
            </span>
          </p>
          <div className="relative mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attendanceRate}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-flame-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </Card>

        {/* Today Absent */}
        <Card variant="glass" padding="md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-400/25 flex items-center justify-center">
                <FiXCircle className="text-red-400" size={15} />
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em]">
                Today Absent
              </p>
            </div>
            <FiActivity className="text-red-400" size={14} />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.todayAttendance?.absent || 0}
          </p>
          <p className="text-[11px] text-white/40 mt-1.5 font-semibold">
            {stats?.todayAttendance?.total > 0
              ? `${100 - attendanceRate}% absent rate`
              : "No attendance marked yet"}
          </p>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════
          QUICK ACTIONS
          ═══════════════════════════════════════════════════ */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
              <FiTarget className="text-flame-400" size={14} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Quick Actions</h3>
              <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                One-click shortcuts to common tasks
              </p>
            </div>
          </div>
          <Badge variant="flame" size="sm">⌘K</Badge>
        </div>

        {/* Admin Quick Actions */}
        {!isSubAdmin ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <QuickAction delay={0.0}  icon={<FiPlus />}         label="Add Student"  color="royal"   onClick={() => navigate("/students")} />
            <QuickAction delay={0.05} icon={<FiDollarSign />}   label="Collect Fee"  color="success" onClick={() => navigate("/fees")} />
            <QuickAction delay={0.1}  icon={<FiCalendar />}     label="Attendance"   color="flame"   onClick={() => navigate("/attendance")} />
            <QuickAction delay={0.15} icon={<FiBook />}         label="Add Course"   color="purple"  onClick={() => navigate("/courses")} />
            <QuickAction delay={0.2}  icon={<FiAlertCircle />}  label="Pending"      color="danger"  onClick={() => navigate("/pending-fees")} />
            <QuickAction delay={0.25} icon={<FiBarChart2 />}    label="Reports"      color="info"    onClick={() => navigate("/monthly-collection")} />
          </div>
        ) : (
          /* Sub-Admin Quick Actions — no reports, no monthly-collection */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAction delay={0.0}  icon={<FiPlus />}        label="Add Student"  color="royal"   onClick={() => navigate("/students")} />
            <QuickAction delay={0.05} icon={<FiDollarSign />}  label="Collect Fee"  color="success" onClick={() => navigate("/fees")} />
            <QuickAction delay={0.1}  icon={<FiCalendar />}    label="Attendance"   color="flame"   onClick={() => navigate("/attendance")} />
            <QuickAction delay={0.15} icon={<FiAlertCircle />} label="Pending"      color="danger"  onClick={() => navigate("/pending-fees")} />
          </div>
        )}
      </Card>

      {/* ═══════════════════════════════════════════════════
          CHARTS ROW 1 — Fee Trend + Attendance Donut
          ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Fee Chart — Admin Only */}
        {!isSubAdmin ? (
          <Card variant="glass" padding="md" className="lg:col-span-2">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <FiTrendingUp className="text-emerald-400" size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Fee Collection Trend</h3>
                  <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                    Last 6 months performance
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm" pulse>Live</Badge>
            </div>

            {feeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={feeChartData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="feeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="50%"  stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="feeStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#10b981" />
                      <stop offset="100%" stopColor="#F06E23" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F06E23", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area type="monotone" dataKey="amount" stroke="url(#feeStrokeGradient)" strokeWidth={3} fill="url(#feeAreaGradient)" activeDot={{ r: 6, fill: "#F06E23", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={<FiTrendingUp />} title="No data yet" description="Fee collection data will appear here once payments start coming in." />
            )}
          </Card>
        ) : (
          /* Sub-Admin: Show Course Distribution instead of fee chart */
          <Card variant="glass" padding="md" className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-400/25 flex items-center justify-center">
                <FiAward className="text-violet-400" size={15} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Students per Course</h3>
                <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                  Enrollment distribution in your branch
                </p>
              </div>
            </div>

            {courseChartData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={courseChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#0a1929"
                      strokeWidth={2}
                    >
                      {courseChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10, 25, 41, 0.95)",
                        border: "1px solid rgba(240, 110, 35, 0.3)",
                        borderRadius: "12px",
                      }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 w-full max-w-[200px]">
                  {courseChartData.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill, boxShadow: `0 0 8px ${c.fill}80` }} />
                        <span className="text-white/70 truncate font-semibold">{c.name}</span>
                      </div>
                      <span className="font-black text-white text-[13px] ml-2">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon={<FiBook />} title="No courses" description="Create your first course to see enrollment stats." action={<Button variant="primary" size="sm" onClick={() => navigate("/courses")}>Add Course</Button>} />
            )}
          </Card>
        )}

        {/* Attendance Donut */}
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-royal-500/15 border border-royal-400/25 flex items-center justify-center">
              <FiPieChart className="text-royal-300" size={15} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Today's Attendance</h3>
              <p className="text-[10px] text-white/40 font-semibold mt-0.5">Live breakdown</p>
            </div>
          </div>

          {stats?.todayAttendance?.total > 0 ? (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <defs>
                      <linearGradient id="presentGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="absentGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                    <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={4} dataKey="value" stroke="#0a1929" strokeWidth={3}>
                      <Cell fill="url(#presentGrad)" />
                      <Cell fill="url(#absentGrad)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="text-3xl font-black text-white tracking-tight"
                  >
                    {attendanceRate}%
                  </motion.p>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-black mt-0.5">Present</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Present</p>
                    <p className="text-sm font-black text-emerald-300">{stats.todayAttendance.present}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/8 border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Absent</p>
                    <p className="text-sm font-black text-red-300">{stats.todayAttendance.absent}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<FiCalendar />}
              title="No attendance yet"
              description="Mark today's attendance to see live insights."
              action={
                <Button variant="primary" size="sm" onClick={() => navigate("/attendance")}>
                  Mark Attendance
                </Button>
              }
            />
          )}
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════
          CHARTS ROW 2 — Admin Only (Course Dist + Transactions)
          ═══════════════════════════════════════════════════ */}
      {!isSubAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Course Distribution */}
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-400/25 flex items-center justify-center">
                <FiAward className="text-violet-400" size={15} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Students per Course</h3>
                <p className="text-[10px] text-white/40 font-semibold mt-0.5">Enrollment distribution</p>
              </div>
            </div>

            {courseChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={courseChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" stroke="#0a1929" strokeWidth={2}>
                      {courseChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "rgba(10, 25, 41, 0.95)", border: "1px solid rgba(240, 110, 35, 0.3)", borderRadius: "12px", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-3 max-h-32 overflow-y-auto pr-1 scrollbar-hide">
                  {courseChartData.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between text-xs px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill, boxShadow: `0 0 8px ${c.fill}80` }} />
                        <span className="text-white/70 truncate font-semibold">{c.name}</span>
                      </div>
                      <span className="font-black text-white text-[13px]">{c.value}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState icon={<FiBook />} title="No courses" description="Create your first course to see enrollment stats." action={<Button variant="primary" size="sm" onClick={() => navigate("/courses")}>Add Course</Button>} />
            )}
          </Card>

          {/* Recent Transactions */}
          <Card variant="glass" padding="md" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <FiActivity className="text-emerald-400" size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Recent Transactions</h3>
                  <p className="text-[10px] text-white/40 font-semibold mt-0.5">Latest fee collections</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconRight={<FiArrowRight />} onClick={() => navigate("/fees")}>
                View All
              </Button>
            </div>

            {stats?.recentTransactions?.length > 0 ? (
              <div className="space-y-2">
                {stats.recentTransactions.map((tx, idx) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/30 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={tx.student?.name} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{tx.student?.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-white/50 font-semibold truncate max-w-[120px]">{tx.course?.courseName}</span>
                          <Badge variant="flame" size="sm" className="!px-1.5 !py-0">{tx.feeType}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-black text-emerald-400">Rs. {tx.amount?.toLocaleString()}</p>
                      <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<FiDollarSign />} title="No transactions yet" description="Once fees are collected, they'll appear here." />
            )}
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SUB-ADMIN: Recent Transactions (simplified)
          ═══════════════════════════════════════════════════ */}
      {isSubAdmin && stats?.recentTransactions?.length > 0 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                <FiActivity className="text-emerald-400" size={15} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Recent Fee Collections</h3>
                <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                  Latest payments in your branch
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconRight={<FiArrowRight />} onClick={() => navigate("/fees")}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {stats.recentTransactions.map((tx, idx) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={tx.student?.name} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{tx.student?.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-white/50 font-semibold truncate max-w-[120px]">{tx.course?.courseName}</span>
                      <Badge variant="flame" size="sm" className="!px-1.5 !py-0">{tx.feeType}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-black text-emerald-400">Rs. {tx.amount?.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════
          BOTTOM CTAs — Admin Only
          ═══════════════════════════════════════════════════ */}
      {!isSubAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reports CTA */}
          <Card variant="gradient" padding="lg" hover className="group">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-royal-500/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center mb-4 shadow-lg shadow-royal-500/40 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                <FiBarChart2 className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Monthly Reports</h3>
              <p className="text-sm text-white/60 mb-5 leading-relaxed">
                Detailed insights into your collection performance with downloadable PDF reports.
              </p>
              <Button variant="secondary" size="md" iconRight={<FiArrowRight />} onClick={() => navigate("/monthly-collection")}>
                View Reports
              </Button>
            </div>
          </Card>

          {/* Pending CTA */}
          <Card variant="gradient" padding="lg" hover className="group">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-flame-500/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center mb-4 shadow-lg shadow-flame-500/40 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                <FiAlertCircle className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Pending Collections</h3>
              <p className="text-sm text-white/60 mb-5 leading-relaxed">
                <span className="font-black text-flame-300">{stats?.pendingFeeCount || 0} students</span>{" "}
                have pending fees. Take action now to maintain healthy cash flow.
              </p>
              <Button variant="primary" size="md" iconRight={<FiArrowRight />} onClick={() => navigate("/pending-fees")}>
                View Pending
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          SUB-ADMIN: Pending CTA only
          ═══════════════════════════════════════════════════ */}
      {isSubAdmin && (
        <Card variant="gradient" padding="lg" hover className="group">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-flame-500/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                <FiAlertCircle className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Pending Collections</h3>
                <p className="text-sm text-white/60 mt-1">
                  <span className="font-black text-flame-300">{stats?.pendingFeeCount || 0} students</span>{" "}
                  have pending fees in your branch.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              iconRight={<FiArrowRight />}
              onClick={() => navigate("/pending-fees")}
              className="flex-shrink-0"
            >
              View Pending
            </Button>
          </div>
        </Card>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-[11px] text-white/30 font-semibold">
          Last updated: {now.toLocaleString("en-PK")} •{" "}
          <span className="text-flame-400 font-black">
            {activeBranch?.name || "All Branches"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;