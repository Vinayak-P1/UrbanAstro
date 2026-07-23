import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, Clock, Shield, Sparkles, Tag, CheckCircle2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

const SelectPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [featuredCoupon, setFeaturedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, couponRes] = await Promise.all([
          fetch(`${API}/api/pricing/plans`),
          fetch(`${API}/api/coupons/featured`),
        ]);
        const plansData = await plansRes.json();
        const couponData = await couponRes.json();

        if (plansData.ok && plansData.plans.length > 0) {
          setPlans(plansData.plans);
          // Auto-select the plan with badge, or the last one (premium), or first
          const badgePlan = plansData.plans.find((p) => p.badge);
          setSelected(badgePlan ? badgePlan._id : plansData.plans[plansData.plans.length - 1]._id);
        }

        if (couponData.ok && couponData.coupon) {
          setFeaturedCoupon(couponData.coupon);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyCoupon = () => {
    if (!featuredCoupon) return;
    navigator.clipboard.writeText(featuredCoupon.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleProceed = () => {
    if (!selected) {
      alert("Please select a plan to continue.");
      return;
    }

    const selectedPlan = plans.find((p) => p._id === selected);
    const consultationData = JSON.parse(
      localStorage.getItem("consultationData") || "{}"
    );

    consultationData.plan = selectedPlan.slug || selectedPlan._id;
    consultationData.planName = selectedPlan.name;
    consultationData.planOriginalPrice = selectedPlan.originalPrice;
    consultationData.planPrice = selectedPlan.price;

    // Detect questionCount with regex fallback from features text if missing
    let detectedQCount = selectedPlan.questionCount;
    if (!detectedQCount && selectedPlan.features) {
      for (const f of selectedPlan.features) {
        const match = f.match(/(\d+)\s*(question|q|query|queries)/i);
        if (match) {
          detectedQCount = Number(match[1]);
          break;
        }
      }
    }
    consultationData.planQuestionCount = detectedQCount || 2;

    localStorage.setItem("consultationData", JSON.stringify(consultationData));
    navigate("/select-life-area");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <Tag className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 text-lg">No plans available right now. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen font-display text-gray-200">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-start pt-20 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Step progress */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Step 1 of 4</p>
            <div className="w-full bg-white/[0.08] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-500"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>

          {/* Title */}
          <header className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Choose Your <span className="text-[#7C3AED]">Plan</span>
            </h1>
            <p className="text-white/50 mt-2 text-sm sm:text-base">
              Select the consultation that fits your requirements
            </p>
          </header>

          {/* Plans Grid */}
          <div className={`grid grid-cols-1 ${plans.length > 1 ? "sm:grid-cols-2" : ""} gap-4`}>
            {plans.map((plan) => {
              const isSelected = selected === plan._id;
              return (
                <div
                  key={plan._id}
                  onClick={() => setSelected(plan._id)}
                  className={`ua-card relative cursor-pointer p-6 transition-all duration-300 ${
                    isSelected
                      ? "border-[#7C3AED] bg-white/[0.06] shadow-lg shadow-[#7C3AED]/20 scale-[1.01]"
                      : "hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#7C3AED] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-[#7C3AED]/30 whitespace-nowrap">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <div className="absolute top-5 right-5">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? "border-[#7C3AED] bg-[#7C3AED]"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>

                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-4 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                    </div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {plan.name}
                    </h3>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white/40 line-through text-lg font-medium">
                        ₹{plan.originalPrice}
                      </span>
                      <span className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        ₹{plan.price}
                      </span>
                    </div>
                    {featuredCoupon && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <Tag className="w-3 h-3" /> ₹{featuredCoupon.value} OFF with {featuredCoupon.code}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Proceed button */}
          <div className="mt-8">
            <button
              onClick={handleProceed}
              disabled={!selected}
              className="w-full h-14 ua-btn-primary justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#7C3AED]/25"
            >
              Continue with{" "}
              {selected
                ? plans.find((p) => p._id === selected)?.name
                : "..."}{" "}
              Plan
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
              24hr Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />
              Verified Astrologers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
