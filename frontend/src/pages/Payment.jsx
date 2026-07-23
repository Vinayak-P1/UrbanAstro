import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrImg from "../assets/GooglePay_QR.png";
import { Tag, Check, CheckCircle2, Lock, Clock, ShieldCheck, QrCode, Smartphone, UploadCloud, X, CreditCard, Sparkles, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";
const UPI_ID = import.meta.env.VITE_UPI_ID || "urbanastro@paytm";

const Payment = () => {
  const navigate = useNavigate();

  // Selected Plan Info from localStorage
  const [planName, setPlanName] = useState("");
  const [planSlug, setPlanSlug] = useState("");
  
  // Pricing states
  const [baseAmount, setBaseAmount] = useState(0); // Selected plan's originalPrice
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  
  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [featuredCoupon, setFeaturedCoupon] = useState(null);

  // UTR & Screenshot Verification Section Visibility Toggle
  const [showVerification, setShowVerification] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Verification form states
  const [utrValue, setUtrValue] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultationData = JSON.parse(localStorage.getItem("consultationData") || "{}");

  // Load plan details from localStorage & fetch featured coupon
  useEffect(() => {
    if (!consultationData?.question) {
      alert("Missing consultation details. Please start again.");
      navigate("/consultation");
      return;
    }

    const planOriginal = Number(consultationData.planOriginalPrice || 299);
    const planNameStr = consultationData.planName || "Starter";
    const slugStr = consultationData.plan || "starter";

    setPlanName(planNameStr);
    setPlanSlug(slugStr);
    setBaseAmount(planOriginal);
    setFinalAmount(planOriginal);

    // Fetch featured coupon from backend
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API}/api/coupons/featured`);
        const data = await res.json();
        if (data.ok && data.coupon) {
          setFeaturedCoupon(data.coupon);
          setCouponCodeInput(data.coupon.code); // Prefill coupon input
        }
      } catch (err) {
        console.error("Fetch featured coupon error:", err);
      }
    };
    fetchFeatured();
  }, []);

  // Recalculate coupon when baseAmount or coupon changes
  const applyCoupon = async (codeToApply = couponCodeInput) => {
    const code = String(codeToApply || "").trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");
    setCouponSuccess("");

    // Custom local coupon validation
    if (code === "RAJU50") {
      setDiscount(50);
      setFinalAmount(Math.max(0, baseAmount - 50));
      setAppliedCoupon("RAJU50");
      setCouponSuccess("Coupon 'RAJU50' applied successfully! ₹50 OFF");
      return;
    }

    try {
      const res = await fetch(`${API}/api/coupons/validate?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!data.ok) {
        setCouponError(data.reason === "invalid_or_inactive" ? "Coupon code is invalid or expired" : "Invalid coupon code");
        setDiscount(0);
        setFinalAmount(baseAmount);
        setAppliedCoupon("");
        return;
      }

      let disc = 0;
      if (data.coupon.type === "percent") {
        disc = Math.round((baseAmount * data.coupon.value) / 100);
      } else {
        disc = data.coupon.value || 0;
      }

      setDiscount(disc);
      setFinalAmount(Math.max(0, baseAmount - disc));
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon '${code}' applied! ₹${disc} discount.`);
    } catch (err) {
      setCouponError("Failed to validate coupon. Try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setFinalAmount(baseAmount);
    setAppliedCoupon("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // Submit manual verification details
  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (finalAmount > 0) {
      if (!utrValue.trim() || utrValue.trim().length < 6) {
        alert("Please enter a valid Transaction ID / UTR number (at least 6 digits)");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", consultationData.name || "");
      formData.append("email", consultationData.email || "");
      formData.append("birthDate", consultationData.birthDate || "");
      formData.append("birthTime", consultationData.birthTime || "");
      formData.append("birthLocation", consultationData.birthLocation || "");
      formData.append("unknownTime", consultationData.unknownTime || false);
      formData.append("question", consultationData.question || "");
      formData.append("couponCode", appliedCoupon || "");
      formData.append("utr", finalAmount === 0 ? "FREE" : utrValue.trim());
      formData.append("plan", planSlug);
      if (consultationData.refSource) {
        formData.append("refSource", consultationData.refSource);
      }
      if (consultationData.selectedLifeAreas) {
        formData.append("selectedLifeAreas", JSON.stringify(consultationData.selectedLifeAreas));
      }
      if (finalAmount > 0 && screenshotFile) {
        formData.append("screenshot", screenshotFile);
      }

      const res = await fetch(`${API}/api/bookings/manual`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification submission failed");
      
      if (finalAmount === 0) {
        alert("Your order has been confirmed successfully! The astrologer will start working on your report shortly.");
      } else {
        alert("Payment details submitted successfully! The admin will verify your payment details and screenshot to approve your report shortly.");
      }
      navigate("/my-bookings");
    } catch (err) {
      console.error("Submit verification error:", err);
      alert(err.message || "Submission failed. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const upiIntentLink = `upi://pay?pa=${UPI_ID}&pn=UrbanAstro&am=${finalAmount}&cu=INR`;

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-12 relative overflow-hidden font-display">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-4">
        {/* Step Progress */}
        <div className="w-full space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-white/40">
            <span>Checkout</span>
            <span className="text-[#7C3AED]">Final Step</span>
          </div>
          <div className="w-full bg-white/[0.08] rounded-full h-1.5 mt-1">
            <div className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Card Container */}
        <div className="ua-card p-6 sm:p-8 animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1 text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Checkout & <span className="text-[#7C3AED]">Pay</span>
          </h1>
          <p className="text-center text-white/50 text-sm mb-6"><strong className="text-white">{planName}</strong> Plan selected</p>

          <div className="space-y-6">
            {/* Promo Code Input & Logic */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. RAJU50, URBAN200"
                  disabled={!!appliedCoupon}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm h-11"
                />
                {appliedCoupon ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-500/20 transition-all whitespace-nowrap"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => applyCoupon()}
                    className="ua-btn-primary py-2.5 text-sm"
                  >
                    Apply
                  </button>
                )}
              </div>
              {/* Promo validation feedback alerts */}
              {couponError && <p className="text-xs text-red-400 mt-2 font-medium">❌ {couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-400 mt-2 font-medium">✅ {couponSuccess}</p>}

              {/* Quick Featured Coupon Selector Chip */}
              {featuredCoupon && !appliedCoupon && (
                <button
                  onClick={() => applyCoupon(featuredCoupon.code)}
                  className="mt-3 flex items-center justify-between w-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl transition-all"
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Apply featured coupon <strong>{featuredCoupon.code}</strong> to save ₹{featuredCoupon.value}
                  </span>
                  <span className="underline font-bold">Apply</span>
                </button>
              )}
            </div>

            {/* Price Overview Table */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between items-center text-sm text-white/60">
                <span>Selected Plan: <strong className="text-white font-medium">{planName}</strong></span>
                <span className="font-semibold text-white">₹{baseAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-sm text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-white/[0.06] pt-2.5 text-base sm:text-lg">
                <span className="font-semibold">Total Payable</span>
                <span className="font-extrabold text-[#22D3EE]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{finalAmount}</span>
              </div>
            </div>

            {finalAmount === 0 ? (
              <form onSubmit={handleVerifyPayment} className="space-y-4 pt-4 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 ua-btn-primary justify-center text-lg shadow-lg shadow-[#7C3AED]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirming Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm & Submit Booking
                    </>
                  )}
                </button>
              </form>
            ) : (
              <>
                {/* Direct UPI Intent Link / Pay Button */}
                <div className="space-y-3.5">
                  {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-white/50 mb-1.5 text-center">📱 Select your UPI App (For iPhone users):</p>
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={`phonepe://pay?pa=${UPI_ID}&pn=UrbanAstro&am=${finalAmount}&cu=INR`}
                          className="flex flex-col items-center justify-center py-3 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-xl transition-all text-center text-xs font-bold text-white/80"
                        >
                          <Smartphone className="w-4 h-4 mb-1 text-[#7C3AED]" />
                          PhonePe
                        </a>
                        <a
                          href={`gpay://upi/pay?pa=${UPI_ID}&pn=UrbanAstro&am=${finalAmount}&cu=INR`}
                          className="flex flex-col items-center justify-center py-3 bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 rounded-xl transition-all text-center text-xs font-bold text-white/80"
                        >
                          <Smartphone className="w-4 h-4 mb-1 text-[#22D3EE]" />
                          GPay
                        </a>
                        <a
                          href={`paytmmp://pay?pa=${UPI_ID}&pn=UrbanAstro&am=${finalAmount}&cu=INR`}
                          className="flex flex-col items-center justify-center py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all text-center text-xs font-bold text-white/80"
                        >
                          <Smartphone className="w-4 h-4 mb-1 text-blue-400" />
                          Paytm
                        </a>
                      </div>
                      <a
                        href={upiIntentLink}
                        className="flex items-center justify-center gap-2 w-full py-3 ua-btn-ghost text-sm text-center mt-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        Other UPI / WhatsApp Pay
                      </a>
                    </div>
                  ) : (
                    <>
                      <a
                        href={upiIntentLink}
                        className="flex items-center justify-center gap-2.5 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] text-center"
                      >
                        <Smartphone className="w-5 h-5" />
                        Pay ₹{finalAmount} via UPI App
                      </a>
                      <p className="text-xs text-center text-white/40">
                        📱 Recommended for mobile users (Opens GPay, PhonePe, Paytm, BHIM directly).
                      </p>
                    </>
                  )}
                </div>

                {/* QR Payment toggle button */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="w-full py-3 ua-btn-ghost justify-center text-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    {showQR ? "Hide QR Code" : "Pay via QR (Preferred for desktop/laptop users)"}
                  </button>
                  
                  {showQR && (
                    <div className="flex flex-col items-center justify-center p-5 border border-white/[0.08] bg-white/[0.02] rounded-xl transition-all duration-300">
                      <p className="text-xs font-semibold text-white/50 mb-3">Scan with any UPI App on your phone</p>
                      <img src={qrImg} alt="UPI Payment QR" className="w-44 h-44 object-contain rounded-xl border border-white/10 bg-white p-2 shadow-lg" />
                      <p className="text-base font-bold text-white mt-3">Pay ₹{finalAmount}</p>
                    </div>
                  )}
                </div>

                {/* I've Paid action button to show verification details */}
                {!showVerification && (
                  <div className="border-t border-white/[0.06] pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowVerification(true)}
                      className="px-6 py-3 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#22D3EE] font-bold rounded-xl text-sm transition-all"
                    >
                      👉 Click here after paying (I've Paid)
                    </button>
                  </div>
                )}

                {/* UTR & Screenshot Verification Form (Appears when user clicks "I've Paid") */}
                {showVerification && (
                  <form onSubmit={handleVerifyPayment} className="border-t border-white/[0.06] pt-5 space-y-4 transition-all duration-500">
                    <h3 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
                      Verify Payment (After Paying)
                    </h3>
                    
                    {/* UTR Input */}
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                        12-Digit Transaction ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        value={utrValue}
                        onChange={(e) => setUtrValue(e.target.value.replace(/[^0-9]/g, "").substring(0, 12))}
                        placeholder="Enter 12-digit payment reference number"
                        required
                        className="w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white font-mono placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
                      />
                    </div>

                    {/* Payment Screenshot File Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                        Upload Payment Screenshot *
                      </label>
                      <div className="flex flex-col items-center justify-center bg-white/[0.04] border border-dashed border-white/[0.15] rounded-xl p-4 transition hover:border-white/30 relative">
                        {screenshotPreview ? (
                          <div className="w-full flex items-center gap-3">
                            <img src={screenshotPreview} alt="Screenshot Preview" className="w-12 h-12 rounded-lg object-cover border border-white/25" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{screenshotFile?.name}</p>
                              <p className="text-[10px] text-white/40">{(screenshotFile?.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-2">
                            <UploadCloud className="w-6 h-6 text-white/40 mb-1" />
                            <span className="text-xs font-semibold text-white/70">Choose Screenshot Image</span>
                            <span className="text-[10px] text-white/40 mt-0.5">JPEG, PNG, or WebP</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              required
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Submit Details Verification */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 ua-btn-primary justify-center text-sm shadow-lg shadow-[#7C3AED]/25 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Proof...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          Submit Verification Details
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
