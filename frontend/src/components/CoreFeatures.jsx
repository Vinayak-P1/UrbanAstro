import React from "react";
import { ShieldCheck, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Astrologers",
    description:
      "Every astrologer passes multi-tier background audits and accuracy tests before joining.",
  },
  {
    icon: Users,
    title: "Private 1-on-1 Guidance",
    description:
      "Join over 10,000+ users seeking confidential, personalized clarity on love, career, and life.",
  },
  {
    icon: Sparkles,
    title: "Instant Cosmic Insights",
    description:
      "Receive precise Kundli analysis and actionable astrological remedies within minutes.",
  },
];

const CoreFeatures = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#D4AF37]/30 backdrop-blur-md mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <span className="text-xs font-semibold tracking-widest text-[#E8C470] uppercase">
            Core Pillars
          </span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Built for Truth.{" "}
          <span className="text-[#A78BFA]">Designed for Clarity.</span>
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto font-light">
          Experience authentic Vedic wisdom backed by high-speed digital convenience.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`group relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.05] transition-all duration-300 shadow-xl shadow-black/30 hover:-translate-y-1.5 animate-fade-up animate-fade-up-d${i + 1}`}
          >
            {/* Ambient Card Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-2xl group-hover:bg-[#D4AF37]/15 transition-all duration-500 pointer-events-none" />

            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center mb-6 text-[#E8C470] group-hover:border-[#D4AF37]/50 group-hover:scale-110 transition-all">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3 tracking-tight">
              {f.title}
            </h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreFeatures;