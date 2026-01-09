import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    basePrice: {
      type: Number,
      required: true,
      default: 149,
      min: 0,
    },
    description: {
      type: String,
      default: "Consultation with expert astrologer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pricing", pricingSchema);
