import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import BlockchainSection from '../components/landing/BlockchainSection';
import AISection from '../components/landing/AISection';
import DeveloperSection from '../components/landing/DeveloperSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; }
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <BlockchainSection />
      <AISection />
      <DeveloperSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;