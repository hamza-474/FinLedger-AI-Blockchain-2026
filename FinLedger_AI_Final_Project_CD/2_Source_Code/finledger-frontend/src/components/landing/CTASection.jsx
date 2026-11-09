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