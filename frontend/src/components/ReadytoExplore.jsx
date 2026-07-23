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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="animate-fade-up">
        <div className="ua-card p-10 sm:p-12 text-center relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-[#22D3EE]/5 pointer-events-none rounded-[20px]" />

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Ready to Know
              <br />
              <span className="text-[#7C3AED]">Your Future?</span>
            </h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Start with a personalized consultation. Expert astrologers are
              ready to guide you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleConsultationClick}
                className="ua-btn-primary text-base px-8 py-4"
              >
                <Sparkles className="w-4 h-4" />
                Reveal Your Celestial Path
              </button>
              <button
                onClick={() => navigate("/astrologers")}
                className="ua-btn-ghost text-base px-8 py-4"
              >
                Browse Experts
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToExplore;
