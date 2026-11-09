const fs = require('fs');
const path = require('path');

const dir = '/home/hamza/Documents/FinLedger AI/finledger-frontend/src';

const files = {
  'pages/LandingPage.jsx': `
import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import BlockchainSection from '../components/landing/BlockchainSection';
import AISection from '../components/landing/AISection';
import TeamSection from '../components/landing/TeamSection';
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
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
`,
  'components/landing/Navbar.jsx': `
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', to: 'features' },
    { name: 'How It Works', to: 'how-it-works' },
    { name: 'Blockchain', to: 'blockchain' },
    { name: 'AI', to: 'ai' },
    { name: 'Team', to: 'team' }
  ];

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={\`fixed w-full z-50 transition-all duration-300 \${scrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'}\`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Link2 className="text-indigo-500" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">FinLedger <span className="text-indigo-500">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={\`#\${link.to}\`}
              onClick={(e) => handleSmoothScroll(e, link.to)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors border border-slate-700 hover:border-indigo-500 px-4 py-2 rounded-lg">
            Login
          </Link>
          <Link to="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-b border-slate-700 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={\`#\${link.to}\`}
                  onClick={(e) => handleSmoothScroll(e, link.to)}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700">
                <Link to="/login" className="text-center text-sm font-medium text-white border border-slate-600 px-4 py-2 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="text-center text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
`,
  'components/landing/HeroSection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Database } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="hero">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 mix-blend-screen animate-pulse"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl translate-x-1/2 mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 relative"></span>
              <span className="text-xs font-medium text-slate-300 tracking-wide">FinLedger AI v1.0</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Smart Finance Management Powered by <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                AI & Blockchain
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Track income, expenses, and budgets with AI-powered insights
              and tamper-proof blockchain security — all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-center">
                View Dashboard Demo
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">✓ No credit card required</span>
              <span className="flex items-center gap-1.5">✓ Blockchain secured</span>
              <span className="flex items-center gap-1.5">✓ AI powered</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative p-1 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 shadow-2xl shadow-indigo-500/20"
            >
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <ShieldCheck size={12} /> Blockchain: ✅ Valid
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-xs text-slate-400 mb-1">Total Balance</p>
                    <p className="text-xl font-bold text-white">PKR 450,000</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <p className="text-xs text-slate-400 mb-1">Monthly Expenses</p>
                    <p className="text-xl font-bold text-red-400">PKR 125,000</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Database size={14} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Transaction #{i}842</p>
                          <p className="text-xs text-slate-500">Hash: a7x...9q2</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">+PKR 50k</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
`,
  'components/landing/StatsBar.jsx': `
import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { icon: '🔐', target: 100, suffix: '%', label: 'Tamper-Proof Records' },
  { icon: '⚡', target: 24, suffix: '/7', label: 'Real-time AI Analysis' },
  { icon: '📊', target: 25, suffix: '+', label: 'Financial Reports' },
  { icon: '🔗', target: 1, suffix: '', label: 'Blockchain Secured' }
];

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === target) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}</span>;
};

