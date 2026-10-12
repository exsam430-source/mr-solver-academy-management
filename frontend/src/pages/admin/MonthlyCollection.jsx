import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchMonthlyReport } from "../../redux/slices/feeSlice.js";
import { generateMonthlyReport } from "../../utils/pdfGenerator.js";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, EmptyState, PageHeader } from "../../components/ui";
import {
  FiDownload, FiDollarSign, FiCalendar, FiFileText,
  FiTrendingUp, FiBarChart2,
} from "react-icons/fi";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TYPE_COLORS = {
  registration: "bg-cyan-500/10 border-cyan-400/25 text-cyan-300",
  advance:      "bg-royal-500/10 border-royal-400/25 text-royal-300",
  monthly:      "bg-emerald-500/10 border-emerald-400/25 text-emerald-300",
  exam:         "bg-flame-500/10 border-flame-400/25 text-flame-300",
  penalty:      "bg-red-500/10 border-red-400/25 text-red-300",
  package:      "bg-violet-500/10 border-violet-400/25 text-violet-300",
};

const selectClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm [color-scheme:dark]";

const MonthlyCollection = () => {
  const dispatch = useDispatch();
  const { monthlyReport, loading } = useSelector((s) => s.fees);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    now.toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());

  useEffect(() => {
    dispatch(fetchMonthlyReport({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Monthly Collection"
        subtitle="Detailed fee collection report with breakdown by type and course"
        icon={<FiBarChart2 />}
        action={
          <Button
            variant="primary"
            size="md"
            icon={<FiDownload />}
            disabled={!monthlyReport || loading}
            onClick={() => monthlyReport && generateMonthlyReport(monthlyReport)}
          >
            Download PDF
          </Button>
        }
      />

      {/* Filter */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <FiCalendar className="text-flame-400" size={14} />
          <p className="text-xs font-black text-white/80 uppercase tracking-widest">
            Select Period
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.15em] mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={selectClass}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.15em] mb-2">
              Year
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              min="2020"
              max="2030"
              className={selectClass}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <Loader />
      ) : monthlyReport ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <FiDollarSign />,
                label: "Total Collection",
                value: `Rs. ${monthlyReport.totalCollection?.toLocaleString()}`,
                color: "success",
                glow: "emerald",
              },
              {
                icon: <FiFileText />,
                label: "Total Records",
                value: monthlyReport.totalRecords,
                color: "primary",
                glow: "royal",
              },
              {
                icon: <FiCalendar />,
                label: "Period",
                value: `${monthlyReport.month} ${monthlyReport.year}`,
                color: "flame",
                glow: "flame",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl p-5 bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${card.glow}-500/20 rounded-full blur-3xl`} />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg
                    ${card.color === "success" ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30" :
                      card.color === "primary" ? "bg-gradient-to-br from-royal-500 to-royal-600 shadow-royal-500/30" :
                      "bg-gradient-to-br from-flame-500 to-flame-600 shadow-flame-500/30"}`}
                  >
                    {card.icon}
                  </div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em]">
                    {card.label}
                  </p>
                </div>
                <p className={`relative text-2xl sm:text-3xl font-black tracking-tight
                  ${card.color === "success" ? "text-emerald-300" :
                    card.color === "primary" ? "text-royal-300" : "text-flame-300"}`}
                >
                  {card.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* By Fee Type */}
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
                <FiTrendingUp className="text-flame-400" size={14} />
              </div>
              <h3 className="text-sm font-black text-white">Collection by Fee Type</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(monthlyReport.byType || {}).map(([type, info]) => (
                <motion.div
                  key={type}
                  whileHover={{ y: -2 }}
                  className={`rounded-xl p-3 border backdrop-blur-sm ${TYPE_COLORS[type] || "bg-white/[0.04] border-white/[0.08] text-white/80"}`}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80 capitalize mb-1.5">
                    {type}
                  </p>
                  <p className="text-base font-black leading-tight">
                    Rs. {info.total?.toLocaleString()}
                  </p>
                  <p className="text-[10px] opacity-60 mt-1 font-semibold">
                    {info.count} records
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* By Course */}
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-royal-500/15 border border-royal-400/25 flex items-center justify-center">
                <FiBarChart2 className="text-royal-300" size={14} />
              </div>
              <h3 className="text-sm font-black text-white">Collection by Course</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(monthlyReport.byCourse || {}).map(([course, info], i) => {
                const total = monthlyReport.totalCollection || 1;
                const pct = Math.round((info.total / total) * 100);
                return (
                  <motion.div
                    key={course}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/30 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-bold text-white truncate">{course}</p>
                        <p className="text-sm font-black text-emerald-300 ml-2 flex-shrink-0">
                          Rs. {info.total?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.06 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-flame-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-white/40 font-bold w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">{info.count} records</Badge>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* All Transactions */}
          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <FiFileText className="text-emerald-400" size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">All Transactions</h3>
                  <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                    {monthlyReport.fees?.length || 0} records
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm" pulse>
                {selectedMonth} {selectedYear}
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-royal-500/10 via-transparent to-flame-500/10 border-b border-white/[0.06]">
                    {["Invoice", "Date", "Student", "Course", "Type", "Amount"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-black text-white/50 uppercase tracking-[0.15em] py-3 px-4 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.fees?.map((fee, i) => (
                    <motion.tr
                      key={fee._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-mono font-bold text-royal-300 bg-royal-500/10 border border-royal-400/25 px-2 py-0.5 rounded-md">
                          {fee.invoiceNumber || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-white/60 font-semibold whitespace-nowrap">
                        {new Date(fee.date).toLocaleDateString("en-PK", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-white">
                        {fee.student?.name}
                      </td>
                      <td className="py-3 px-4 text-xs text-white/60 font-semibold">
                        {fee.course?.courseName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border capitalize ${TYPE_COLORS[fee.feeType] || "bg-white/[0.04] border-white/[0.08] text-white/60"}`}
                        >
                          {fee.feeType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-emerald-300 whitespace-nowrap">
                          Rs. {fee.amount?.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card variant="glass" padding="lg">
          <EmptyState
            icon={<FiBarChart2 />}
            title="No Data Available"
            description="No fee records found for the selected month and year."
          />
        </Card>
      )}
    </div>
  );
};

export default MonthlyCollection;