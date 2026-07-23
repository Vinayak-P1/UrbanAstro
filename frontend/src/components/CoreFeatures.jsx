import React from "react";
import { Shield, Users, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Trusted Astrologers",
    description:
      "Our team of experienced astrologers provides accurate and insightful readings.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join a community of like-minded individuals exploring their cosmic paths.",
  },
  {
    icon: Lightbulb,
    title: "Personalized Insights",
    description:
      "Receive personalized guidance based on your unique astrological profile.",
  },
];

const CoreFeatures = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="ua-section-label">
          <span className="dot" />
          <span className="text">Capabilities</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Everything you need.
          <br />
          <span className="text-white/40">Nothing you don't.</span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto">
          Three core pillars. One coherent platform. No noise.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`ua-card p-7 group hover:-translate-y-1 transition-transform duration-300 animate-fade-up animate-fade-up-d${i + 1}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-5">
              <f.icon className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">
              {f.title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreFeatures;