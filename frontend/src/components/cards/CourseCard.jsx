import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { deleteCourse } from "../../redux/slices/courseSlice.js";
import CourseModal from "../modals/CourseModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { Card, Badge, Avatar } from "../ui";
import {
  FiBook, FiUsers, FiClock, FiEdit2, FiTrash2, FiUser, FiDollarSign,
} from "react-icons/fi";

const CourseCard = ({ course }) => {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteCourse(course._id));
    setDeleteLoading(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group relative rounded-2xl overflow-hidden bg-ink-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-flame-400/30 hover:shadow-2xl hover:shadow-flame-500/10 transition-shadow duration-500"
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flame-500/50 to-transparent" />

        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-flame-500/15 rounded-full blur-3xl group-hover:bg-flame-500/25 transition-colors duration-700 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-royal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-xl blur-md opacity-50 group-hover:opacity-90 transition-opacity" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40 ring-1 ring-white/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <FiBook className="text-white text-lg" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-white truncate group-hover:text-flame-300 transition-colors">
                  {course.courseName}
                </h3>
                <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                  {course.description || "No description"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setEditOpen(true)}
                className="p-2 rounded-lg bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-md shadow-flame-500/30 ring-1 ring-flame-400/30 cursor-pointer"
                title="Edit"
              >
                <FiEdit2 size={12} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setConfirmOpen(true)}
                className="p-2 rounded-lg bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:text-white transition-colors cursor-pointer"
                title="Delete"
              >
                <FiTrash2 size={12} />
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-royal-500/8 border border-royal-500/20">
              <div className="w-8 h-8 rounded-lg bg-royal-500/20 border border-royal-400/30 flex items-center justify-center">
                <FiClock className="text-royal-300 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Duration</p>
                <p className="text-xs font-black text-white truncate">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-flame-500/8 border border-flame-500/20">
              <div className="w-8 h-8 rounded-lg bg-flame-500/20 border border-flame-400/30 flex items-center justify-center">
                <FiUsers className="text-flame-300 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Students</p>
                <p className="text-xs font-black text-white">{course.studentCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="relative rounded-xl p-3 mb-4 bg-white/[0.03] border border-white/[0.06]">
            <div className="absolute -top-2.5 left-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-flame-500 to-flame-600 shadow-md shadow-flame-500/40">
              <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                <FiDollarSign className="text-[10px]" />
                Fee Structure
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {[
                { label: "Registration", value: course.registrationFee },
                { label: "Advance",      value: course.advanceFee },
                { label: "Monthly",      value: course.monthlyFee, highlight: true },
                { label: "Exam",         value: course.examFee },
              ].map((fee) => (
                <div
                  key={fee.label}
                  className={`p-2 rounded-lg ${
                    fee.highlight
                      ? "bg-gradient-to-br from-flame-500/20 to-flame-600/10 border border-flame-400/30"
                      : "bg-white/[0.03] border border-white/[0.06]"
                  }`}
                >
                  <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5 font-black">
                    {fee.label}
                  </p>
                  <p className={`text-xs font-black ${fee.highlight ? "text-flame-200" : "text-white/80"}`}>
                    Rs. {fee.value?.toLocaleString() || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {course.assignedTeacher?.name ? (
              <>
                <Avatar name={course.assignedTeacher.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Instructor</p>
                  <p className="text-xs font-bold text-white truncate">{course.assignedTeacher.name}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-white/30 text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">Instructor</p>
                  <p className="text-xs font-bold text-white/40 italic">Not Assigned</p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <CourseModal isOpen={editOpen} onClose={() => setEditOpen(false)} course={course} />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Course?"
        message={`Are you sure you want to delete "${course.courseName}"? This action cannot be undone.`}
      />
    </>
  );
};

export default CourseCard;