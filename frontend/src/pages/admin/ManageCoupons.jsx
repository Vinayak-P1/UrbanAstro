import React, { useState, useEffect } from "react";
import { Tag, Plus, Star, Check, Trash2, Ticket, CheckCircle2, XCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

const ManageCoupons = () => {
  const token = localStorage.getItem("token");
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("flat");
  const [maxUses, setMaxUses] = useState("");

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoupons(data.items || []);
    } catch (err) {
      console.error("Fetch coupons error:", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Add coupon
  const addCoupon = async () => {
    if (!couponCode || !discount) return alert("Please fill code and discount");

    try {
      const res = await fetch(`${API}/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          type: discountType,
          value: Number(discount),
          remainingUses: maxUses ? Number(maxUses) : 999999,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Coupon added successfully!");
        setCouponCode("");
        setDiscount("");
        setMaxUses("");
        fetchCoupons();
      } else {
        alert(data.error || "Failed to add coupon");
      }
    } catch (e) {
      console.error("Add coupon error:", e);
      alert("Server error while adding coupon");
    }
  };

  // Toggle active/inactive
  const toggleCoupon = async (id) => {
    try {
      const res = await fetch(`${API}/api/coupons/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error("Toggle error:", e);
    }
  };

  // Toggle featured
  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`${API}/api/coupons/${id}/feature`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error("Featured toggle error:", e);
    }
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`${API}/api/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  return (
    <div className="min-h-screen font-display text-white pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-6 animate-fade-up">
          <div className="ua-section-label mb-3">
            <span className="dot" />
            <span className="text">Promotions</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Manage <span className="text-[#7C3AED]">Coupons</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Mark one coupon as <span className="text-amber-400 font-semibold">⭐ Featured</span> to show
            it on the plan selection banner and pre-fill it on the payment page.
          </p>
        </div>

        {/* Add Coupon Form */}
        <div className="ua-card p-6 mb-8 animate-fade-up">
          <h2
            className="text-lg font-bold text-white mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Plus className="w-5 h-5 text-[#7C3AED]" />
            Add New Coupon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm w-full font-mono uppercase"
            />
            <input
              type="number"
              placeholder="Discount Value"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm w-full"
            />
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-3 text-white outline-none text-sm w-full cursor-pointer"
            >
              <option value="flat" className="bg-[#0b1022]">₹ Flat</option>
              <option value="percent" className="bg-[#0b1022]">% Off</option>
            </select>
            <input
              type="number"
              placeholder="Max Uses (default: unlimited)"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm w-full"
            />
            <button
              onClick={addCoupon}
              className="ua-btn-primary justify-center text-sm py-3 w-full"
            >
              <Plus className="w-4 h-4" />
              Add Coupon
            </button>
          </div>
        </div>

        {/* Coupons Table / Mobile Cards */}
        {coupons.length === 0 ? (
          <div className="ua-card p-12 text-center animate-fade-up">
            <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-base">No coupons created yet</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-white/[0.08] rounded-xl overflow-hidden ua-card">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/[0.06]">
                    <th className="p-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Code</th>
                    <th className="p-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Discount</th>
                    <th className="p-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Uses Left</th>
                    <th className="p-3.5 text-center text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                    <th className="p-3.5 text-center text-xs font-semibold text-white/50 uppercase tracking-wider">
                      <span className="text-amber-400">⭐ Featured</span>
                    </th>
                    <th className="p-3.5 text-center text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-white text-sm tracking-wider">{c.code}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-400 font-bold text-sm">
                          {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                        </span>
                        <span className="text-white/30 text-xs ml-1">
                          ({c.type === "percent" ? "percent" : "flat"})
                        </span>
                      </td>
                      <td className="p-3.5 text-white/70 text-sm">
                        {c.remainingUses >= 999999 ? "∞" : c.remainingUses}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleCoupon(c._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            c.active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {c.active ? "Active ✅" : "Inactive 🚫"}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleFeatured(c._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            c.featured
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70"
                          }`}
                        >
                          {c.featured ? "⭐ Featured" : "Set Featured"}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => deleteCoupon(c._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
              {coupons.map((c) => (
                <div
                  key={c._id}
                  className={`ua-card p-4 space-y-3.5 transition-all ${
                    c.featured ? "border-amber-500/40 shadow-lg shadow-amber-500/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white tracking-wider text-base">
                      {c.code}
                    </span>
                    <span className="text-emerald-400 font-extrabold text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/[0.06] pt-2.5">
                    <span>Type: <strong className="text-white/70">{c.type === "percent" ? "Percentage" : "Flat Amount"}</strong></span>
                    <span>Uses Left: <strong className="text-white/70">{c.remainingUses >= 999999 ? "Unlimited" : c.remainingUses}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleCoupon(c._id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                        c.active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {c.active ? "Active ✅" : "Inactive 🚫"}
                    </button>

                    <button
                      onClick={() => toggleFeatured(c._id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 ${
                        c.featured
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-white/[0.04] text-white/40 border border-white/[0.06]"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      {c.featured ? "Featured" : "Feature"}
                    </button>

                    <button
                      onClick={() => deleteCoupon(c._id)}
                      className="p-2 rounded-xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="mt-6 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl p-4">
          <p className="text-[#22D3EE] text-xs leading-relaxed">
            <strong className="text-white">⭐ Featured Coupon Info:</strong> The featured coupon appears
            automatically on the plan selection page as a promotional banner and pre-fills on the
            payment page. Only ONE coupon can be featured at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
