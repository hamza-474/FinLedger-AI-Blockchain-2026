import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Database } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="hero">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 mix-blend-screen animate-pulse"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl translate-x-1/2 mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>

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
              Smart Finance Management Powered by <br className="hidden md:block" />
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