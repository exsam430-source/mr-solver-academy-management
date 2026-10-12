import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updateCourse } from "../../redux/slices/courseSlice.js";
import { FiBook, FiDollarSign, FiClock, FiPackage } from "react-icons/fi";
import { Modal, Input, Button, Badge } from "../ui";

const INITIAL_FORM = {
  courseName: "",
  description: "",
  duration: "",
  durationMonths: "",
  registrationFee: 0,
  advanceFee: 0,
  monthlyFee: "",
  packageFee: 0,
  examFee: 0,
};

const Section = ({ title, icon, children }) => (
  <div className="relative rounded-2xl p-4 bg-white/[0.03] border border-white/[0.06]">
    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-flame-500 to-flame-600 shadow-md shadow-flame-500/40 flex items-center gap-1.5">
      {icon}
      <p className="text-[10px] font-black text-white uppercase tracking-widest">{title}</p>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

const CourseModal = ({ isOpen, onClose, course = null, editCourse = null }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.courses);
  // Support both prop names (`course` from CourseCard, `editCourse` from elsewhere)
  const editing = course || editCourse;

  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          courseName: editing.courseName || "",
          description: editing.description || "",
          duration: editing.duration || "",
          durationMonths: editing.durationMonths || "",
          registrationFee: editing.registrationFee || 0,
          advanceFee: editing.advanceFee || 0,
          monthlyFee: editing.monthlyFee || "",
          packageFee: editing.packageFee || 0,
          examFee: editing.examFee || 0,
        });
      } else {
        setForm(INITIAL_FORM);
      }
    }
  }, [editing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      durationMonths: Number(form.durationMonths),
      registrationFee: Number(form.registrationFee) || 0,
      advanceFee: Number(form.advanceFee) || 0,
      monthlyFee: Number(form.monthlyFee),
      packageFee: Number(form.packageFee) || 0,
      examFee: Number(form.examFee) || 0,
    };

    let result;
    if (editing) {
      result = await dispatch(updateCourse({ id: editing._id, courseData: payload }));
    } else {
      result = await dispatch(addCourse(payload));
    }
    if (!result.error) {
      onClose();
      setForm(INITIAL_FORM);
    }
  };

  const totalMonthlyCalc = Number(form.monthlyFee || 0) * Number(form.durationMonths || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Edit Course" : "Add New Course"}
      subtitle="MR SOLVER Course Configuration"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Info */}
        <Section title="Course Information" icon={<FiBook className="text-white text-[10px]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Course Name"
                name="courseName"
                value={form.courseName}
                onChange={handleChange}
                placeholder="e.g. Web Development, DIT, CIT"
                required
              />
            </div>
            <Input
              label="Duration (Display)"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6 Months, 1 Year"
              icon={<FiClock size={14} />}
              required
            />
            <Input
              label="Duration in Months"
              name="durationMonths"
              type="number"
              value={form.durationMonths}
              onChange={handleChange}
              placeholder="e.g. 6"
              icon={<FiClock size={14} />}
              required
            />
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description of the course..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-flame-500 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(240,110,35,0.15)] transition-all placeholder:text-white/30 backdrop-blur-sm resize-none"
              />
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-royal-500/10 border border-royal-400/20 flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-[11px] text-royal-200 font-semibold">
              <span className="text-white font-black">Duration Months</span> is used to auto-calculate total course fee & track completion status.
            </p>
          </div>
        </Section>

        {/* Fee Structure */}
        <Section title="Fee Structure" icon={<FiDollarSign className="text-white text-[10px]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monthly Fee (Rs.)"
              name="monthlyFee"
              type="number"
              value={form.monthlyFee}
              onChange={handleChange}
              placeholder="e.g. 2000"
              icon={<FiDollarSign size={14} />}
              required
            />
            <Input
              label="Package Fee (Rs.)"
              name="packageFee"
              type="number"
              value={form.packageFee}
              onChange={handleChange}
              placeholder="One-time payment"
              icon={<FiPackage size={14} />}
              hint="Optional — one-time full payment"
            />
            <Input
              label="Registration Fee"
              name="registrationFee"
              type="number"
              value={form.registrationFee}
              onChange={handleChange}
              placeholder="0"
              icon={<FiDollarSign size={14} />}
            />
            <Input
              label="Advance Fee"
              name="advanceFee"
              type="number"
              value={form.advanceFee}
              onChange={handleChange}
              placeholder="0"
              icon={<FiDollarSign size={14} />}
            />
            <Input
              label="Exam Fee"
              name="examFee"
              type="number"
              value={form.examFee}
              onChange={handleChange}
              placeholder="0"
              icon={<FiDollarSign size={14} />}
            />
          </div>

          {totalMonthlyCalc > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-royal-500/10 border border-emerald-400/25">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-1.5">
                  📊 Auto-Calculated
                </p>
                <Badge variant="success" size="sm" pulse>Live</Badge>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-white/70 font-semibold">
                  Total Monthly ({form.durationMonths} × Rs. {Number(form.monthlyFee).toLocaleString()})
                </span>
                <span className="text-sm font-black text-emerald-300">
                  Rs. {totalMonthlyCalc.toLocaleString()}
                </span>
              </div>
              {Number(form.packageFee) > 0 && (
                <div className="flex items-center justify-between flex-wrap gap-2 mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/70 font-semibold">Package Discount</span>
                  <span className="text-sm font-black text-flame-300">
                    Save Rs. {Math.max(totalMonthlyCalc - Number(form.packageFee), 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
            {loading ? "Saving..." : editing ? "Update Course" : "Add Course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;