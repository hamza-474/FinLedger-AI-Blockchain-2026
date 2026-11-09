import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedInput = ({ 
  label, 
  type = "text", 
  icon, 
  rightElement, 
  placeholder, 
  error, 
  registration, 
  delay = 0 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="mb-5 relative"
    >
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      
      <motion.div 
        animate={error ? shakeAnimation : {}}
        className={`relative rounded-xl border ${
          error 
            ? 'border-red-500/50 bg-red-500/5' 
            : isFocused 
              ? 'border-indigo-500 bg-slate-900/80 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
              : 'border-slate-700 bg-slate-900/50'
        } transition-colors duration-300 overflow-hidden flex items-center h-12`}
      >
        {icon && (
          <div className={`pl-4 flex items-center justify-center ${isFocused ? 'text-indigo-400' : 'text-slate-500'} transition-colors`}>
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className="w-full h-full bg-transparent border-none outline-none text-white px-3 placeholder:text-slate-600 text-sm"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          {...registration}
          onBlur={(e) => {
            registration.onBlur(e);
            setIsFocused(false);
          }}
        />

        {rightElement && (
          <div className="pr-3 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </motion.div>

      {/* Error Message underneath */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-400 mt-1.5 ml-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Needed for AnimatePresence to work inside this file
import { AnimatePresence } from 'framer-motion';

export default AnimatedInput;