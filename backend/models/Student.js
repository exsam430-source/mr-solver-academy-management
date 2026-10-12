import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },

    // ===== Form Numbers =====
    regNo: { type: String, trim: true, default: null },
    admissionNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
    },
    stdId: { type: String, trim: true, default: null },
    formDate: { type: Date, default: Date.now },

    // ===== 1. Personal Information =====
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father/Guardian name is required"],
      trim: true,
    },
    fatherOccupation: { type: String, trim: true, default: null },
    domicile: { type: String, trim: true, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["male", "female", null],
      default: null,
    },
    cnic: { type: String, trim: true, default: null },
    phone: {
      type: String,
      required: [true, "Student contact number is required"],
      trim: true,
    },
    parentPhone: { type: String, trim: true, default: null },
    email: { type: String, trim: true, lowercase: true, default: null },
    address: { type: String, trim: true, default: null },           // Present Address
    permanentAddress: { type: String, trim: true, default: null },  // Permanent Address

    // ===== 2. Educational Information =====
    qualification: {
      type: String,
      enum: ["matric", "intermediate", "bachelor", "master", "other", null],
      default: null,
    },
    schoolCollegeName: { type: String, trim: true, default: null },
    passingYear: { type: String, trim: true, default: null },

    // ===== 3. Course Information =====
    enrolledCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    batch: {
      type: String,
      enum: ["morning", "evening", "weekend", null],
      default: null,
    },
    classTimings: { type: String, trim: true, default: null },
    courseDuration: { type: String, trim: true, default: null },
    startingDate: { type: Date, default: null },
    completionDate: { type: Date, default: null },

    // ===== 4. Emergency Contact =====
    emergencyContact: { type: String, trim: true, default: null },
    emergencyRelation: { type: String, trim: true, default: null },

    // ===== 5. Required Documents Checklist =====
    documents: {
      passportPhotos: { type: Boolean, default: false },
      cnicCopy: { type: Boolean, default: false },
      educationalCertificates: { type: Boolean, default: false },
      parentCnicCopy: { type: Boolean, default: false },
      domicileCertificate: { type: Boolean, default: false },
      matricDmc: { type: Boolean, default: false },
    },

    // ===== Office Use Only =====
    admissionFee: { type: Number, default: 0 },
    monthlyFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },

    // ===== Photo =====
    photo: { type: String, default: null },

    // ===== Meta =====
    registrationDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;