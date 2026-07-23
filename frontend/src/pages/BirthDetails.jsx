import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const BirthDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    unknownTime: false,
  });

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // Check if birth details already exist
    const existingData = JSON.parse(localStorage.getItem("birthDetails") || "{}");
    if (existingData.birthDate) {
      setFormData(existingData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save birth details
    localStorage.setItem("birthDetails", JSON.stringify(formData));

    // Get selected areas from previous step
    const selectedAreas = JSON.parse(
      localStorage.getItem("selectedLifeAreas") || "[]"
    );

    // Get user data
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Save complete consultation data
    localStorage.setItem(
      "consultationData",
      JSON.stringify({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        ...formData,
        selectedLifeAreas: selectedAreas,
      })
    );

    // Navigate to ask question
    navigate("/ask-question");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 ua-card p-6 sm:p-8 animate-fade-up">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-white/40">
            <span>Step 3 of 4</span>
            <span className="text-[#7C3AED]">75%</span>
          </div>
          <div className="w-full bg-white/[0.08] rounded-full h-1.5">
            <div
              className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-500"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold text-center text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Birth <span className="text-[#7C3AED]">Details</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                Birth Date
              </span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required={true}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                Birth Time
              </span>
            </label>
            <input
              type="time"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              required={!formData.unknownTime}
              disabled={formData.unknownTime}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all disabled:opacity-40"
            />
          </div>

          {/* Unknown Time Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="unknownTime"
              name="unknownTime"
              checked={formData.unknownTime}
              onChange={handleChange}
              className="h-4 w-4 rounded accent-[#7C3AED] cursor-pointer"
            />
            <label htmlFor="unknownTime" className="text-sm text-white/70 cursor-pointer">
              I don't know my birth time
            </label>
          </div>

          {/* Birth Location */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                Birth Location
              </span>
            </label>
            <input
              type="text"
              name="birthLocation"
              value={formData.birthLocation}
              onChange={handleChange}
              required={true}
              placeholder="City, State"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 ua-btn-primary justify-center text-base shadow-lg shadow-[#7C3AED]/25"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BirthDetails;