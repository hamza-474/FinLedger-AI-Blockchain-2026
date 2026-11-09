import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthLayout = ({ children, leftPanel }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden font-sans text-slate-300">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -70, 0], y: [0, 70, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[60%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto flex w-full relative z-10">
        {/* Left Panel (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative">
          <AnimatePresence mode="wait">
            {leftPanel}
          </AnimatePresence>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;