import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFee, clearLastFee, fetchStudentFeeDetails } from "../../redux/slices/feeSlice.js";
import { fetchStudents } from "../../redux/slices/studentSlice.js";
import { FiDollarSign, FiPrinter, FiPackage, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { generateFeeSlip } from "../../utils/pdfGenerator.js";
import { Modal, Input, Button, Badge } from "../ui";

const FEE_TYPES = [
  { value: "registration", label: "Registration Fee" },
  { value: "advance",      label: "Advance Fee" },
  { value: "monthly",      label: "Monthly Fee" },
  { value: "package",      label: "📦 Package Fee (Full Course)" },
  { value: "exam",         label: "Exam Fee" },
  { value: "penalty",      label: "Penalty Fee" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const selectClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all cursor-pointer backdrop-blur-sm";
const labelClass = "block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2";

const FeeModal = ({ isOpen, onClose, prefillData = null }) => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { loading, lastAddedFee, studentFeeDetails } = useSelector((state) => state.fees);

  const [formData, setFormData] = useState({
    student: "", course: "", feeType: "", amount: "",
    month: "", year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split("T")[0], notes: "",
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [courseStatus, setCourseStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchStudents());
      if (prefillData) {
        setFormData((prev) => ({ ...prev, ...prefillData }));
      } else {
        setFormData({
          student: "", course: "", feeType: "", amount: "",
          month: "", year: new Date().getFullYear().toString(),
          date: new Date().toISOString().split("T")[0], notes: "",
        });
      }
      setSelectedStudent(null);
      setShowReceipt(false);
      setCourseStatus(null);
    }
  }, [isOpen, dispatch, prefillData]);

  useEffect(() => {
    if (formData.student) {
      dispatch(fetchStudentFeeDetails(formData.student));
    }
  }, [formData.student, dispatch]);

  useEffect(() => {
    if (lastAddedFee && showReceipt) {
      generateFeeSlip(lastAddedFee);
      dispatch(clearLastFee());
      setShowReceipt(false);
      onClose();
    }
  }, [lastAddedFee, showReceipt, dispatch, onClose]);

  useEffect(() => {
    if (formData.course && studentFeeDetails?.courseBreakdown) {
      const cb = studentFeeDetails.courseBreakdown.find((c) => c.course._id === formData.course);
      setCourseStatus(cb || null);
    } else {
      setCourseStatus(null);
    }
  }, [formData.course, studentFeeDetails]);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setFormData({ ...formData, student: studentId, course: "", amount: "", feeType: "" });
  };

  const handleCourseChange = (e) => {
    setFormData({ ...formData, course: e.target.value, amount: "", feeType: "" });
  };

  const handleFeeTypeChange = (e) => {
    const feeType = e.target.value;
    let autoAmount = "";
    if (formData.course && selectedStudent) {
      const course = selectedStudent.enrolledCourses?.find((c) => c._id === formData.course);
      if (course) {
        if (feeType === "monthly")          autoAmount = course.monthlyFee;
        else if (feeType === "registration") autoAmount = course.registrationFee;
        else if (feeType === "advance")      autoAmount = course.advanceFee;
        else if (feeType === "exam")         autoAmount = course.examFee;
        else if (feeType === "package")      autoAmount = course.packageFee;
      }
    }
    setFormData({ ...formData, feeType, amount: autoAmount || "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e, withReceipt = false) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (formData.feeType !== "monthly") {
      delete submitData.month;
      delete submitData.year;
    } else {
      submitData.year = parseInt(formData.year);
    }
    if (withReceipt) setShowReceipt(true);
    const result = await dispatch(addFee(submitData));
    if (!result.error && !withReceipt) onClose();
  };

  const isPackagePaid = courseStatus?.packagePaid;
  const isFullyPaid = courseStatus?.isFullyPaid;
  const isCourseLocked = isPackagePaid || isFullyPaid;

  const getAvailableFeeTypes = () => {
    if (!courseStatus) return FEE_TYPES;
    if (isPackagePaid || isFullyPaid) {
      return FEE_TYPES.filter((t) => ["exam", "penalty"].includes(t.value));
    }
    let available = FEE_TYPES;
    if (courseStatus.registrationPaid) {
      available = available.filter((t) => t.value !== "registration");
    }
    return available;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Fee"
      subtitle="MR SOLVER Payment Collection"
      size="md"
    >
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
        {/* Student */}
        <div>
          <label className={labelClass}>Select Student *</label>
          <select name="student" value={formData.student} onChange={handleStudentChange} required className={selectClass}>
            <option value="">Choose Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} {s.admissionNumber ? `(${s.admissionNumber})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        {selectedStudent && (
          <div>
            <label className={labelClass}>Select Course *</label>
            <select name="course" value={formData.course} onChange={handleCourseChange} required className={selectClass}>
              <option value="">Choose Course</option>
              {selectedStudent.enrolledCourses?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName} (Rs. {c.monthlyFee?.toLocaleString()}/month)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status alerts */}
        {courseStatus && isCourseLocked && (
          <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${
            isPackagePaid ? "bg-flame-500/10 border-flame-400/30" : "bg-emerald-500/10 border-emerald-400/30"
          }`}>
            {isPackagePaid
              ? <FiPackage className="text-flame-300 text-lg flex-shrink-0 mt-0.5" />
              : <FiCheckCircle className="text-emerald-300 text-lg flex-shrink-0 mt-0.5" />}
            <div>
              <p className={`text-xs font-black ${isPackagePaid ? "text-flame-200" : "text-emerald-200"}`}>
                {isPackagePaid
                  ? "📦 Package Already Paid"
                  : `✅ All ${courseStatus.course.durationMonths} Months Paid`}
              </p>
              <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                This course is fully cleared. Only exam/penalty fees can be added.
              </p>
            </div>
          </div>
        )}

        {courseStatus && !isCourseLocked && courseStatus.course.durationMonths > 0 && (
          <div className="p-3 rounded-xl bg-royal-500/8 border border-royal-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-royal-200 uppercase tracking-widest">
                Course Progress
              </span>
              <span className="text-xs font-black text-white">
                {courseStatus.paidMonthsCount} / {courseStatus.course.durationMonths} months
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-flame-500 transition-all rounded-full"
                style={{
                  width: `${Math.min((courseStatus.paidMonthsCount / courseStatus.course.durationMonths) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Fee Type */}
        <div>
          <label className={labelClass}>Fee Type *</label>
          <select name="feeType" value={formData.feeType} onChange={handleFeeTypeChange} required className={selectClass}>
            <option value="">Select Fee Type</option>
            {getAvailableFeeTypes().map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {formData.feeType === "package" && courseStatus?.course.packageFee > 0 && (
            <p className="text-[11px] text-flame-300 mt-2 font-bold">
              💡 Package Fee: Rs. {courseStatus.course.packageFee?.toLocaleString()} (Full course one-time)
            </p>
          )}
        </div>

        {/* Month / Year */}
        {formData.feeType === "monthly" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Month *</label>
              <select name="month" value={formData.month} onChange={handleChange} required className={selectClass}>
                <option value="">Select Month</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <Input
              label="Year *"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              min="2020"
              max="2030"
            />
          </div>
        )}

        {/* Amount */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-br from-flame-500/10 to-emerald-500/5 border border-flame-400/25">
          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-flame-500 to-flame-600 shadow-md shadow-flame-500/40">
            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
              <FiDollarSign className="text-[10px]" /> Payment Amount
            </p>
          </div>
          <div className="mt-3">
            <Input
              label="Amount (PKR) *"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
              icon={<span className="text-flame-300 text-xs font-black">Rs.</span>}
            />
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="[color-scheme:dark]"
        />

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] transition-all placeholder:text-white/30 backdrop-blur-sm resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="success" size="md" fullWidth type="submit" loading={loading} icon={<FiDollarSign />}>
            Save
          </Button>
          <Button variant="primary" size="md" fullWidth onClick={(e) => handleSubmit(e, true)} loading={loading} icon={<FiPrinter />} type="button">
            Save + Print
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeeModal;