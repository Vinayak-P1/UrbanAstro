// src/pages/HomePage.js (Aapka final Home Page)

import React, { useEffect } from 'react';

import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import CoreFeatures from '../components/CoreFeatures';
import WhyChooseUs from '../components/WhyChooseUs';
import OurVision from '../components/OurVision';
import ReadytoExplore from '../components/ReadytoExplore';

const HomePage = () => {
    useEffect(() => {
        document.title = "UrbanAstro — Your Stars, Your City";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "UrbanAstro — Expert astrology consultation starting at ₹99. Get personalized Kundli, life guidance & astrologer calls. Your Stars, Your City.");
        }
    }, []);

    // Note: The global CSS styles and scripts (Tailwind config, font links) 
    // must be included in your main index.html or global styles file.

    return (
        
        <div className="flex flex-col">
                <HeroSection />
                <CoreFeatures />
                <WhyChooseUs />
                <OurVision /> 
                <ReadytoExplore />
            <Footer />
        </div>
    );
};

export default HomePage;
