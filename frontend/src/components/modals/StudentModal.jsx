import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, updateStudent, addPreviousFees } from "../../redux/slices/studentSlice.js";
import { fetchCourses } from "../../redux/slices/courseSlice.js";
import { FiX, FiUpload, FiCheck, FiBook, FiCamera, FiPrinter, FiPlus, FiTrash2, FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";
import CameraCapture from "../common/CameraCapture.jsx";
import { printAdmissionForm } from "../../utils/printAdmissionForm.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const INITIAL_FORM = {
  regNo: "", admissionNumber: "", stdId: "", formDate: "",
  name: "", fatherName: "", fatherOccupation: "", domicile: "",
  dateOfBirth: "", gender: "", cnic: "",
  phone: "", parentPhone: "", email: "",
  address: "", permanentAddress: "",
  qualification: "", schoolCollegeName: "", passingYear: "",
  enrolledCourses: [], batch: "", classTimings: "",
  courseDuration: "", startingDate: "", completionDate: "",
  emergencyContact: "", emergencyRelation: "",
  documents: {
    passportPhotos: false, cnicCopy: false, educationalCertificates: false,
    parentCnicCopy: false, domicileCertificate: false, matricDmc: false,
  },
  admissionFee: 0, monthlyFee: 0, discount: 0, totalFee: 0,
  registrationDate: "", isActive: true,
};