const StatsBar = () => {
  return (
    <div className="w-full bg-slate-900 border-y border-indigo-500/20 relative z-20">
      <div className="container mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-800">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  <Counter target={stat.target} />
                </span>
                <span className="text-xl font-bold text-indigo-400">{stat.suffix}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
`,
  'components/landing/FeaturesSection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, BrainCircuit, AlertOctagon, PieChart, LineChart } from 'lucide-react';

const features = [
  {
    icon: <Wallet size={24} />,
    title: 'Income & Expense Tracking',
    description: 'Record every transaction with categories, dates, and descriptions. Always know where your money goes.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Blockchain Security',
    description: 'Every transaction is permanently recorded on a blockchain. No editing, no deleting, no fraud.'
  },
  {
    icon: <BrainCircuit size={24} />,
    title: 'AI Spending Predictions',
    description: 'Our AI analyzes your spending history and predicts next month\\'s expenses by category.'
  },
  {
    icon: <AlertOctagon size={24} />,
    title: 'Anomaly Detection',
    description: 'AI automatically flags suspicious or unusual transactions before they become a problem.'
  },
  {
    icon: <PieChart size={24} />,
    title: 'Budget Management',
    description: 'Set spending limits per category. Get warnings when you\\'re close to the limit.'
  },
  {
    icon: <LineChart size={24} />,
    title: 'Financial Reports',
    description: 'Monthly, yearly, and category-wise reports with beautiful charts and exportable data.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-900" id="features">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything Your Organization Needs</h2>
          <p className="text-slate-400 text-lg">One platform to manage finances, detect fraud, and predict the future.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-800 p-8 rounded-2xl border-l-4 border-l-indigo-500 shadow-lg hover:shadow-indigo-500/10 transition-all border-y border-r border-slate-700/50"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
`,
  'components/landing/HowItWorks.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, HandCoins, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: <Building2 size={28} />,
    num: "01",
    title: "Register Your Organization",
    description: "Create your account and set up your organization profile in under 2 minutes."
  },
  {
    icon: <HandCoins size={28} />,
    num: "02",
    title: "Record Transactions",
    description: "Add income and expenses. Every record is automatically saved to the blockchain."
  },
  {
    icon: <Sparkles size={28} />,
    num: "03",
    title: "Get AI Insights",
    description: "Let AI analyze your data, detect anomalies, and predict future spending."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started in 3 Simple Steps</h2>
          <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-6 relative">
          
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-800 -translate-y-1/2 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-indigo-500/50 border-t border-dashed border-indigo-400"
            ></motion.div>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex-1 w-full max-w-sm relative z-10"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <span className="absolute -top-6 -right-2 text-9xl font-black text-slate-700/20 group-hover:text-indigo-500/10 transition-colors select-none">
                  {step.num}
                </span>
                
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] mb-6 shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
`,
  'components/landing/BlockchainSection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

const BlockchainSection = () => {
  return (
    <section className="py-24 bg-slate-900 relative" id="blockchain">
      {/* Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20 mb-6">
              <Lock size={16} /> Immutable Ledger
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Your Data, <br className="hidden md:block"/>
              <span className="text-indigo-400">Permanently Secured</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Traditional finance software lets admins edit or delete records. 
              FinLedger AI stores every transaction on a blockchain — making it 
              mathematically impossible to tamper with historical data.
            </p>
            
            <ul className="space-y-4">
              {[
                "Every transaction gets a unique cryptographic hash",
                "Each record links to the previous — forming an unbreakable chain",
                "Any tampering is instantly detected and reported",
                "Full audit trail available at any time"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full overflow-hidden py-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
              {[
                { id: 1, title: 'Salary', hash: 'a3f9...2x', prev: '0000...00' },
                { id: 2, title: 'Office Rent', hash: '7d4e...9b', prev: 'a3f9...2x' },
                { id: 3, title: 'Equipment', hash: '2b6c...4m', prev: '7d4e...9b' }
              ].map((block, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 }}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-full md:w-40 relative shadow-xl shadow-black/40"
                  >
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm">
                      <ShieldAlert size={12} className="text-white" />
                    </div>
                    <div className="text-xs font-bold text-slate-500 mb-1">BLOCK #{block.id}</div>
                    <div className="font-bold text-white mb-3 truncate">{block.title}</div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded truncate border border-slate-700">Prev: {block.prev}</div>
                      <div className="text-[10px] text-indigo-400 bg-indigo-500/10 p-1.5 rounded truncate border border-indigo-500/20">Hash: {block.hash}</div>
                    </div>
                  </motion.div>

                  {i < 2 && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.3) + 0.15, duration: 0.3 }}
                      className="hidden md:flex items-center text-slate-600 origin-left"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </motion.div>
                  )}
                  {i < 2 && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.3) + 0.15, duration: 0.3 }}
                      className="md:hidden flex items-center text-slate-600 origin-top py-1"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;
`,
  'components/landing/AISection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, FileText, MessageSquareText } from 'lucide-react';

const aiFeatures = [
  {
    icon: <Sparkles size={24} />,
    title: 'Spending Predictions',
    description: "AI predicts next month's expenses by category based on your history.",
    tag: 'Powered by Gemini AI'
  },
  {
    icon: <Activity size={24} />,
    title: 'Anomaly Detection',
    description: 'Automatically flags transactions that look suspicious or out of pattern.',
    tag: 'Real-time Analysis'
  },
  {
    icon: <FileText size={24} />,
    title: 'Auto-Generated Reports',
    description: 'AI writes professional financial analysis reports — no manual work needed.',
    tag: 'One Click Report'
  },
  {
    icon: <MessageSquareText size={24} />,
    title: 'Ask AI Anything',
    description: 'Chat with AI about your finances. Get advice, summaries, and recommendations.',
    tag: 'AI Chat Assistant'
  }
];

const AISection = () => {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative" id="ai">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Artificial Intelligence Built Into Every Decision</h2>
          <p className="text-slate-400 text-lg">FinLedger AI uses advanced LLMs to act as your personal financial analyst.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {aiFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#06b6d4] transition-all"></div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-semibold text-cyan-400">
                    {feature.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;
`,
  'components/landing/TeamSection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const team = [
  { name: 'Hamza', role: 'Full Stack Developer', initials: 'H' },
  { name: 'Team Member 2', role: 'Backend / Blockchain', initials: 'T2' },
  { name: 'Team Member 3', role: 'Frontend / AI', initials: 'T3' }
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800" id="team">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Built With Passion</h2>
          <p className="text-indigo-400 font-medium">Final Year Project — Computer Science</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center hover:border-slate-500 transition-colors"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg">
                {member.initials}
              </div>
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{member.role}</p>
              
              <div className="flex items-center justify-center gap-3 text-slate-500">
                <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
`,
  'components/landing/CTASection.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900"></div>
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 border border-white/20 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/20 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 max-w-3xl mx-auto leading-tight">
          Ready to Transform Your Organization's Finance?
        </h2>
        <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
          Join organizations already using FinLedger AI for secure, AI-powered financial management.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-slate-100 transition-colors shadow-xl text-center">
            Get Started Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-white/30 text-white font-bold hover:bg-white/10 transition-colors text-center">
            Login to Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
`,
  'components/landing/Footer.jsx': `
import React from 'react';
import { Link2, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1e] pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Link2 className="text-indigo-500" size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">FinLedger <span className="text-indigo-500">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A secure, AI-powered blockchain organizational finance monitor. Built to track, predict, and secure your financial data.
            </p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</a></li>
              <li><a href="#blockchain" className="hover:text-indigo-400 transition-colors">Blockchain Security</a></li>
              <li><a href="#ai" className="hover:text-indigo-400 transition-colors">AI Insights</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>React.js & Tailwind CSS</li>
              <li>Node.js & Express</li>
              <li>MongoDB</li>
              <li>Custom JS Blockchain</li>
              <li>Google Gemini AI</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2026 FinLedger AI. Final Year Project.
          </p>
          <p className="text-slate-500 text-sm">
            Built with MERN Stack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`
};

Object.keys(files).forEach(file => {
  const fullPath = path.join(dir, file);
  const dirName = path.dirname(fullPath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  fs.writeFileSync(fullPath, files[file].trim());
  console.log('Created:', file);
});
