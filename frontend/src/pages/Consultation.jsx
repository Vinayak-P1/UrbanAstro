import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const Consultation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);

  // QR tracking — capture ref parameter from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("urbanastro_ref", ref);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !birthDate || (!birthTime && !unknownTime) || !birthLocation) {
      alert("Please fill all required fields.");
      return;
    }

    // Save consultation data (include ref source)
    const refSource = localStorage.getItem("urbanastro_ref") || "";
    localStorage.setItem(
      "consultationData",
      JSON.stringify({
        name,
        birthDate,
        birthTime: unknownTime ? "" : birthTime,
        birthLocation,
        unknownTime,
        refSource,
      })
    );

    navigate("/select-plan");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-display relative overflow-hidden">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-6 ua-card p-6 sm:p-8 animate-fade-up">
        {/* Step Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-white/40">
            <span>Step 1 of 4</span>
            <span className="text-[#7C3AED]">25%</span>
          </div>
          <div className="w-full bg-white/[0.08] rounded-full h-1.5">
            <div
              className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-500"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Start Your <span className="text-[#7C3AED]">Consultation</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Enter your birth details to begin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7C3AED]" />
                Full Name
              </span>
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g., Nova Stargazer"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
            />
          </div>

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
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
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
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={unknownTime}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm disabled:opacity-40"
            />

            {/* Checkbox for unknown time */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                id="unknown-time-consult"
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="h-4 w-4 rounded accent-[#7C3AED] cursor-pointer"
              />
              <label
                htmlFor="unknown-time-consult"
                className="text-xs text-white/60 cursor-pointer"
              >
                I don't know my birth time
              </label>
            </div>
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
              placeholder="e.g., New York, USA"
              value={birthLocation}
              onChange={(e) => setBirthLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 ua-btn-primary justify-center text-base shadow-lg shadow-[#7C3AED]/25 mt-2"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Consultation;
