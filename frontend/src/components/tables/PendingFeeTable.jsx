import { motion } from "framer-motion";
import { FiAlertCircle, FiPhone, FiCheckCircle } from "react-icons/fi";
import { Card, Badge, Avatar, EmptyState } from "../ui";

const PendingFeeTable = ({ pendingFees }) => {
  if (!pendingFees || pendingFees.length === 0) {
    return (
      <Card variant="glass" padding="none">
        <EmptyState
          icon={<FiCheckCircle />}
          title="All Fees Cleared! 🎉"
          description="No pending fees for this period. Excellent work!"
        />
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="none" className="overflow-hidden">
      {/* Red accent bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent z-10" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-red-500/10 via-transparent to-flame-500/10 border-b border-white/[0.06]">
              {["Student", "Phone", "Course", "Pending Month", "Amount Due", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingFees.map((item, idx) => (
              <motion.tr
                key={item._id || idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="border-t border-white/[0.04] hover:bg-red-500/[0.04] transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={item.name} size="sm" />
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 ring-2 ring-ink-950 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/40 font-semibold">{item.fatherName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <a
                    href={`tel:${item.phone}`}
                    className="inline-flex items-center gap-2 text-white/80 hover:text-flame-300 transition-colors group/phone"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover/phone:bg-flame-500/15 group-hover/phone:border-flame-400/30 transition-all">
                      <FiPhone size={11} />
                    </div>
                    <span className="text-sm font-semibold">{item.phone}</span>
                  </a>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="primary" size="md">{item.course?.courseName}</Badge>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-flame-300 font-bold whitespace-nowrap">{item.pendingMonth}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-400/30">
                    <p className="text-sm font-black text-red-300 whitespace-nowrap">
                      Rs. {item.pendingAmount?.toLocaleString()}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="danger" size="md" pulse icon={<FiAlertCircle size={10} />}>
                    Pending
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PendingFeeTable;