// src/routes/astrologer.routes.js
import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  createAstrologer,
  listAstrologers,
  getAstrologerById,
  updateAstrologer,
  deleteAstrologer,
} from "../controllers/astrologer.controller.js";
import { imageUpload } from "../middleware/upload.js";

const router = Router();

// ✅ Public - list astrologers
router.get("/", listAstrologers);

// ✅ Get single astrologer
router.get("/:id", getAstrologerById);

// ✅ Admin - create new astrologer
router.post("/", protect, adminOnly, imageUpload.single("image"), createAstrologer);

// ✅ Admin - update astrologer
router.put("/:id", protect, adminOnly, imageUpload.single("image"), updateAstrologer);

// ✅ Admin - delete astrologer
router.delete("/:id", protect, adminOnly, deleteAstrologer);

export default router;
