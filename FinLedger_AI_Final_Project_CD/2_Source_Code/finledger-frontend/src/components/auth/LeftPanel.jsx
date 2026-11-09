import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeftPanel = ({ title, tagline, points, visualComponent, pageKey }) => {
  return (
    <motion.div 
      key={pageKey}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-10 relative overflow-hidden"
    >
      {/* Decorative gradient behind panel content */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
      
      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium" title="Return to Landing Page">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <Link to="/" className="block hover:opacity-80 transition-opacity" title="Go to Home Page">
          <h1 className="text-4xl font-extrabold text-white mb-2">{title}</h1>
        </Link>
        <p className="text-indigo-400 text-lg font-medium mb-10">{tagline}</p>

        <div className="space-y-5 mb-12">
          {points.map((point, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex items-center gap-4 text-slate-300"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center border border-slate-700 shrink-0">
                {point.icon}
              </div>
              <span className="font-medium">{point.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-700/50">
          {visualComponent}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftPanel;