import React from "react";

const OurVision = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        <div className="ua-section-label">
          <span className="dot" />
          <span className="text">Our Vision</span>
        </div>

        <div className="ua-card p-8 sm:p-12 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-[#22D3EE]/5 pointer-events-none rounded-[20px]" />

          <div className="relative z-10">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Empowering the Next Generation
              <br />
              <span className="text-[#7C3AED]">with Clarity.</span>
            </h2>

            <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We are committed to making personalized astrological wisdom
              accessible to every young individual. Our vision extends beyond
              predictions: we aim to be the most trusted, affordable digital
              platform that transforms ancient knowledge into actionable, clear
              guidance for your modern life challenges—be it career anxiety,
              relationship stress, or personal growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVision;