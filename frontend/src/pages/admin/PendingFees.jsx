import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPendingFees } from "../../redux/slices/feeSlice.js";
import FeeModal from "../../components/modals/FeeModal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Card, Button, Badge, EmptyState, Avatar, PageHeader } from "../../components/ui";
import {
  FiAlertCircle, FiRefreshCw, FiPhone, FiUser,
  FiBook, FiCheckCircle, FiClock, FiCalendar,
} from "react-icons/fi";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const selectClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm [color-scheme:dark]";

const PendingFees = () => {
  const dispatch = useDispatch();
  const { pendingFees, pendingCount, pendingTotalDue, loading } = useSelector((s) => s.fees);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    now.toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear().toString());
  const [feeModalOpen, setFeeModalOpen]   = useState(false);
  const [prefillData,  setPrefillData]    = useState(null);

  useEffect(() => {
    dispatch(fetchPendingFees({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const monthIndex       = MONTHS.indexOf(selectedMonth);
  const selectedDate     = new Date(parseInt(selectedYear), monthIndex, 1);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const isFutureMonth    = selectedDate > currentMonthStart;
  const isCurrentMonth   = selectedDate.getTime() === currentMonthStart.getTime();

  const handleCollectFee = (row, item) => {
    setPrefillData({
      student: row.studentId,
      course:  row.courseId,
      feeType: item.feeType,
      amount:  item.amount,
      month:   item.month || "",
      year:    item.year?.toString() || selectedYear,
    });
    setFeeModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <PageHeader
        title="Pending Fees"
        subtitle={`${selectedMonth} ${selectedYear} • ${isFutureMonth ? "Future month" : `${pendingCount} pending records`}`}
        icon={<FiAlertCircle />}
        action={
          <Button
            variant="ghost"
            size="md"
            icon={<FiRefreshCw />}
            onClick={() => dispatch(fetchPendingFees({ month: selectedMonth, year: selectedYear }))}
          >
            Refresh
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
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
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
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setSelectedMonth(now.toLocaleString("default", { month: "long" }));
              setSelectedYear(now.getFullYear().toString());
            }}
          >
            Current Month
          </Button>
        </div>
      </Card>

      {/* States */}
      {isFutureMonth ? (
        <Card variant="glass" padding="lg">
          <EmptyState
            icon={<FiClock />}
            title="No Fees Available Yet"
            description={`${selectedMonth} ${selectedYear} is a future month. Fee records will appear once the month arrives.`}
          />
        </Card>
      ) : loading ? (
        <Loader />
      ) : pendingFees.length === 0 ? (
        <Card variant="glass" padding="lg">
          <EmptyState
            icon={<FiCheckCircle />}
            title="All Clear! 🎉"
            description={`No pending fees for ${selectedMonth} ${selectedYear}. All students have paid their dues.`}
          />
        </Card>
      ) : (
        <>
          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-400/30 backdrop-blur-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/40">
              <FiAlertCircle className="text-white" size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-red-200">
                {pendingCount} Pending Fee Records for {selectedMonth} {selectedYear}
              </p>
              <p className="text-xs text-white/60 mt-0.5 font-semibold">
                {isCurrentMonth ? "Current month fees are due." : "These fees are overdue — take action immediately."}
              </p>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-xs text-white/50 font-black uppercase tracking-widest">Total Due</p>
              <p className="text-lg font-black text-red-300">
                Rs. {(pendingTotalDue || 0).toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="glass" padding="md">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.18em] mb-2">
                Pending Records
              </p>
              <p className="text-4xl font-black text-red-300 tracking-tight">{pendingCount}</p>
            </Card>
            <Card variant="glass" padding="md">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.18em] mb-2">
                Total Amount Due
              </p>
              <p className="text-3xl sm:text-4xl font-black text-flame-300 tracking-tight">
                Rs. {(pendingTotalDue || 0).toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Pending Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {pendingFees.map((row, idx) => (
                <motion.div
                  key={row._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative overflow-hidden rounded-2xl p-5 bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-red-400/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500"
                >
                  {/* Accent top line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-700 pointer-events-none" />

                  <div className="relative">
                    {/* Student header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar name={row.name} size="md" />
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-ink-950 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{row.name}</p>
                          <p className="text-[10px] text-white/50 font-semibold mt-0.5">
                            {row.fatherName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-black">Total Due</p>
                        <p className="text-base font-black text-red-300">
                          Rs. {row.totalPending?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-royal-300 font-semibold">
                        <FiBook size={11} />
                        {row.courseName}
                      </div>
                      <a
                        href={`tel:${row.phone}`}
                        className="flex items-center gap-1.5 text-xs text-white/60 font-semibold hover:text-flame-300 transition-colors"
                      >
                        <FiPhone size={11} />
                        {row.phone}
                      </a>
                    </div>

                    {/* Pending items */}
                    <div className="space-y-2">
                      {row.pendingItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 + i * 0.03 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-red-400/25 hover:bg-white/[0.05] transition-all"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{item.label}</p>
                            <p className="text-[10px] text-white/50 capitalize font-semibold uppercase tracking-widest mt-0.5">
                              {item.feeType} fee
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <p className="text-sm font-black text-flame-300 whitespace-nowrap">
                              Rs. {item.amount?.toLocaleString()}
                            </p>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleCollectFee(row, item)}
                            >
                              Collect
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <FeeModal
        isOpen={feeModalOpen}
        onClose={() => {
          setFeeModalOpen(false);
          setPrefillData(null);
          dispatch(fetchPendingFees({ month: selectedMonth, year: selectedYear }));
        }}
        prefillData={prefillData}
      />
    </div>
  );
};

export default PendingFees;