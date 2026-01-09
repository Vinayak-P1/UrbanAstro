import Pricing from "../models/Pricing.js";

// Get base pricing
export const getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) {
      pricing = new Pricing({ basePrice: 149 });
      await pricing.save();
    }
    res.json({ ok: true, pricing });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pricing", ok: false });
  }
};

// Update pricing (admin only)
export const updatePricing = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Admin only", ok: false });
    }

    const { basePrice, description } = req.body;

    if (typeof basePrice !== "number" || basePrice < 0) {
      return res.status(400).json({ error: "Invalid base price", ok: false });
    }

    let pricing = await Pricing.findOne();
    if (!pricing) {
      pricing = new Pricing();
    }

    pricing.basePrice = basePrice;
    if (description) pricing.description = description;
    await pricing.save();

    res.json({ ok: true, pricing });
  } catch (err) {
    res.status(500).json({ error: "Failed to update pricing", ok: false });
  }
};
