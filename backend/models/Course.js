import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    // 🆕 NEW: Numeric duration in months (used for fee calculation)
    durationMonths: {
      type: Number,
      required: [true, "Duration in months is required"],
      min: 1,
    },
    registrationFee: { type: Number, default: 0 },
    advanceFee: { type: Number, default: 0 },
    monthlyFee: {
      type: Number,
      required: [true, "Monthly fee is required"],
    },
    // 🆕 NEW: Package fee (one-time full payment, optional)
    packageFee: { type: Number, default: 0 },
    examFee: { type: Number, default: 0 },

    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;