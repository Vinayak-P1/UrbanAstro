import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, ChevronRight } from "lucide-react";

const ReadyToExplore = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleConsultationClick = () => {
    if (!user) {
      navigate("/login", { state: { from: "/consultation" } });
    } else {
      navigate("/consultation");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
      <div className="animate-fade-up">
        <div className="relative p-10 sm:p-16 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-[#D4AF37]/30 text-center shadow-2xl shadow-black/60 overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C3AED]/12 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Ready to Discover{" "}
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#E8C470] bg-clip-text text-transparent">
                Your Future?
              </span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-10 max-w-lg mx-auto font-light">
              Connect with India's top verified astrologers today and receive instant clarity on career, love, and life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleConsultationClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-base transition-all duration-300 shadow-xl shadow-[#7C3AED]/35 hover:shadow-[#D4AF37]/25 border border-[#D4AF37]/30 hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#E8C470] transition-transform group-hover:rotate-12" />
                <span>Reveal Your Celestial Path</span>
              </button>
              <button
                onClick={() => navigate("/astrologers")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white font-semibold text-base border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer"
              >
                <span>Browse Verified Experts</span>
                <ChevronRight className="w-5 h-5 text-[#E8C470]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToExplore;
