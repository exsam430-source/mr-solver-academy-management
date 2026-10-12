import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { deleteCourse } from "../../redux/slices/courseSlice.js";
import CourseModal from "../modals/CourseModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { FiEdit2, FiTrash2, FiUsers, FiBook, FiClock, FiDollarSign } from "react-icons/fi";
import { Card, Badge, Avatar, EmptyState } from "../ui";

const CourseTable = ({ courses }) => {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteCourse(selectedCourse._id));
    setDeleteLoading(false);
    setConfirmOpen(false);
    setSelectedCourse(null);
  };

  if (!courses || courses.length === 0) {
    return (
      <Card variant="glass" padding="none">
        <EmptyState
          icon={<FiBook />}
          title="No Courses Yet"
          description="Add your first course to start enrolling students."
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
                {["Course", "Duration", "Monthly Fee", "Teacher", "Students", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <motion.tr
                  key={course._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-royal-500 to-flame-500 rounded-xl blur-md opacity-40 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-md shadow-flame-500/30 ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                          <FiBook className="text-white text-sm" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{course.courseName}</p>
                        <p className="text-[10px] text-white/40 line-clamp-1">
                          {course.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="primary" size="md" icon={<FiClock size={10} />}>
                      {course.duration}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-flame-500/10 border border-flame-400/25">
                      <FiDollarSign className="text-flame-300 text-xs" />
                      <p className="text-sm font-black text-white">{course.monthlyFee?.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {course.assignedTeacher?.name ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={course.assignedTeacher.name} size="xs" />
                        <p className="text-sm text-white/90 font-semibold">{course.assignedTeacher.name}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-white/40 italic px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                      <FiUsers className="text-white/60 text-xs" />
                      <span className="text-sm font-black text-white">{course.studentCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => { setSelectedCourse(course); setEditOpen(true); }}
                        className="p-2 rounded-lg bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-md shadow-flame-500/30 ring-1 ring-flame-400/30 cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => { setSelectedCourse(course); setConfirmOpen(true); }}
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

      <CourseModal
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setSelectedCourse(null); }}
        course={selectedCourse}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedCourse(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Course?"
        message={`Are you sure you want to delete "${selectedCourse?.courseName}"?`}
      />
    </>
  );
};

export default CourseTable;