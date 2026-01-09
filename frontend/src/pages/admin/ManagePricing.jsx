import React, { useState, useEffect } from "react";

const ManagePricing = () => {
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("token");

  // Fetch current pricing
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${API}/api/pricing`);
        const data = await res.json();
        if (data.ok && data.pricing) {
          setBasePrice(data.pricing.basePrice);
          setDescription(data.pricing.description || "");
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
      }
    };
    fetchPricing();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!basePrice || isNaN(basePrice) || basePrice < 0) {
      setMessage("Please enter a valid base price");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/pricing/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          basePrice: parseFloat(basePrice),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage("✅ Pricing updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.error || "Failed to update pricing"}`);
      }
    } catch (err) {
      setMessage("❌ Error updating pricing");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B1A] text-white pt-24 md:pt-28 lg:pt-32 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Manage Pricing</h1>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Base Price */}
            <div>
              <label className="block text-lg font-semibold mb-2">Base Consultation Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter base price"
              />
              <p className="text-gray-400 text-sm mt-2">
                This is the default price charged for consultations
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="Service description shown to users"
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("✅") 
                  ? "bg-green-500/20 border border-green-500/50 text-green-300" 
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {loading ? "Updating..." : "Update Pricing"}
            </button>
          </form>

          {/* Current Info */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold mb-4">Current Pricing</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                <span className="font-semibold text-white">Base Price:</span> ₹{basePrice || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-white">Description:</span> {description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePricing;
