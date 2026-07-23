import React from "react";

const OurVision = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#D4AF37]/30 backdrop-blur-md mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <span className="text-xs font-semibold tracking-widest text-[#E8C470] uppercase">
            Our Purpose & Vision
          </span>
        </div>

        <div className="relative p-8 sm:p-14 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-[#D4AF37]/25 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Ambient Lighting Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Empowering Modern Lives
              <br />
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#E8C470] bg-clip-text text-transparent">
                With Ancient Clarity.
              </span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-light">
              We are committed to bridging timeless Vedic astrology with seamless modern technology.
              Our mission is to provide trusted, transparent, and actionable guidance for career decisions,
              relationship clarity, and personal growth—without fear or superstition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVision;