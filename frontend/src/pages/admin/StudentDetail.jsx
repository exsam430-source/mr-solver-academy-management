import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchStudentById, fetchStudentFees,
  fetchStudentAttendance, clearSelectedStudent,
} from "../../redux/slices/studentSlice.js";
import {
  fetchStudentFeeDetails, clearStudentFeeDetails,
} from "../../redux/slices/feeSlice.js";
import StudentInfoCard from "../../components/cards/StudentInfoCard.jsx";
import AttendanceCard   from "../../components/cards/AttendanceCard.jsx";
import Loader           from "../../components/common/Loader.jsx";
import { Card, Button, Badge, EmptyState } from "../../components/ui";
import {
  FiArrowLeft, FiDollarSign, FiCalendar, FiPrinter,
  FiPackage, FiCheckCircle, FiBook, FiClock,
} from "react-icons/fi";
import { printAdmissionForm } from "../../utils/printAdmissionForm.js";

const FEE_COLORS = {
  registration: "text-cyan-300",
  advance:      "text-royal-300",
  monthly:      "text-emerald-300",
  package:      "text-violet-300",
  exam:         "text-flame-300",
  penalty:      "text-red-300",
};

const StudentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedStudent, studentFees, studentAttendance, loading } =
    useSelector((s) => s.students);
  const { studentFeeDetails } = useSelector((s) => s.fees);

  useEffect(() => {
    dispatch(fetchStudentById(id));
    dispatch(fetchStudentFees(id));
    dispatch(fetchStudentAttendance(id));
    dispatch(fetchStudentFeeDetails(id));
    return () => {
      dispatch(clearSelectedStudent());
      dispatch(clearStudentFeeDetails());
    };
  }, [id, dispatch]);

  const handlePrintForm = () => {
    if (!selectedStudent) return;
    printAdmissionForm({
      ...selectedStudent,
      enrolledCoursesData: selectedStudent.enrolledCourses || [],
      photoPreview: selectedStudent.photo
        ? `http://localhost:5000${selectedStudent.photo}`
        : null,
    });
  };

  if (loading || !selectedStudent) return <Loader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            icon={<FiArrowLeft />}
            onClick={() => navigate("/students")}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedStudent.name}
            </h1>
            <p className="text-xs text-white/50 font-semibold mt-0.5">
              Student Profile • {selectedStudent.admissionNumber || "No Admission #"}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<FiPrinter />}
          onClick={handlePrintForm}
        >
          Print Admission Form
        </Button>
      </motion.div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-4">
          <StudentInfoCard student={selectedStudent} />
          <AttendanceCard data={studentAttendance} />
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {/* Course Fee Status */}
          {studentFeeDetails?.courseBreakdown?.length > 0 && (
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
                  <FiBook className="text-flame-400" size={14} />
                </div>
                <h3 className="text-sm font-black text-white">Course Fee Status</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentFeeDetails.courseBreakdown.map((cb) => {
                  const isPackage   = cb.packagePaid;
                  const isCompleted = cb.isFullyPaid && !isPackage;
                  const pct = cb.course.durationMonths > 0
                    ? Math.min((cb.paidMonthsCount / cb.course.durationMonths) * 100, 100)
                    : 0;

                  const cfg = isPackage
                    ? { bg: "from-violet-500/15 to-violet-600/5", border: "border-violet-400/30", text: "text-violet-300", icon: <FiPackage />, label: "Package Bought" }
                    : isCompleted
                    ? { bg: "from-emerald-500/15 to-green-600/5", border: "border-emerald-400/30", text: "text-emerald-300", icon: <FiCheckCircle />, label: "Course Completed" }
                    : { bg: "from-royal-500/10 to-royal-600/5", border: "border-royal-400/25", text: "text-royal-300", icon: <FiClock />, label: "In Progress" };

                  return (
                    <motion.div
                      key={cb.course._id}
                      whileHover={{ y: -2 }}
                      className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${cfg.bg} border ${cfg.border} transition-all`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-white truncate">
                            {cb.course.courseName}
                          </h4>
                          <p className="text-[10px] text-white/50 font-semibold mt-0.5">
                            {cb.course.durationMonths
                              ? `${cb.course.durationMonths} months`
                              : "Duration N/A"}
                          </p>
                        </div>
                        <Badge
                          variant={isPackage ? "neutral" : isCompleted ? "success" : "primary"}
                          size="sm"
                          icon={cfg.icon}
                        >
                          {cfg.label}
                        </Badge>
                      </div>

                      {/* Progress */}
                      {!isPackage && cb.course.durationMonths > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">
                              Progress
                            </span>
                            <span className="text-[10px] font-black text-white">
                              {cb.paidMonthsCount} / {cb.course.durationMonths} months
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                isCompleted
                                  ? "bg-gradient-to-r from-emerald-500 to-green-600"
                                  : "bg-gradient-to-r from-flame-500 to-flame-400"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Paid / Pending */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-0.5">
                            Paid
                          </p>
                          <p className="text-xs font-black text-emerald-300">
                            Rs. {cb.totalPaid?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-0.5">
                            Pending
                          </p>
                          <p className={`text-xs font-black ${cb.totalPending > 0 ? "text-red-300" : "text-emerald-300"}`}>
                            Rs. {cb.totalPending?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {isPackage && (
                        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-400/20">
                          <p className="text-[10px] text-violet-300 font-bold flex items-center gap-1.5">
                            <FiPackage size={10} />
                            Package: Rs. {cb.packageAmount?.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
                          <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
                            <FiCheckCircle size={10} />
                            All {cb.course.durationMonths} months paid 🎉
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Grand totals */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/25">
                  <p className="text-[9px] text-white/50 font-black uppercase tracking-widest mb-1">
                    Grand Total Paid
                  </p>
                  <p className="text-lg font-black text-emerald-300">
                    Rs. {studentFeeDetails.grandTotalPaid?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/25">
                  <p className="text-[9px] text-white/50 font-black uppercase tracking-widest mb-1">
                    Grand Total Pending
                  </p>
                  <p className="text-lg font-black text-red-300">
                    Rs. {studentFeeDetails.grandTotalPending?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Fee Summary */}
          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <FiDollarSign className="text-emerald-400" size={14} />
                </div>
                <h3 className="text-sm font-black text-white">Fee Summary</h3>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-400/25">
                <p className="text-sm font-black text-emerald-300">
                  Total: Rs. {studentFees?.totalPaid?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["registration","advance","monthly","package","exam","penalty"].map((type) => {
                const total =
                  studentFees?.data
                    ?.filter((f) => f.feeType === type)
                    ?.reduce((sum, f) => sum + f.amount, 0) || 0;
                return (
                  <div
                    key={type}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <p className="text-[9px] text-white/40 uppercase tracking-widest capitalize font-black mb-1">
                      {type}
                    </p>
                    <p className={`text-sm font-black ${FEE_COLORS[type]}`}>
                      Rs. {total.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Fee History */}
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-flame-500/15 border border-flame-400/25 flex items-center justify-center">
                <FiDollarSign className="text-flame-400" size={14} />
              </div>
              <h3 className="text-sm font-black text-white">Fee History</h3>
            </div>

            {studentFees?.data?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                {studentFees.data.map((fee, i) => (
                  <motion.div
                    key={fee._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/25 transition-all"
                  >
                    <div>
                      <span className={`text-xs font-black capitalize ${FEE_COLORS[fee.feeType]}`}>
                        {fee.feeType} Fee
                      </span>
                      {fee.month && (
                        <span className="text-xs text-white/50 ml-1.5 font-semibold">
                          ({fee.month})
                        </span>
                      )}
                      <p className="text-[10px] text-white/40 mt-0.5 font-semibold">
                        {new Date(fee.date).toLocaleDateString("en-PK", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-black text-emerald-300">
                      Rs. {fee.amount?.toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FiDollarSign />}
                title="No Fee Records"
                description="No fee payments have been recorded for this student."
              />
            )}
          </Card>

          {/* Attendance Records */}
          <Card variant="glass" padding="md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-royal-500/15 border border-royal-400/25 flex items-center justify-center">
                <FiCalendar className="text-royal-300" size={14} />
              </div>
              <h3 className="text-sm font-black text-white">Attendance Records</h3>
            </div>

            {studentAttendance?.data?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                {studentAttendance.data.map((record, i) => (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        {new Date(record.date).toLocaleDateString("en-PK", {
                          weekday: "short", month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-white/40 font-semibold mt-0.5">
                        {record.course?.courseName}
                      </p>
                    </div>
                    <Badge
                      variant={record.status === "present" ? "success" : "danger"}
                      size="md"
                    >
                      {record.status === "present" ? "Present" : "Absent"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FiCalendar />}
                title="No Attendance Records"
                description="No attendance has been recorded for this student yet."
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;