import { motion } from "framer-motion";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Avatar, Badge, EmptyState, Card } from "../ui";

const AttendanceTable = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <Card variant="glass" padding="none">
        <EmptyState
          icon={<FiCalendar />}
          title="No Attendance Records"
          description="No records found for the selected filters. Try adjusting your search."
        />
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-royal-500/10 via-transparent to-flame-500/10 border-b border-white/[0.06]">
              {["Student", "Course", "Date", "Status", "Marked By"].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => (
              <motion.tr
                key={record._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={record.student?.name} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-white">{record.student?.name}</p>
                      <p className="text-[10px] text-white/40 font-semibold">{record.student?.fatherName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="primary" size="md">{record.course?.courseName}</Badge>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm text-white/80 font-semibold">
                    {new Date(record.date).toLocaleDateString("en-PK", {
                      weekday: "short", month: "short", day: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                    {new Date(record.date).getFullYear()}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {record.status === "present" ? (
                    <Badge variant="success" size="md" icon={<FiCheckCircle size={11} />}>
                      Present
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="md" icon={<FiXCircle size={11} />}>
                      Absent
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white/70 font-semibold">{record.markedBy?.name || "—"}</p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AttendanceTable;