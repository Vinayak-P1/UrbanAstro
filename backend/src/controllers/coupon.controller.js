import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const body = req.body;
    const coupon = await Coupon.create({
      code: body.code,
      type: body.type || "flat",
      value: Number(body.value),
      active: body.active ?? true,
      startAt: body.startAt ? new Date(body.startAt) : new Date(),
      endAt: body.endAt ? new Date(body.endAt) : undefined,
      remainingUses: body.remainingUses ?? 999999,
    });
    res.json({ success: true, coupon });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listCoupons = async (req, res) => {
  const items = await Coupon.find().sort({ createdAt: -1 });
  res.json({ items });
};

export const validateCoupon = async (req, res) => {
  try {
    const code = String(req.query.code || req.params.code || "").toUpperCase();
    if (!code) return res.status(400).json({ ok: false, error: "No code" });

    const c = await Coupon.findOne({ code });
    const now = new Date();

    if (
      !c || !c.active ||
      (c.startAt && c.startAt > now) ||
      (c.endAt && c.endAt < now) ||
      (c.remainingUses !== undefined && c.remainingUses <= 0)
    ) {
      return res.json({ ok: false, reason: "invalid_or_inactive" });
    }
    res.json({ ok: true, coupon: c });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const c = await Coupon.findById(id);
    if (!c) return res.status(404).json({ error: "Coupon not found" });

    c.active = !c.active;
    await c.save();
    res.json({ success: true, coupon: c });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
