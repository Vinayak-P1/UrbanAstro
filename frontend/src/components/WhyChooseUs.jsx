import React from "react";
import { Clock, Wallet, HeartHandshake } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Instant 24/7 Consultations",
    description:
      "Connect with live astrologers on-demand or receive detailed written reports within hours.",
  },
  {
    icon: Wallet,
    title: "Transparent & Fair Pricing",
    description:
      "No hidden fees or unexpected charges. Pay only for the exact minutes or consultations you choose.",
  },
  {
    icon: HeartHandshake,
    title: "100% Confidentiality Guarantee",
    description:
      "Your personal details, birth charts, and conversations remain completely encrypted and private.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#D4AF37]/30 backdrop-blur-md mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <span className="text-xs font-semibold tracking-widest text-[#E8C470] uppercase">
            The UrbanAstro Advantage
          </span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Why Thousands Trust <span className="text-[#A78BFA]">UrbanAstro</span>
        </h2>
      </div>

      {/* Reason Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((r, i) => (
          <div
            key={r.title}
            className={`group relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.05] transition-all duration-300 shadow-xl shadow-black/30 flex flex-col items-start gap-4 hover:-translate-y-1.5 animate-fade-up animate-fade-up-d${i + 1}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#E8C470] group-hover:border-[#D4AF37]/50 group-hover:scale-110 transition-all">
              <r.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{r.title}</h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;