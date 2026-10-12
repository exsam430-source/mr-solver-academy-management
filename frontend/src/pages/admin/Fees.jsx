import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchFees, fetchFeeSummary } from "../../redux/slices/feeSlice.js";
import { fetchCourses } from "../../redux/slices/courseSlice.js";
import FeeTable from "../../components/tables/FeeTable.jsx";
import FeeModal from "../../components/modals/FeeModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, PageHeader } from "../../components/ui";
import { FiPlus, FiFilter, FiDollarSign, FiRefreshCw, FiX, FiTrendingUp, FiShield } from "react-icons/fi";

const FEE_TYPES = [
  { value: "",             label: "All Types" },
  { value: "registration", label: "Registration" },
  { value: "advance",      label: "Advance" },
  { value: "monthly",      label: "Monthly" },
  { value: "exam",         label: "Exam" },
  { value: "penalty",      label: "Penalty" },
  { value: "package",      label: "Package" },
];

const TYPE_CONFIG = {
  registration: { variant: "info",    label: "Registration" },
  advance:      { variant: "primary", label: "Advance" },
  monthly:      { variant: "success", label: "Monthly" },
  exam:         { variant: "flame",   label: "Exam" },
  penalty:      { variant: "danger",  label: "Penalty" },
  package:      { variant: "neutral", label: "Package" },
};

const selectClass =
  "bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm [color-scheme:dark]";

const Fees = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { fees, loading, count, totalAmount, summary } = useSelector((s) => s.fees);
  const { courses } = useSelector((s) => s.courses);

  const isSubAdmin = user?.role === "sub-admin";

  const [addOpen,   setAddOpen]   = useState(false);
  const [feeType,   setFeeType]   = useState("");
  const [course,    setCourse]    = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState("");

  useEffect(() => {
    dispatch(fetchFees());
    // Only fetch summary for admin
    if (!isSubAdmin) {
      dispatch(fetchFeeSummary());
    }
    dispatch(fetchCourses());
  }, [dispatch, isSubAdmin]);

  const handleFilter = () => {
    const params = {};
    if (feeType)   params.feeType   = feeType;
    if (course)    params.course    = course;
    if (startDate) params.startDate = startDate;
    if (endDate)   params.endDate   = endDate;
    dispatch(fetchFees(params));
  };

  const handleReset = () => {
    setFeeType(""); setCourse(""); setStartDate(""); setEndDate("");
    dispatch(fetchFees());
  };

  const summaryByType = summary?.summaryByType || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">

      {/* ═══════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════ */}
      <PageHeader
        title="Fee Management"
        subtitle={
          isSubAdmin
            ? `${count} records in your branch`
            : `${count} records • Total Rs. ${(totalAmount || 0).toLocaleString()}`
        }
        icon={<FiDollarSign />}
        action={
          <Button
            variant="success"
            size="md"
            icon={<FiPlus />}
            onClick={() => setAddOpen(true)}
          >
            Collect Fee
          </Button>
        }
      />

      {/* ═══════════════════════════════════════════
          SUB-ADMIN NOTICE BANNER
          ═══════════════════════════════════════════ */}
      {isSubAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-royal-500/10 border border-royal-400/30 backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-royal-500/40">
            <FiShield className="text-white" size={16} />
          </div>
          <div>
            <p className="text-sm font-black text-royal-200">
              Branch Fee Management
            </p>
            <p className="text-xs text-white/50 mt-0.5 font-semibold">
              You can collect fees and view pending records for your assigned branch only.
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <Badge variant="primary" size="sm" pulse>
              {user?.assignedBranch?.name || "Branch"}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          SUMMARY CARDS — Admin Only
          ═══════════════════════════════════════════ */}
      {!isSubAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(TYPE_CONFIG).map(([type, cfg], idx) => {
            const found = summaryByType.find((s) => s._id === type);
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -2 }}
                className="group relative overflow-hidden rounded-2xl p-4 bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                <p className="relative text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 capitalize">
                  {cfg.label}
                </p>
                <p className="relative text-lg font-black text-white leading-none">
                  Rs. {(found?.totalAmount || 0).toLocaleString()}
                </p>
                <p className="relative text-[10px] text-white/40 font-semibold mt-1">
                  {found?.count || 0} records
                </p>
                <Badge variant={cfg.variant} size="sm" className="mt-2">
                  {cfg.variant === "success" ? "✓" : "→"}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════
          ADMIN TOTAL STATS ROW
          ═══════════════════════════════════════════ */}
      {!isSubAdmin && totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                <FiDollarSign className="text-emerald-400" size={15} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.15em]">
                  Total Collected
                </p>
                <p className="text-2xl font-black text-emerald-300 tracking-tight">
                  Rs. {(totalAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
                <FiTrendingUp className="text-flame-400" size={15} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.15em]">
                  Total Transactions
                </p>
                <p className="text-2xl font-black text-flame-300 tracking-tight">
                  {count} Records
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          FILTERS
          ═══════════════════════════════════════════ */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-flame-400" size={14} />
          <p className="text-xs font-black text-white/80 uppercase tracking-widest">
            Filter Records
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            className={selectClass}
          >
            {FEE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={selectClass}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={selectClass}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={selectClass}
          />

          <Button variant="primary" size="md" icon={<FiFilter />} onClick={handleFilter}>
            Filter
          </Button>
          <Button variant="ghost" size="md" icon={<FiX />} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════
          FEE TABLE
          ═══════════════════════════════════════════ */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">
              {count} Transactions
            </p>
            {isSubAdmin && (
              <Badge variant="primary" size="sm">
                {user?.assignedBranch?.name}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<FiRefreshCw />}
            onClick={() => dispatch(fetchFees())}
          >
            Refresh
          </Button>
        </div>
        {loading ? <Loader /> : <FeeTable fees={fees} />}
      </Card>

      <FeeModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default Fees;