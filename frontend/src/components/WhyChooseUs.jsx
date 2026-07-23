import React from "react";
import { Clock, Wallet, HeartHandshake } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Timely Guidance",
    description:
      "Receive your personalized reading within 24 hours of your request.",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    description:
      "Access high-quality astrology services at prices accessible to students and young professionals.",
  },
  {
    icon: HeartHandshake,
    title: "Empowering Community",
    description:
      "Connect with others on a similar journey of self-discovery and cosmic exploration.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="ua-section-label">
          <span className="dot" />
          <span className="text">Why Us</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Why Choose UrbanAstro?
        </h2>
      </div>

      {/* Reason Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reasons.map((r, i) => (
          <div
            key={r.title}
            className={`ua-card ua-card-hover p-7 flex flex-col items-start gap-4 animate-fade-up animate-fade-up-d${i + 1}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
              <r.icon className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h3 className="text-xl font-bold text-white">{r.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;