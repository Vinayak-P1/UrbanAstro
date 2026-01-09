import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BirthDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    unknownTime: false,
  });

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // Check if birth details already exist
    const existingData = JSON.parse(localStorage.getItem("birthDetails") || "{}");
    if (existingData.birthDate) {
      setFormData(existingData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save birth details
    localStorage.setItem("birthDetails", JSON.stringify(formData));
    
    // Get selected areas from previous step
    const selectedAreas = JSON.parse(localStorage.getItem("selectedLifeAreas") || "[]");
    
    // Get user data
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Save complete consultation data
    localStorage.setItem("consultationData", JSON.stringify({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      ...formData,
      selectedLifeAreas: selectedAreas,
    }));

    // Navigate to ask question
    navigate("/ask-question");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-200/20">
        {/* Progress bar */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Step 3 of 5</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">Birth Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required={true}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-300/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Birth Time</label>
            <input
              type="time"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              required={!formData.unknownTime}
              disabled={formData.unknownTime}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-300/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="unknownTime"
              checked={formData.unknownTime}
              onChange={handleChange}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm">
              I don't know my birth time
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Birth Location</label>
            <input
              type="text"
              name="birthLocation"
              value={formData.birthLocation}
              onChange={handleChange}
              required={true}
              placeholder="City, State"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-300/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default BirthDetails;