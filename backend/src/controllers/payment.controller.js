import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";

// 🔹 Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

// 🔹 Verify Payment (called from frontend)


export const verifyPayment = async (req, res) => {
  try {
    console.log("====== 🔍 PAYMENT VERIFY DEBUG START ======");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log("🧾 Body received from frontend:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("❌ Missing required fields from frontend");
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    console.log("🧩 Using key secret:", process.env.RAZORPAY_KEY_SECRET);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Signature verified successfully!");
      console.log("====== ✅ PAYMENT VERIFY DEBUG END ======");
      return res.status(200).json({ success: true });
    } else {
      console.log("❌ Signature mismatch!");
      console.log("====== ❌ PAYMENT VERIFY DEBUG END ======");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("🔥 Error in verification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Webhook for Razorpay dashboard events
export const webhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret)
      return res.status(500).json({ error: "Missing webhook secret in env" });

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (expected !== signature)
      return res.status(400).json({ error: "Invalid signature" });

    const event = req.body;

    // Handle successful payments
    if (event.event === "payment.captured") {
      const orderId = event.payload.payment.entity.order_id;
      const paymentId = event.payload.payment.entity.id;

      const booking = await Booking.findOne({ orderId });
      if (booking) {
        booking.status = "paid";
        booking.paymentId = paymentId;
        await booking.save();
      }
    }

    // Handle failed payments
    if (event.event === "payment.failed") {
      const orderId = event.payload.payment.entity.order_id;
      const booking = await Booking.findOne({ orderId });
      if (booking) {
        booking.status = "failed";
        await booking.save();
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