const InputField = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <div>
    <label className="block text-[10px] font-black text-white/70 mb-2 uppercase tracking-widest">
      {label} {required && <span className="text-orange-300">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-[#F06E23] focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(240,110,35,0.2)] transition-all placeholder:text-white/40 backdrop-blur-sm"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-[10px] font-black text-white/70 mb-2 uppercase tracking-widest">
      {label} {required && <span className="text-orange-300">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-[#F06E23] focus:bg-white/15 transition-all backdrop-blur-sm"
    >
      <option value="" className="bg-[#0F3C82]">-- Select --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#0F3C82]">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckBox = ({ label, name, checked, onChange }) => (
  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/15 cursor-pointer hover:bg-white/10 transition-all">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-4 h-4 accent-[#F06E23] cursor-pointer" />
    <span className="text-xs text-white/90 font-semibold">{label}</span>
  </label>
);

const CourseSelector = ({ courses, selected, onChange }) => {
  const toggleCourse = (courseId) => {
    if (selected.includes(courseId)) onChange(selected.filter((id) => id !== courseId));
    else onChange([...selected, courseId]);
  };
  return (
    <div>
      <label className="block text-[10px] font-black text-white/70 mb-2 uppercase tracking-widest">
        Enrolled Courses <span className="text-orange-300">*</span>
      </label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map((id) => {
            const course = courses.find((c) => c._id === id);
            return course ? (
              <span key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#F06E23]/30 to-[#1956A9]/20 border border-orange-400/40 text-white text-xs font-bold backdrop-blur-sm shadow-md">
                <FiBook size={10} className="text-orange-300" />
                {course.courseName}
                <button type="button" onClick={() => toggleCourse(id)} className="ml-0.5 hover:text-red-300 cursor-pointer">
                  <FiX size={10} />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {courses.map((course) => {
          const isSelected = selected.includes(course._id);
          return (
            <button
              key={course._id}
              type="button"
              onClick={() => toggleCourse(course._id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
                isSelected
                  ? "bg-gradient-to-r from-[#F06E23]/25 to-[#1956A9]/15 border-orange-400/50 text-white shadow-md"
                  : "bg-white/5 border-white/15 text-white/70 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-gradient-to-br from-[#F06E23] to-[#D45A15]" : "bg-white/10"}`}>
                  <FiBook size={11} className={isSelected ? "text-white" : "text-white/50"} />
                </div>
                <div>
                  <p className="text-xs font-bold">{course.courseName}</p>
                  <p className="text-[9px] text-white/50">Rs. {course.monthlyFee?.toLocaleString()}/mo</p>
                </div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={10} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   🆕 PREVIOUS FEES SECTION
   ═══════════════════════════════════════════════════════ */
const PreviousFeesSection = ({ courses, selectedCourseIds, previousFees, setPreviousFees }) => {
  const currentYear = new Date().getFullYear();
  const selectedCourses = courses.filter((c) => selectedCourseIds.includes(c._id));

  const addRow = () => {
    setPreviousFees([
      ...previousFees,
      {
        id: Date.now() + Math.random(),
        course: selectedCourses[0]?._id || "",
        feeType: "monthly",
        month: "January",
        year: currentYear.toString(),
        amount: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
    ]);
  };

  const removeRow = (id) => setPreviousFees(previousFees.filter((f) => f.id !== id));

  const updateRow = (id, field, value) => {
    setPreviousFees(
      previousFees.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, [field]: value };
        // Auto-fill amount when course/feeType changes
        if (field === "course" || field === "feeType") {
          const c = courses.find((x) => x._id === (field === "course" ? value : updated.course));
          if (c) {
            if (updated.feeType === "monthly") updated.amount = c.monthlyFee;
            else if (updated.feeType === "registration") updated.amount = c.registrationFee;
            else if (updated.feeType === "advance") updated.amount = c.advanceFee;
            else if (updated.feeType === "exam") updated.amount = c.examFee;
            else if (updated.feeType === "package") updated.amount = c.packageFee;
          }
        }
        return updated;
      })
    );
  };

  if (selectedCourseIds.length === 0) {
    return (
      <p className="text-xs text-white/50 text-center py-4 italic">
        Select at least one course first to add previous fees.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/70 font-bold">
          💡 Add fees already received from this student before joining the system.
          These will count in reports with their original dates.
        </p>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black shadow-md hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
        >
          <FiPlus size={12} /> Add Fee
        </button>
      </div>

      {previousFees.length === 0 ? (
        <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-center">
          <FiDollarSign className="text-white/40 text-2xl mx-auto mb-2" />
          <p className="text-xs text-white/50">No previous fees added yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {previousFees.map((f, idx) => (
            <div key={f.id} className="p-3 rounded-xl bg-white/5 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                  Fee #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(f.id)}
                  className="p-1 rounded-lg bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/40 hover:text-white transition-all cursor-pointer"
                >
                  <FiTrash2 size={11} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Course</label>
                  <select
                    value={f.course}
                    onChange={(e) => updateRow(f.id, "course", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23]"
                  >
                    <option value="" className="bg-[#0F3C82]">-- Select Course --</option>
                    {selectedCourses.map((c) => (
                      <option key={c._id} value={c._id} className="bg-[#0F3C82]">
                        {c.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Fee Type</label>
                  <select
                    value={f.feeType}
                    onChange={(e) => updateRow(f.id, "feeType", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23]"
                  >
                    <option value="registration" className="bg-[#0F3C82]">Registration</option>
                    <option value="advance" className="bg-[#0F3C82]">Advance</option>
                    <option value="monthly" className="bg-[#0F3C82]">Monthly</option>
                    <option value="package" className="bg-[#0F3C82]">Package</option>
                    <option value="exam" className="bg-[#0F3C82]">Exam</option>
                    <option value="penalty" className="bg-[#0F3C82]">Penalty</option>
                  </select>
                </div>

                {f.feeType === "monthly" && (
                  <>
                    <div>
                      <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Month</label>
                      <select
                        value={f.month}
                        onChange={(e) => updateRow(f.id, "month", e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23]"
                      >
                        {MONTHS.map((m) => (
                          <option key={m} value={m} className="bg-[#0F3C82]">{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Year</label>
                      <input
                        type="number"
                        value={f.year}
                        onChange={(e) => updateRow(f.id, "year", e.target.value)}
                        min="2020" max="2030"
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23]"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Amount (Rs.)</label>
                  <input
                    type="number"
                    value={f.amount}
                    onChange={(e) => updateRow(f.id, "amount", e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={f.date}
                    onChange={(e) => updateRow(f.id, "date", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#F06E23] [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previousFees.length > 0 && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/80">Total Previous Fees</span>
            <span className="text-sm font-black text-emerald-200">
              Rs. {previousFees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN MODAL
   ═══════════════════════════════════════════════════════ */
const StudentModal = ({ isOpen, onClose, editStudent = null }) => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const { loading } = useSelector((state) => state.students);

  const [form, setForm] = useState(INITIAL_FORM);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [previousFees, setPreviousFees] = useState([]); // 🆕

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);

  // 🆕 Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (editStudent) {
        setForm({
          regNo: editStudent.regNo || "",
          admissionNumber: editStudent.admissionNumber || "",
          stdId: editStudent.stdId || "",
          formDate: editStudent.formDate ? new Date(editStudent.formDate).toISOString().split("T")[0] : "",
          name: editStudent.name || "",
          fatherName: editStudent.fatherName || "",
          fatherOccupation: editStudent.fatherOccupation || "",
          domicile: editStudent.domicile || "",
          dateOfBirth: editStudent.dateOfBirth ? new Date(editStudent.dateOfBirth).toISOString().split("T")[0] : "",
          gender: editStudent.gender || "",
          cnic: editStudent.cnic || "",
          phone: editStudent.phone || "",
          parentPhone: editStudent.parentPhone || "",
          email: editStudent.email || "",
          address: editStudent.address || "",
          permanentAddress: editStudent.permanentAddress || "",
          qualification: editStudent.qualification || "",
          schoolCollegeName: editStudent.schoolCollegeName || "",
          passingYear: editStudent.passingYear || "",
          enrolledCourses: editStudent.enrolledCourses?.map((c) => typeof c === "object" ? c._id : c) || [],
          batch: editStudent.batch || "",
          classTimings: editStudent.classTimings || "",
          courseDuration: editStudent.courseDuration || "",
          startingDate: editStudent.startingDate ? new Date(editStudent.startingDate).toISOString().split("T")[0] : "",
          completionDate: editStudent.completionDate ? new Date(editStudent.completionDate).toISOString().split("T")[0] : "",
          emergencyContact: editStudent.emergencyContact || "",
          emergencyRelation: editStudent.emergencyRelation || "",
          documents: editStudent.documents || INITIAL_FORM.documents,
          admissionFee: editStudent.admissionFee || 0,
          monthlyFee: editStudent.monthlyFee || 0,
          discount: editStudent.discount || 0,
          totalFee: editStudent.totalFee || 0,
          registrationDate: editStudent.registrationDate ? new Date(editStudent.registrationDate).toISOString().split("T")[0] : "",
          isActive: editStudent.isActive ?? true,
        });
        setPreview(editStudent.photo ? `http://localhost:5000${editStudent.photo}` : null);
      } else {
        setForm(INITIAL_FORM);
        setPhoto(null);
        setPreview(null);
      }
      setPreviousFees([]);
    }
  }, [editStudent, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDocChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, documents: { ...prev.documents, [name]: checked } }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = (file, dataUrl) => {
    setPhoto(file);
    setPreview(dataUrl);
  };

  const handleCoursesChange = (selectedCourses) => {
    setForm((prev) => ({ ...prev, enrolledCourses: selectedCourses }));
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === "enrolledCourses" || key === "documents") return;
      formData.append(key, val ?? "");
    });
    formData.append("enrolledCourses", JSON.stringify(form.enrolledCourses));
    formData.append("documents", JSON.stringify(form.documents));

    // 🆕 Attach previous fees only in ADD mode
    if (!editStudent && previousFees.length > 0) {
      const cleaned = previousFees
        .filter((f) => f.course && f.feeType && Number(f.amount) > 0)
        .map(({ id, ...rest }) => rest);
      formData.append("previousFees", JSON.stringify(cleaned));
    }

    if (photo) formData.append("photo", photo);
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.enrolledCourses.length === 0) {
      toast.error("Please select at least one course ❌");
      return;
    }
    const formData = buildFormData();

    let result;
    if (editStudent) {
      result = await dispatch(updateStudent({ id: editStudent._id, studentData: formData }));

      // 🆕 If edit mode and previous fees added → save separately
      if (!result.error && previousFees.length > 0) {
        const cleaned = previousFees
          .filter((f) => f.course && f.feeType && Number(f.amount) > 0)
          .map(({ id, ...rest }) => rest);
        if (cleaned.length > 0) {
          await dispatch(addPreviousFees({ id: editStudent._id, previousFees: cleaned }));
        }
      }
    } else {
      result = await dispatch(addStudent(formData));
    }

    if (!result.error) {
      onClose();
      setForm(INITIAL_FORM);
      setPhoto(null);
      setPreview(null);
      setPreviousFees([]);
    }
  };

  const handlePrint = () => {
    const courseObjects = courses.filter((c) => form.enrolledCourses.includes(c._id));
    printAdmissionForm({ ...form, enrolledCoursesData: courseObjects, photoPreview: preview });
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* 🆕 Full-screen fixed overlay with portal — high z-index */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        style={{ zIndex: 9999 }}
        onClick={(e) => {
          // Close if backdrop clicked
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/20 shadow-2xl shadow-black/60"
          style={{ background: "linear-gradient(180deg, #0F3C82 0%, #1956A9 50%, #0a1929 100%)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1956A9] via-[#F06E23] to-[#FB923C] rounded-t-2xl" />

          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-2xl border-b border-white/15 px-6 py-4 flex items-center justify-between"
            style={{ background: "linear-gradient(180deg, rgba(15,60,130,0.95) 0%, rgba(25,86,169,0.85) 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F06E23] to-[#D45A15] flex items-center justify-center shadow-lg shadow-orange-600/50 ring-2 ring-white/20">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-white">
                  {editStudent ? "Edit Student" : "New Student Admission"}
                </h2>
                <p className="text-[10px] text-white/60 uppercase tracking-widest">
                  MR <span className="text-[#FFB088]">SOLVER</span> Registration Form
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white/90 text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
                title="Print Form"
              >
                <FiPrinter size={13} /> Print
              </button>
              <button onClick={onClose} className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:bg-red-500/20 hover:border-red-400/50 transition-all cursor-pointer">
                <FiX size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative p-6 space-y-6">
            {/* Photo + Form Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white/20" />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                      <FiUpload className="text-white/50 text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br from-[#1956A9] to-[#0F3C82] text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-md">
                    <FiUpload size={12} /> File
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br from-[#F06E23] to-[#D45A15] text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-md"
                  >
                    <FiCamera size={12} /> Camera
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                <InputField label="Reg No" name="regNo" value={form.regNo} onChange={handleChange} />
                <InputField label="Adm No" name="admissionNumber" value={form.admissionNumber} onChange={handleChange} />
                <InputField label="STD-ID" name="stdId" value={form.stdId} onChange={handleChange} />
                <InputField label="Form Date" name="formDate" type="date" value={form.formDate} onChange={handleChange} />
              </div>
            </div>

            {/* 1. Personal */}
            <Section title="1. Personal Information" color="orange">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Student Name" name="name" value={form.name} onChange={handleChange} required />
                <InputField label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} required />
                <InputField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
                <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange}
                  options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
                />
                <InputField label="CNIC No" name="cnic" value={form.cnic} onChange={handleChange} placeholder="12345-1234567-1" />
                <InputField label="Student Contact" name="phone" value={form.phone} onChange={handleChange} required />
                <InputField label="Parent Contact" name="parentPhone" value={form.parentPhone} onChange={handleChange} />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <InputField label="Father Occupation" name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} />
                <InputField label="Domicile" name="domicile" value={form.domicile} onChange={handleChange} />
                <div className="sm:col-span-2">
                  <InputField label="Present Address" name="address" value={form.address} onChange={handleChange} />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} />
                </div>
              </div>
            </Section>

            {/* 2. Educational */}
            <Section title="2. Educational Information" color="blue">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField label="Qualification" name="qualification" value={form.qualification} onChange={handleChange}
                  options={[
                    { value: "matric", label: "Matric" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "bachelor", label: "Bachelor" },
                    { value: "master", label: "Master" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <InputField label="School/College/University" name="schoolCollegeName" value={form.schoolCollegeName} onChange={handleChange} />
                <InputField label="Passing Year" name="passingYear" value={form.passingYear} onChange={handleChange} placeholder="e.g. 2023" />
              </div>
            </Section>

            {/* 3. Course */}
            <Section title="3. Course Information" color="orange">
              <CourseSelector courses={courses} selected={form.enrolledCourses} onChange={handleCoursesChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <SelectField label="Batch" name="batch" value={form.batch} onChange={handleChange}
                  options={[
                    { value: "morning", label: "Morning" },
                    { value: "evening", label: "Evening" },
                    { value: "weekend", label: "Weekend" },
                  ]}
                />
                <InputField label="Class Timings" name="classTimings" value={form.classTimings} onChange={handleChange} placeholder="e.g. 9:00 AM - 11:00 AM" />
                <InputField label="Course Duration" name="courseDuration" value={form.courseDuration} onChange={handleChange} placeholder="e.g. 3 months" />
                <InputField label="Starting Date" name="startingDate" type="date" value={form.startingDate} onChange={handleChange} />
                <InputField label="Completion Date" name="completionDate" type="date" value={form.completionDate} onChange={handleChange} />
                <InputField label="Registration Date" name="registrationDate" type="date" value={form.registrationDate} onChange={handleChange} />
              </div>
            </Section>

            {/* 4. Emergency */}
            <Section title="4. Emergency Contact Information" color="red">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
                <InputField label="Relationship with Student" name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} />
              </div>
            </Section>

            {/* 5. Documents */}
            <Section title="5. Required Documents Checklist" color="emerald">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <CheckBox label="Passport Photos (2)" name="passportPhotos" checked={form.documents.passportPhotos} onChange={handleDocChange} />
                <CheckBox label="CNIC/B-Form Copy" name="cnicCopy" checked={form.documents.cnicCopy} onChange={handleDocChange} />
                <CheckBox label="Educational Certificates" name="educationalCertificates" checked={form.documents.educationalCertificates} onChange={handleDocChange} />
                <CheckBox label="Parent/Guardian CNIC" name="parentCnicCopy" checked={form.documents.parentCnicCopy} onChange={handleDocChange} />
                <CheckBox label="Domicile Certificate" name="domicileCertificate" checked={form.documents.domicileCertificate} onChange={handleDocChange} />
                <CheckBox label="Matric DMC" name="matricDmc" checked={form.documents.matricDmc} onChange={handleDocChange} />
              </div>
            </Section>

            {/* Office Use */}
            <Section title="Office Use Only" color="blue">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InputField label="Admission Fee" name="admissionFee" type="number" value={form.admissionFee} onChange={handleChange} />
                <InputField label="Monthly Fee" name="monthlyFee" type="number" value={form.monthlyFee} onChange={handleChange} />
                <InputField label="Discount/Scholarship" name="discount" type="number" value={form.discount} onChange={handleChange} />
                <InputField label="Total Fee" name="totalFee" type="number" value={form.totalFee} onChange={handleChange} />
              </div>
            </Section>

            {/* 🆕 6. Previous Fees */}
            <Section title="6. Previous Fees Received (Optional)" color="purple">
              <PreviousFeesSection
                courses={courses}
                selectedCourseIds={form.enrolledCourses}
                previousFees={previousFees}
                setPreviousFees={setPreviousFees}
              />
            </Section>

            {editStudent && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20">
                <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-[#F06E23] cursor-pointer" />
                <label htmlFor="isActive" className="text-sm text-white font-bold cursor-pointer">Student is Active</label>
              </div>
            )}

            <div className="flex gap-3 pt-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 bg-white/5 text-white/80 text-sm font-bold hover:bg-white/10 transition-all cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-white/20 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all cursor-pointer">
                <FiPrinter size={14} /> Print Form
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F06E23] to-[#D45A15] text-white text-sm font-black shadow-lg shadow-orange-600/50 hover:-translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer ring-1 ring-orange-300/30">
                {loading ? "Saving..." : editStudent ? "Update Student" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CameraCapture isOpen={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleCameraCapture} />
    </>
  );

  // 🆕 Render via Portal to escape parent stacking context
  return createPortal(modalContent, document.body);
};

const Section = ({ title, color, children }) => {
  const colorMap = {
    orange: "from-[#F06E23] to-[#D45A15] shadow-orange-600/40",
    blue: "from-[#1956A9] to-[#0F3C82] shadow-blue-500/40",
    emerald: "from-emerald-500 to-green-600 shadow-emerald-500/40",
    red: "from-red-500 to-red-700 shadow-red-500/40",
    purple: "from-violet-500 to-purple-600 shadow-purple-500/40",
  };
  return (
    <div className="relative rounded-2xl p-4 bg-white/5 border border-white/15 backdrop-blur-sm">
      <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${colorMap[color]} shadow-lg`}>
        <p className="text-[10px] font-black text-white uppercase tracking-widest">{title}</p>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default StudentModal;