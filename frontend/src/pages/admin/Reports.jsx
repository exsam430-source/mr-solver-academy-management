import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import API from "../../api/axios.js";

import FeeChart from "../../components/charts/FeeChart.jsx";
import StudentChart from "../../components/charts/StudentChart.jsx";
import AttendanceChart from "../../components/charts/AttendanceChart.jsx";
import Loader from "../../components/common/Loader.jsx";

import {
  FiBarChart2, FiDollarSign, FiUsers, FiActivity, FiTrendingUp,
  FiCalendar, FiBook, FiArrowRight, FiDownload, FiPieChart,
} from "react-icons/fi";

import { Button, PageHeader, Card, Badge, EmptyState } from "../../components/ui";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedBranch } = useSelector((state) => state.branches);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/dashboard/stats");
      setStats(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [selectedBranch]);

  if (loading) return <Loader />;

  // Derived metrics
  const totalRevenue = stats?.totalFeeCollected || 0;
  const totalStudents = stats?.totalStudents || 0;
  const totalCourses = stats?.totalCourses || 0;
  const pendingCount = stats?.pendingFeeCount || 0;
  const thisMonth = stats?.thisMonthCollection || 0;

  // Average revenue per student
  const avgPerStudent = totalStudents > 0 ? Math.round(totalRevenue / totalStudents) : 0;
  // Attendance rate
  const attendanceRate = stats?.todayAttendance?.total
    ? Math.round((stats.todayAttendance.present / stats.todayAttendance.total) * 100)
    : 0;

  const kpis = [
    {
      label: "Total Revenue",
      value: `Rs. ${(totalRevenue / 1000).toFixed(1)}k`,
      raw: totalRevenue,
      icon: <FiDollarSign />,
      color: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/25",
      border: "border-emerald-400/25",
      text: "text-emerald-300",
      sub: "All-time collections",
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: <FiUsers />,
      color: "from-royal-500 to-royal-600",
      glow: "shadow-royal-500/25",
      border: "border-royal-400/25",
      text: "text-royal-300",
      sub: "Across all branches",
    },
    {
      label: "Avg Revenue/Student",
      value: `Rs. ${(avgPerStudent / 1000).toFixed(1)}k`,
      raw: avgPerStudent,
      icon: <FiTrendingUp />,
      color: "from-flame-500 to-flame-600",
      glow: "shadow-flame-500/25",
      border: "border-flame-400/25",
      text: "text-flame-300",
      sub: "Per enrolled student",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: <FiActivity />,
      color: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/25",
      border: "border-violet-400/25",
      text: "text-violet-300",
      sub: "Today's average",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        icon={<FiBarChart2 />}
        title="Reports & Analytics"
        subtitle="Deep insights into your academy's performance"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<FiDownload />}
            onClick={() => navigate("/monthly-collection")}
          >
            Detailed Report
          </Button>
        }
      />

      {/* KPI Cards — Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-2xl p-5 bg-ink-900/60 backdrop-blur-xl border ${k.border} hover:shadow-2xl hover:${k.glow} transition-shadow duration-500`}
          >
            <div className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${k.color} opacity-15 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-700`} />
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.15em] mb-2">
                  {k.label}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${k.text}`}>
                  {k.value}
                </h3>
                <p className="text-[10px] text-white/40 font-semibold mt-2">
                  {k.sub}
                </p>
              </div>

              <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${k.color} flex items-center justify-center text-white text-xl shadow-lg ${k.glow} flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">{k.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 — Fee Trend (full width) */}
      <Card variant="glass" padding="md">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
              <FiTrendingUp className="text-emerald-400" size={15} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Revenue Trend</h3>
              <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                Monthly fee collection performance
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" pulse>Live Data</Badge>
        </div>

        <FeeChart data={stats?.last6MonthsFee || []} />
      </Card>

      {/* Charts Row 2 — Student Distribution + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student Distribution Pie */}
        <Card variant="glass" padding="md" className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-royal-500/15 border border-royal-400/25 flex items-center justify-center">
              <FiPieChart className="text-royal-300" size={15} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Student Distribution</h3>
              <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                Enrollment across courses
              </p>
            </div>
          </div>

          <StudentChart data={stats?.studentsPerCourse || []} />
        </Card>

        {/* Side Stats */}
        <div className="space-y-4">
          <Card variant="gradient" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/30">
                <FiDollarSign className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.15em]">This Month</p>
                <p className="text-2xl font-black text-flame-300 tracking-tight">
                  Rs. {(thisMonth / 1000).toFixed(1)}k
                </p>
              </div>
            </div>
            <p className="text-[11px] text-white/50 font-semibold">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })} collections so far.
            </p>
          </Card>

          <Card variant="gradient" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <FiActivity className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.15em]">Pending Fees</p>
                <p className="text-2xl font-black text-red-300 tracking-tight">{pendingCount}</p>
              </div>
            </div>
            <p className="text-[11px] text-white/50 font-semibold mb-3">
              Students with overdue payments need follow-up.
            </p>
            <Button variant="danger" size="sm" iconRight={<FiArrowRight />} onClick={() => navigate("/pending-fees")} fullWidth>
              View Pending
            </Button>
          </Card>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard
          icon={<FiBook />}
          label="Active Courses"
          value={totalCourses}
          description="Currently offered programs"
          color="from-royal-500 to-royal-600"
          glow="shadow-royal-500/25"
          textColor="text-royal-300"
          onClick={() => navigate("/courses")}
        />
        <InsightCard
          icon={<FiCalendar />}
          label="Today's Attendance"
          value={`${stats?.todayAttendance?.present || 0} / ${stats?.todayAttendance?.total || 0}`}
          description="Present out of total students"
          color="from-emerald-500 to-green-600"
          glow="shadow-emerald-500/25"
          textColor="text-emerald-300"
          onClick={() => navigate("/attendance")}
        />
        <InsightCard
          icon={<FiBarChart2 />}
          label="Monthly Reports"
          value="View"
          description="Detailed PDF & breakdown"
          color="from-flame-500 to-flame-600"
          glow="shadow-flame-500/25"
          textColor="text-flame-300"
          onClick={() => navigate("/monthly-collection")}
        />
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-4"
      >
        <p className="text-[11px] text-white/30 font-semibold">
          Reports updated in real-time •{" "}
          <span className="text-flame-400 font-black">
            {selectedBranch?.name || "All Branches"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   INSIGHT CARD — Small reusable component
   ───────────────────────────────────────────────────────────── */
const InsightCard = ({ icon, label, value, description, color, glow, textColor, onClick }) => (
  <motion.button
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl p-5 text-left bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] hover:shadow-2xl hover:${glow} transition-all duration-500 cursor-pointer`}
  >
    <div className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${color} opacity-15 rounded-full blur-3xl group-hover:opacity-25 transition-opacity duration-700`} />
    <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg shadow-lg ${glow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
          {icon}
        </div>
        <FiArrowRight className={`${textColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
      </div>

      <p className="text-[10px] font-black text-white/45 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className={`text-xl font-black tracking-tight ${textColor} mb-1`}>{value}</p>
      <p className="text-[11px] text-white/50 font-semibold">{description}</p>
    </div>
  </motion.button>
);

export default Reports;