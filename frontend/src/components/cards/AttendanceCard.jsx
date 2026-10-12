import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiTrendingUp } from "react-icons/fi";
import { Card, Badge } from "../ui";

const AttendanceCard = ({ data }) => {
  if (!data) return null;

  const { totalPresent = 0, totalAbsent = 0, attendancePercentage = 0 } = data;
  const total = totalPresent + totalAbsent;
  const percentage = parseFloat(attendancePercentage) || 0;

  const status =
    percentage >= 75
      ? { stroke: "#10b981", grad: ["#10b981", "#059669"], text: "text-emerald-300", label: "EXCELLENT", variant: "success" }
      : percentage >= 50
      ? { stroke: "#F06E23", grad: ["#F06E23", "#D45A15"], text: "text-flame-300", label: "AVERAGE", variant: "flame" }
      : { stroke: "#ef4444", grad: ["#ef4444", "#dc2626"], text: "text-red-300", label: "POOR", variant: "danger" };

  const circumference = 2 * Math.PI * 42;
  const strokeOffset = circumference * (1 - percentage / 100);

  return (
    <Card variant="glass" padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
            <FiTrendingUp className="text-flame-400" size={15} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Attendance Summary</h3>
            <p className="text-[10px] text-white/40 font-semibold mt-0.5">Overall performance</p>
          </div>
        </div>
        <Badge variant={status.variant} size="sm" pulse>
          {status.label}
        </Badge>
      </div>

      {/* Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-500/30 to-flame-500/30 blur-2xl opacity-60" />
          <svg className="relative w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`attCircle-${status.variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={status.grad[0]} />
                <stop offset="100%" stopColor={status.grad[1]} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke={`url(#attCircle-${status.variant})`}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: `drop-shadow(0 0 8px ${status.stroke}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-3xl font-black text-white tracking-tight"
            >
              {percentage}%
            </motion.span>
            <span className="text-[9px] text-white/50 uppercase tracking-widest font-black mt-0.5">
              Rate
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <p className="text-[9px] text-white/45 uppercase tracking-widest mb-1 font-black">Total</p>
          <p className="text-xl font-black text-white">{total}</p>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <FiCheckCircle className="text-emerald-400 text-sm mb-1" />
          <p className="text-[9px] text-emerald-300/70 uppercase tracking-widest mb-0.5 font-black">Present</p>
          <p className="text-xl font-black text-emerald-300">{totalPresent}</p>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-red-500/8 border border-red-500/20">
          <FiXCircle className="text-red-400 text-sm mb-1" />
          <p className="text-[9px] text-red-300/70 uppercase tracking-widest mb-0.5 font-black">Absent</p>
          <p className="text-xl font-black text-red-300">{totalAbsent}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] text-white/60 mb-1.5 font-bold uppercase tracking-widest">
          <span>Progress</span>
          <span className={status.text}>{percentage}%</span>
        </div>
        <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${status.grad[0]}, ${status.grad[1]})`,
              boxShadow: `0 0 10px ${status.stroke}60`,
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCard;