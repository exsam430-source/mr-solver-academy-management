import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    feeType: {
      type: String,
      enum: ["registration", "advance", "monthly", "package", "exam", "penalty"],
      required: [true, "Fee type is required"],
    },
    amount: { type: Number, required: [true, "Amount is required"] },
    month: { type: String, default: null },
    year: { type: Number, default: null },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: null },
    invoiceNumber: { type: String, unique: true, sparse: true },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

feeSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Fee").countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, "0")}`;
  }
});

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;