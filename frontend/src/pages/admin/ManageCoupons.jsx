import React, { useState, useEffect } from "react";
  const API = import.meta.env.VITE_API_URL || "";

const ManageCoupons = () => {
  const token = localStorage.getItem("token");
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState(""); // 👈 correct name
  const [discount, setDiscount] = useState("");

  // 🔹 Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoupons(data.items || []); // backend returns { items: [...] }
    } catch (err) {
      console.error("Fetch coupons error:", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // 🔹 Add coupon
  const addCoupon = async () => {
    if (!couponCode || !discount) return alert("Please fill both fields");

    try {
      const res = await fetch(`${API}/api/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          value: Number(discount), // correct numeric field
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Coupon added successfully!");
        setCouponCode("");
        setDiscount("");
        fetchCoupons();
      } else {
        alert(data.error || "Failed to add coupon");
      }
    } catch (e) {
      console.error("Add coupon error:", e);
      alert("Server error while adding coupon");
    }
  };

  // 🔹 Toggle active/inactive
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

  return (
    <div className="min-h-screen bg-[#0B0B1A] text-white pt-24 md:pt-28 lg:pt-32 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Manage Coupons</h1>

        <div className="flex gap-3 mb-8">
        <input
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="p-3 bg-white/10 rounded"
        />
        <input
          type="number"
          placeholder="Discount ₹"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="p-3 bg-white/10 rounded"
        />
        <button
          onClick={addCoupon}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold"
        >
          Add
        </button>
      </div>

        <table className="w-full max-w-3xl border border-white/20 rounded-lg">
        <thead>
          <tr className="bg-white/10">
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Value</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} className="border-t border-white/10">
              <td className="p-3">{c.code}</td>
              <td className="p-3">₹{c.value}</td>
              <td className="p-3">{c.active ? "Active ✅" : "Inactive 🚫"}</td>
              <td className="p-3">
                <button
                  onClick={() => toggleCoupon(c._id)}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
