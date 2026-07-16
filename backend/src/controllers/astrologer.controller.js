import Astrologer from "../models/Astrologer.js";
import cloudinary from "cloudinary";

// ✅ Create new astrologer (Admin only)
export const createAstrologer = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || "";
    }

    const astro = await Astrologer.create({
      name: req.body.name,
      expertise: req.body.expertise,
      experience: req.body.experience,
      bio: req.body.bio,
      imageUrl,
    });

    res.json({ success: true, astro });
  } catch (e) {
    console.error("❌ Create Astrologer Error:", e);
    res.status(500).json({ error: e.message });
  }
};

// ✅ List all astrologers (Public)
export const listAstrologers = async (req, res) => {
  try {
    const list = await Astrologer.find().sort({ createdAt: -1 });
    // 👇 match frontend format
    res.json({ success: true, items: list });
  } catch (e) {
    console.error("❌ List Astrologers Error:", e);
    res.status(500).json({ error: e.message });
  }
};

// ✅ Get astrologer by ID
export const getAstrologerById = async (req, res) => {
  try {
    const astro = await Astrologer.findById(req.params.id);
    if (!astro) return res.status(404).json({ error: "Astrologer not found" });
    res.json({ success: true, astro });
  } catch (e) {
    console.error("❌ Get Astrologer Error:", e);
    res.status(500).json({ error: e.message });
  }
};

// ✅ Update astrologer (Admin only)
export const updateAstrologer = async (req, res) => {
  try {
    const astro = await Astrologer.findById(req.params.id);
    if (!astro) return res.status(404).json({ error: "Astrologer not found" });

    let imageUrl = astro.imageUrl;
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || "";
    }

    astro.name = req.body.name || astro.name;
    astro.expertise = req.body.expertise || astro.expertise;
    astro.experience = req.body.experience || astro.experience;
    astro.bio = req.body.bio || astro.bio;
    astro.imageUrl = imageUrl;

    await astro.save();
    res.json({ success: true, astro });
  } catch (e) {
    console.error("❌ Update Astrologer Error:", e);
    res.status(500).json({ error: e.message });
  }
};

// ✅ Delete astrologer (Admin only)
export const deleteAstrologer = async (req, res) => {
  try {
    const astro = await Astrologer.findById(req.params.id);
    if (!astro) return res.status(404).json({ error: "Astrologer not found" });

    await astro.deleteOne();
    res.json({ success: true, message: "Astrologer deleted" });
  } catch (e) {
    console.error("❌ Delete Astrologer Error:", e);
    res.status(500).json({ error: e.message });
  }
};
