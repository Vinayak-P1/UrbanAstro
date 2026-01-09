// src/pages/HomePage.js (Aapka final Home Page)

import React from 'react';

import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import CoreFeatures from '../components/CoreFeatures';
import WhyChooseUs from '../components/WhyChooseUs';
import OurVision from '../components/OurVision';
import ReadytoExplore from '../components/ReadytoExplore';

const HomePage = () => {
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
