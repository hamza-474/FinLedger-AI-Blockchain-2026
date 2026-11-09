import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessAnimation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 backdrop-blur-sm z-50 rounded-2xl"
    >
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>
      </div>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-white"
      >
        Success!
      </motion.h3>
    </motion.div>
  );
};

export default SuccessAnimation;