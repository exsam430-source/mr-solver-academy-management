import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { deleteStudent } from "../../redux/slices/studentSlice.js";
import StudentModal from "../modals/StudentModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";
import { FiEdit2, FiTrash2, FiEye, FiBook } from "react-icons/fi";
import { Badge, Avatar, EmptyState } from "../ui";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const StudentTable = ({ students }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const isSubAdmin = user?.role === "sub-admin";

  const [editStudent,   setEditStudent]   = useState(null);
  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    await dispatch(deleteStudent(deleteTarget));
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  if (!students || students.length === 0) {
    return (
      <EmptyState
        icon={<FiBook />}
        title="No Students Found"
        description="No students match your current filters. Try adjusting your search or add a new student."
      />
    );
  }

  return (
    <>
      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-royal-500/10 via-transparent to-flame-500/10 border-b border-white/[0.06]">
              {["#", "Student", "Admission No", "Courses", "Phone", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.15em] whitespace-nowrap first:rounded-tl-2xl last:rounded-tr-2xl"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {students.map((student, idx) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: idx * 0.02, duration: 0.2 }}
                  className="border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Row Number */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-black text-white/30">
                      {idx + 1}
                    </span>
                  </td>

                  {/* Student Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {student.photo ? (
                          <>
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-royal-500 to-flame-500 rounded-xl blur-[2px] opacity-50 group-hover:opacity-80 transition-opacity" />
                            <img
                              src={`${SERVER_URL}${student.photo}`}
                              alt={student.name}
                              className="relative w-11 h-11 rounded-xl object-cover ring-2 ring-ink-950"
                            />
                          </>
                        ) : (
                          <Avatar name={student.name} size="md" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-flame-300 transition-colors">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-white/40 font-semibold mt-0.5 truncate max-w-[140px]">
                          {student.fatherName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Admission No */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-bold text-royal-300 bg-royal-500/10 border border-royal-400/25 px-2.5 py-1 rounded-lg inline-block whitespace-nowrap">
                      {student.admissionNumber || "—"}
                    </span>
                  </td>

                  {/* Courses */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {student.enrolledCourses?.length > 0 ? (
                        student.enrolledCourses.slice(0, 2).map((course) => (
                          <Badge key={course._id} variant="flame" size="sm">
                            {course.courseName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-white/40 italic">No courses</span>
                      )}
                      {student.enrolledCourses?.length > 2 && (
                        <Badge variant="neutral" size="sm">
                          +{student.enrolledCourses.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4">
                    <a
                      href={`tel:${student.phone}`}
                      className="text-sm text-white/80 font-semibold whitespace-nowrap hover:text-flame-300 transition-colors"
                    >
                      {student.phone || "—"}
                    </a>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <Badge
                      variant={student.isActive ? "success" : "danger"}
                      size="md"
                      pulse={student.isActive}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => navigate(`/students/${student._id}`)}
                        className="p-2 rounded-lg bg-royal-500/15 border border-royal-400/30 text-royal-300 hover:bg-royal-500/30 hover:text-white transition-colors cursor-pointer"
                        title="View Profile"
                      >
                        <FiEye size={13} />
                      </motion.button>

                      {/* Edit */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setEditStudent(student)}
                        className="p-2 rounded-lg bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-md shadow-flame-500/30 ring-1 ring-flame-400/30 cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 size={13} />
                      </motion.button>

                      {/* Delete — Admin only */}
                      {!isSubAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => {
                            setDeleteTarget(student._id);
                            setConfirmOpen(true);
                          }}
                          className="p-2 rounded-lg bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <StudentModal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        editStudent={editStudent}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Student?"
        message="Are you sure you want to delete this student? All their fee records and attendance will be permanently removed."
      />
    </>
  );
};

export default StudentTable;