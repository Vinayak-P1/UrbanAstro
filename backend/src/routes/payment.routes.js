import express from "express";

const router = express.Router();

// Payments integration removed. Endpoints kept to respond gracefully.
router.post("/create-order", (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
});

router.post("/verify", (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
});

router.post("/webhook", (req, res) => {
  res.status(410).json({ success: false, message: "Payments are currently disabled." });
});

export default router;
