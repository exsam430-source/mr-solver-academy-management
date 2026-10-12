import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { deleteFee } from "../../redux/slices/feeSlice.js";
import { generateFeeSlip } from "../../utils/pdfGenerator.js";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { FiTrash2, FiDollarSign, FiDownload } from "react-icons/fi";
import { Card, Badge, Avatar, EmptyState } from "../ui";

const FEE_VARIANT = {
  registration: "info",
  advance:      "primary",
  monthly:      "success",
  exam:         "flame",
  penalty:      "danger",
  package:      "neutral",
};

const FeeTable = ({ fees }) => {
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteFee(selectedFee._id));
    setDeleteLoading(false);
    setConfirmOpen(false);
    setSelectedFee(null);
  };

  if (!fees || fees.length === 0) {
    return (
      <Card variant="glass" padding="none">
        <EmptyState
          icon={<FiDollarSign />}
          title="No Fee Records Found"
          description="Fee transactions will appear here once payments are collected."
        />
      </Card>
    );
  }

  return (
    <>
      <Card variant="glass" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-royal-500/10 via-transparent to-flame-500/10 border-b border-white/[0.06]">
                {["Invoice", "Student", "Course", "Fee Type", "Month", "Amount", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, idx) => (
                <motion.tr
                  key={fee._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-5 py-4">
                    <p className="text-[11px] font-mono font-bold text-royal-300 bg-royal-500/10 border border-royal-400/25 px-2 py-1 rounded-lg inline-block">
                      {fee.invoiceNumber || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={fee.student?.name} size="xs" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{fee.student?.name}</p>
                        <p className="text-[10px] text-white/40 font-mono">{fee.student?.admissionNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white/80 font-semibold">{fee.course?.courseName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={FEE_VARIANT[fee.feeType] || "neutral"} size="md" className="capitalize">
                      {fee.feeType}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-white/70 font-semibold">
                      {fee.month && fee.year ? `${fee.month} ${fee.year}` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/25">
                      <p className="text-sm font-black text-emerald-300 whitespace-nowrap">
                        Rs. {fee.amount?.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm text-white/70 font-semibold">
                      {new Date(fee.date).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => generateFeeSlip(fee)}
                        className="p-2 rounded-lg bg-gradient-to-br from-royal-500 to-royal-600 text-white shadow-md shadow-royal-500/30 ring-1 ring-royal-400/30 cursor-pointer"
                        title="Download Receipt"
                      >
                        <FiDownload size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => { setSelectedFee(fee); setConfirmOpen(true); }}
                        className="p-2 rounded-lg bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:text-white transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 size={13} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedFee(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Fee Record?"
        message="Are you sure you want to delete this fee record? This action cannot be undone."
      />
    </>
  );
};

export default FeeTable;