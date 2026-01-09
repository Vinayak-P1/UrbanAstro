import React from "react";
import { Link } from "react-router-dom";

const Btn = ({ to, children }) => (
  <Link
    to={to}
    className="inline-block px-6 py-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/12 transition text-lg font-medium shadow-md"
  >
    {children}
  </Link>
);

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0B0B1A] text-white pt-24 md:pt-28 lg:pt-32 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Admin Dashboard</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Manage astrologers, coupons, pricing, and user reports from here.
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <Btn to="/admin/astrologers">Manage Astrologers</Btn>
          <Btn to="/admin/coupons">Manage Coupons</Btn>
          <Btn to="/admin/pricing">Manage Pricing</Btn>
          <Btn to="/admin/bookings">User Reports / Bookings</Btn>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
