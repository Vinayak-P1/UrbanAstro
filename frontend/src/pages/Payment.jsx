import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrImg from "../assets/GooglePay_QR.png";

const Payment = () => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [amount, setAmount] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showUtr, setShowUtr] = useState(false);
  const [utrValue, setUtrValue] = useState("");
  const [pricingLoading, setPricingLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "";
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const consultationData = JSON.parse(localStorage.getItem("consultationData") || "{}");

  // Fetch base price from API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${API}/api/pricing`);
        const data = await res.json();
        if (data.ok && data.pricing) {
          const price = data.pricing.basePrice || 149;
          setBasePrice(price);
          setAmount(price);
          setDescription(data.pricing.description || "Expert consultation with experienced astrologer");
        } else {
          setBasePrice(149);
          setAmount(149);
          setDescription("Expert consultation with experienced astrologer");
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
        setBasePrice(149);
        setAmount(149);
        setDescription("Expert consultation with experienced astrologer");
      } finally {
        setPricingLoading(false);
      }
    };
    fetchPricing();
  }, [API]);

  useEffect(() => {
    if (!consultationData?.question) {
      alert("Missing consultation details. Please start again.");
      navigate("/consultation");
    }
  }, []);

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await fetch(`${API}/api/coupons/validate?code=${encodeURIComponent(coupon)}`);
      const data = await res.json();
      if (!data.ok) {
        setApplied(false);
        setAmount(basePrice);
        alert("Invalid or inactive coupon");
        return;
      }
      // compute client preview
      let newAmount = basePrice;
      if (data.coupon.type === "percent") {
        newAmount = Math.max(0, Math.round(basePrice - (basePrice * data.coupon.value) / 100));
      } else {
        newAmount = Math.max(0, basePrice - data.coupon.value);
      }
      setAmount(newAmount);
      setApplied(true);
      alert("Coupon applied!");
    } catch {
      alert("Coupon check failed");
    }
  };

  const handlePayNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    // Show QR code modal inside card
    setShowQR(true);
  };

  const submitUtr = async () => {
    const token = localStorage.getItem("token");
    if (!utrValue.trim()) return alert("Please enter transaction id / UTR");
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/bookings/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...consultationData, couponCode: coupon?.trim() || "", utr: utrValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Manual payment failed");
      alert("Payment submitted for verification. You'll see the consultation in My Bookings.");
      navigate("/my-bookings");
    } catch (e) {
      console.error("Manual submit error:", e);
      alert(e.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-start pt-24 md:pt-28 bg-[#0B0B1A] text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-md border border-white/20 mx-4">
        <h1 className="text-2xl font-bold text-center mb-6">Confirm Your Consultation</h1>

        {pricingLoading ? (
          <div className="text-center py-8 text-gray-400">Loading pricing...</div>
        ) : (
          <div className="space-y-4">
            {/* Description */}
            <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
              {description}
            </div>

            {/* Base Price */}
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-lg">Base Price</span>
              <span className="font-semibold text-lg">₹{basePrice}</span>
            </div>

            {/* Coupon Input */}
            <div className="relative">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="w-full h-12 px-4 rounded-md bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCoupon}
                className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm font-bold"
              >
                Apply
              </button>
            </div>

            {/* Total Payable */}
            <div className="flex justify-between items-center text-lg border-t border-white/10 pt-3">
              <span>Total Payable</span>
              <span className="font-bold text-blue-400">₹{amount}</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={loading}
              className={`w-full h-12 mt-4 rounded-md font-bold ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              } transition-all duration-300`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <p className="text-center text-gray-400 text-sm mt-3">Secure payments — scan QR and submit transaction id</p>

            {showQR && (
              <div className="mt-4 bg-black/20 p-4 rounded">
                <div className="flex flex-col items-center gap-3">
                  <img src={qrImg} alt="Google Pay QR" className="w-40 h-40 object-cover rounded" />
                  <div className="text-sm text-gray-300">Scan this QR with your UPI app and pay ₹{amount}</div>
                  <button onClick={() => setShowUtr(true)} className="bg-blue-500 px-4 py-2 rounded text-white">I've paid</button>

                  {showUtr && (
                    <div className="w-full mt-3">
                      <input value={utrValue} onChange={(e)=>setUtrValue(e.target.value)} placeholder="Enter transaction id / UTR" className="w-full p-3 rounded bg-black/30 border border-white/10" />
                      <button onClick={submitUtr} disabled={loading} className="w-full mt-3 bg-green-600 px-4 py-2 rounded">{loading? 'Submitting...':'Submit Transaction ID'}</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
