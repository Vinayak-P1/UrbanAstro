import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  content: { type: String },        // optional text
  fileUrl: { type: String },        // uploaded PDF URL
  deliveredAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
