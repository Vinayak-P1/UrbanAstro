// src/routes/booking.routes.js
import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  checkout,
  myBookings,
  listAll,
  uploadReport,
  viewReport,
} from "../controllers/booking.controller.js";
import { submitManualPayment, approveBooking, disapproveBooking } from "../controllers/booking.controller.js";
import { pdfUpload } from "../middleware/upload.js";

const router = Router();

// user bookings and payments
router.post("/checkout", protect, checkout);
// Manual QR payment: user submits UTR after scanning QR
router.post("/manual", protect, submitManualPayment);
router.get("/me", protect, myBookings);

// Admin approve/disapprove
router.put("/:id/approve", protect, adminOnly, approveBooking);
router.put("/:id/disapprove", protect, adminOnly, disapproveBooking);

// admin list and upload
router.get("/admin/all", protect, adminOnly, listAll);
router.post(
  "/:bookingId/report/upload",
  protect,
  adminOnly,
  pdfUpload.single("file"),
  uploadReport
);

// view/download report
router.get("/report/view/:bookingId", viewReport);

export default router;
