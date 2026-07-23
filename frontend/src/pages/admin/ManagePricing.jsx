import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Eye, EyeOff, Sparkles, Check, DollarSign } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

const ICONS = [
  "auto_awesome", "diamond", "star", "rocket_launch", "workspace_premium",
  "bolt", "favorite", "verified", "local_fire_department", "psychology",
];

const COLOR_PRESETS = [
  { label: "Blue → Indigo", from: "blue-600", to: "indigo-600" },
  { label: "Purple → Pink", from: "purple-600", to: "pink-600" },
  { label: "Emerald → Teal", from: "emerald-600", to: "teal-600" },
  { label: "Amber → Orange", from: "amber-500", to: "orange-500" },
  { label: "Rose → Red", from: "rose-500", to: "red-600" },
  { label: "Cyan → Blue", from: "cyan-500", to: "blue-600" },
];

const emptyPlan = {
  name: "",
  icon: "auto_awesome",
  originalPrice: "",
  price: "",
  questionCount: 2,
  badge: "",
  features: [""],
  colorFrom: "blue-600",
  colorTo: "indigo-600",
  sortOrder: 0,
  active: true,
};

const ManagePricing = () => {
  const token = localStorage.getItem("token");
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null); // null = list view, "new" = create, or plan._id = editing
  const [form, setForm] = useState({ ...emptyPlan });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API}/api/pricing/plans/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setPlans(data.plans);
    } catch (err) {
      console.error("Fetch plans error:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const startCreate = () => {
    setForm({ ...emptyPlan, sortOrder: plans.length });
    setEditing("new");
  };

  const startEdit = (plan) => {
    setForm({
      name: plan.name,
      icon: plan.icon,
      originalPrice: plan.originalPrice,
      price: plan.price,
      questionCount: plan.questionCount || 2,
      badge: plan.badge || "",
      features: plan.features.length > 0 ? [...plan.features] : [""],
      colorFrom: plan.colorFrom,
      colorTo: plan.colorTo,
      sortOrder: plan.sortOrder,
      active: plan.active,
    });
    setEditing(plan._id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ ...emptyPlan });
  };

  const addFeature = () => setForm({ ...form, features: [...form.features, ""] });
  const removeFeature = (idx) => {
    const f = form.features.filter((_, i) => i !== idx);
    setForm({ ...form, features: f.length ? f : [""] });
  };
  const updateFeature = (idx, val) => {
    const f = [...form.features];
    f[idx] = val;
    setForm({ ...form, features: f });
  };

  const handleSave = async () => {
    if (!form.name || !form.originalPrice || !form.price) {
      showMsg("❌ Name, Original Price and Price are required");
      return;
    }

    const cleanFeatures = form.features.filter((f) => f.trim() !== "");
    const payload = {
      ...form,
      originalPrice: Number(form.originalPrice),
      price: Number(form.price),
      questionCount: Number(form.questionCount || 2),
      sortOrder: Number(form.sortOrder),
      features: cleanFeatures,
    };

    try {
      setLoading(true);
      const isNew = editing === "new";
      const url = isNew ? `${API}/api/pricing/plans` : `${API}/api/pricing/plans/${editing}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(isNew ? "✅ Plan created!" : "✅ Plan updated!");
        cancelEdit();
        fetchPlans();
      } else {
        showMsg(`❌ ${data.error || "Failed"}`);
      }
    } catch (err) {
      showMsg("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`${API}/api/pricing/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        showMsg("✅ Plan deleted");
        fetchPlans();
      }
    } catch (err) {
      showMsg("❌ Delete failed");
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      const res = await fetch(`${API}/api/pricing/plans/${plan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !plan.active }),
      });
      const data = await res.json();
      if (data.ok) fetchPlans();
    } catch (err) {
      showMsg("❌ Toggle failed");
    }
  };

  // ===== FORM VIEW =====
  if (editing !== null) {
    return (
      <div className="min-h-screen font-display text-white pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
        {/* ── Glow Blobs ───────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {editing === "new" ? "Create New Plan" : "Edit Plan"}
            </h1>
            <button onClick={cancelEdit} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="ua-card p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Plan Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Starter, Premium"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Original Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="299"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
                />
                <p className="text-[10px] text-white/40 mt-1">Shown as strikethrough</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Selling Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="99"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
                />
                <p className="text-[10px] text-white/40 mt-1">Price shown on payment page</p>
              </div>
            </div>

            {/* Allowed Questions */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Allowed Questions Count *</label>
              <input
                type="number"
                min="1"
                value={form.questionCount}
                onChange={(e) => setForm({ ...form, questionCount: e.target.value })}
                placeholder="2"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              />
              <p className="text-[10px] text-white/40 mt-1">Controls how many question inputs the user gets on checkout</p>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Badge (optional)</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. BEST VALUE ⭐"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Features / Bullet Points</label>
              {form.features.map((f, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={f}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder={`Feature ${idx + 1}`}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-xs text-[#22D3EE] font-semibold hover:underline flex items-center gap-1 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Feature
              </button>
            </div>

            {/* Sort Order & Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#7C3AED] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-white/70">Active (visible to users)</span>
                </label>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-xl text-sm font-medium ${
                  message.includes("✅")
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/20 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full h-12 ua-btn-primary justify-center text-base shadow-lg shadow-[#7C3AED]/25 disabled:opacity-50"
            >
              {loading ? "Saving..." : editing === "new" ? "Create Plan" : "Update Plan"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LIST VIEW =====
  return (
    <div className="min-h-screen font-display text-white pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <div>
            <div className="ua-section-label mb-2">
              <span className="dot" />
              <span className="text">Pricing</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Manage <span className="text-[#7C3AED]">Plans</span>
            </h1>
          </div>
          <button
            onClick={startCreate}
            className="ua-btn-primary py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-medium ${
              message.includes("✅")
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="ua-card p-12 text-center animate-fade-up">
            <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-base">No plans yet. Create your first plan!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`ua-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${
                  plan.active ? "" : "opacity-60 border-red-500/20"
                }`}
              >
                {/* Icon + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="bg-[#7C3AED]/20 text-[#22D3EE] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#7C3AED]/30">
                          {plan.badge}
                        </span>
                      )}
                      {!plan.active && (
                        <span className="bg-red-500/10 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-500/20">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/40 line-through text-sm">₹{plan.originalPrice}</span>
                      <span className="text-white font-extrabold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{plan.price}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1 truncate">
                      {plan.features.length} features · Questions: {plan.questionCount || 2} · Order: {plan.sortOrder}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(plan)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      plan.active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/[0.04] text-white/40 border border-white/[0.06]"
                    }`}
                  >
                    {plan.active ? "Active ✅" : "Hidden 🚫"}
                  </button>
                  <button
                    onClick={() => startEdit(plan)}
                    className="p-2 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePricing;
