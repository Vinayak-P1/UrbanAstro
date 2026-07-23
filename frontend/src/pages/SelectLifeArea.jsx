import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Users,
  DollarSign,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const lifeAreas = [
  { icon: Heart, label: "Love" },
  { icon: GraduationCap, label: "Education" },
  { icon: Briefcase, label: "Job" },
  { icon: TrendingUp, label: "Career" },
  { icon: Users, label: "Relationship" },
  { icon: DollarSign, label: "Money" },
  { icon: HeartHandshake, label: "Marriage" },
  { icon: Sparkles, label: "Wealth" },
];

const SelectLifeArea = () => {
  const [selected, setSelected] = useState([]);
  const [maxSelections, setMaxSelections] = useState(2);
  const navigate = useNavigate();

  const consultationData = JSON.parse(localStorage.getItem("consultationData") || "{}");

  // Dynamically calculate maxSelections based on the plan allowed questions count
  useEffect(() => {
    if (!consultationData?.plan) {
      alert("Please select a plan first.");
      navigate("/select-plan");
      return;
    }

    const qCount = Number(consultationData.planQuestionCount || 2);
    // Formula: 2 questions -> 2 areas; 4 questions -> 3 areas; 5 questions -> 4 areas, etc.
    const maxSel = qCount <= 2 ? 2 : qCount - 1;
    setMaxSelections(maxSel);

    // If there were already selected areas in storage, load them
    if (consultationData.selectedLifeAreas) {
      setSelected(consultationData.selectedLifeAreas.slice(0, maxSel));
    }
  }, []);

  const toggleSelection = (label) => {
    if (selected.includes(label)) {
      setSelected(selected.filter((item) => item !== label));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, label]);
    } else {
      alert(`Based on your chosen plan, you can select up to ${maxSelections} life areas.`);
    }
  };

  const handleProceed = () => {
    if (selected.length === 0) {
      alert("Please select at least 1 life area to continue.");
      return;
    }

    // Save selected areas to localStorage
    consultationData.selectedLifeAreas = selected;
    localStorage.setItem("consultationData", JSON.stringify(consultationData));
    navigate("/ask-question");
  };

  return (
    <div className="relative flex flex-col min-h-screen font-display text-gray-200">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-start pt-20 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Step progress bar */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Step 2 of 4</p>
            <div className="w-full bg-white/[0.08] rounded-full h-1.5 mt-2">
              <div
                className="bg-[#7C3AED] h-1.5 rounded-full transition-all duration-500"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Title */}
          <header className="text-center mb-8 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Choose Your <span className="text-[#7C3AED]">Life Areas</span>
            </h1>
            <p className="text-white/50 mt-2 text-sm sm:text-base">
              Select up to <strong className="text-[#22D3EE] font-semibold">{maxSelections}</strong> areas you want astrological guidance on.
            </p>
          </header>

          {/* Options grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {lifeAreas.map((area) => {
              const IconComponent = area.icon;
              const isSelected = selected.includes(area.label);
              return (
                <div
                  key={area.label}
                  onClick={() => toggleSelection(area.label)}
                  className={`ua-card p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${
                    isSelected
                      ? "border-[#7C3AED] bg-white/[0.06] shadow-lg shadow-[#7C3AED]/20 scale-[1.03]"
                      : "hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                        : "bg-white/[0.06] text-white/50"
                    } mb-3`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-center text-sm text-white">
                    {area.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prompt Selection Info */}
          <div className="text-center text-xs text-white/40 mt-6">
            Selected: <span className="text-white font-semibold">{selected.length}</span> of <span className="text-white font-semibold">{maxSelections}</span> allowed areas
          </div>

          {/* Proceed button */}
          <div className="mt-8">
            <button
              onClick={handleProceed}
              disabled={selected.length === 0}
              className="w-full h-14 ua-btn-primary justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#7C3AED]/25"
            >
              <span>Proceed to Ask Questions</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLifeArea;
