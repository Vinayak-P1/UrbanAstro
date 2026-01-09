import mongoose from "mongoose";

const astrologerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    expertise: { type: String, required: true }, // e.g. Love, Career, Finance
    experience: { type: Number, default: 0 }, // years of experience
    bio: { type: String },
    imageUrl: { type: String }, // profile pic (optional)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Astrologer", astrologerSchema);
