const fs = require('fs');
const path = require('path');

const dir = '/home/hamza/Documents/FinLedger AI/finledger-frontend/src';

const files = {
  'components/auth/AuthLayout.jsx': `
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
`,
  'components/auth/LeftPanel.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

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
        <h1 className="text-4xl font-extrabold text-white mb-2">{title}</h1>
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
`,
  'components/auth/AnimatedInput.jsx': `
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
        className={\`relative rounded-xl border \${
          error 
            ? 'border-red-500/50 bg-red-500/5' 
            : isFocused 
              ? 'border-indigo-500 bg-slate-900/80 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
              : 'border-slate-700 bg-slate-900/50'
        } transition-colors duration-300 overflow-hidden flex items-center h-12\`}
      >
        {icon && (
          <div className={\`pl-4 flex items-center justify-center \${isFocused ? 'text-indigo-400' : 'text-slate-500'} transition-colors\`}>
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
`,
  'components/auth/SuccessAnimation.jsx': `
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
`,
  'pages/LoginPage.jsx': `
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Link as LinkIcon, AlertCircle, Loader2, Mail, Lock, ShieldCheck, BrainCircuit, BarChart3, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthHook } from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';
import LeftPanel from '../components/auth/LeftPanel';
import AnimatedInput from '../components/auth/AnimatedInput';

const BlockchainVisual = () => (
  <div className="flex items-center gap-2">
    {[1, 2, 3].map((num) => (
      <React.Fragment key={num}>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: num * 0.5 }}
          className="bg-slate-900 border border-indigo-500/30 rounded-lg p-2.5 w-24 relative"
        >
          <div className="text-[9px] font-bold text-slate-500 mb-1">BLOCK #{num}</div>
          <div className="flex items-center gap-1.5">
            <Database size={10} className="text-indigo-400" />
            <div className="w-full h-1.5 bg-slate-800 rounded"></div>
          </div>
        </motion.div>
        {num < 3 && <div className="w-4 h-[1px] bg-indigo-500/40"></div>}
      </React.Fragment>
    ))}
  </div>
);

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading, error } = useAuthHook();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    login(data.email, data.password);
  };

  const leftPanelProps = {
    pageKey: "login-panel",
    title: "FinLedger AI",
    tagline: "Secure. Smart. Transparent.",
    points: [
      { icon: <ShieldCheck size={18} className="text-emerald-400"/>, text: "Blockchain-secured transactions" },
      { icon: <BrainCircuit size={18} className="text-cyan-400"/>, text: "AI-powered insights" },
      { icon: <BarChart3 size={18} className="text-indigo-400"/>, text: "Real-time financial reports" }
    ],
    visualComponent: <BlockchainVisual />
  };

  return (
    <AuthLayout leftPanel={<LeftPanel {...leftPanelProps} />}>
      <motion.div 
        key="login-form"
        initial={{ opacity: 0, y: 30, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-800 border border-indigo-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
      >
        {/* Subtle decorative blockchain blocks in background */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none flex flex-col gap-2">
          <div className="w-10 h-10 border border-white rounded animate-pulse"></div>
          <div className="w-10 h-10 border border-white rounded animate-pulse delay-75"></div>
        </div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <motion.div 
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30"
          >
            <LinkIcon className="text-indigo-400" size={32} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 text-sm"
          >
            Login to your FinLedger AI account
          </motion.p>
        </div>

        <hr className="border-slate-700 mb-8" />

        {error && (
          <motion.div 
            initial={{ x: [-10, 10, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 relative z-10">
          <AnimatedInput 
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={<Mail size={18} />}
            error={errors.email}
            registration={register('email', { required: 'Email is required' })}
            delay={0.1}
          />

          <AnimatedInput 
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            error={errors.password}
            registration={register('password', { required: 'Password is required' })}
            delay={0.2}
            rightElement={
              <button 
                type="button"
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl flex justify-center items-center gap-2 mt-6 relative overflow-hidden group shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-slate-400 mt-8"
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
`,
  'pages/RegisterPage.jsx': `
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Link as LinkIcon, AlertCircle, Loader2, Mail, Lock, ShieldCheck, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthHook } from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';
import LeftPanel from '../components/auth/LeftPanel';
import AnimatedInput from '../components/auth/AnimatedInput';

const FloatingDashboard = () => (
  <motion.div 
    animate={{ y: [-10, 10, -10] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 shadow-2xl w-64 mx-auto"
  >
    <div className="flex gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-red-500"></div>
      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
        <span className="text-[10px] text-slate-400">Income</span>
        <span className="text-xs font-bold text-emerald-400">↑ PKR 50k</span>
      </div>
      <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
        <span className="text-[10px] text-slate-400">Expenses</span>
        <span className="text-xs font-bold text-red-400">↓ PKR 12k</span>
      </div>
      <div className="flex justify-between items-center bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
        <span className="text-[10px] text-indigo-400">Balance</span>
        <span className="text-xs font-bold text-indigo-400">✓ Valid</span>
      </div>
    </div>
  </motion.div>
);

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, loading, error } = useAuthHook();
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = watch('password', '');

  const onSubmit = (data) => {
    registerUser(data.name, data.email, data.password, data.organization);
  };

  const getPasswordStrength = () => {
    if (!passwordValue) return 0;
    let strength = 0;
    if (passwordValue.length >= 8) strength++;
    if (/[A-Z]/.test(passwordValue)) strength++;
    if (/[0-9]/.test(passwordValue)) strength++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) strength++;
    return strength;
  };
  const strength = getPasswordStrength();

  const leftPanelProps = {
    pageKey: "register-panel",
    title: "Join FinLedger AI",
    tagline: "Start managing finances the smart way",
    points: [
      { icon: <span className="text-emerald-400 text-lg">✓</span>, text: "Free to get started" },
      { icon: <span className="text-emerald-400 text-lg">✓</span>, text: "Blockchain secured from day one" },
      { icon: <span className="text-emerald-400 text-lg">✓</span>, text: "AI insights from your first transaction" }
    ],
    visualComponent: <FloatingDashboard />
  };

  return (
    <AuthLayout leftPanel={<LeftPanel {...leftPanelProps} />}>
      <motion.div 
        key="register-form"
        initial={{ opacity: 0, y: 30, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-800 border border-cyan-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <div className="flex flex-col items-center mb-6 relative z-10">
          <motion.div 
            initial={{ rotate: 180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-3 border border-cyan-500/30"
          >
            <LinkIcon className="text-cyan-400" size={24} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-extrabold text-white"
          >
            Create Your Account
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 mt-1 text-sm text-center"
          >
            Set up your organization on FinLedger AI
          </motion.p>
        </div>

        {error && (
          <motion.div 
            initial={{ x: [-10, 10, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 relative z-10">
          <AnimatedInput 
            label="Full Name"
            placeholder="John Doe"
            icon={<User size={18} />}
            error={errors.name}
            registration={register('name', { required: 'Name is required' })}
            delay={0.1}
          />

          <AnimatedInput 
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            icon={<Mail size={18} />}
            error={errors.email}
            registration={register('email', { 
              required: 'Email is required',
              pattern: { value: /^\\S+@\\S+$/i, message: 'Invalid email address' }
            })}
            delay={0.2}
          />

          <AnimatedInput 
            label="Organization Name"
            placeholder="Acme Corp"
            icon={<Building2 size={18} />}
            error={errors.organization}
            registration={register('organization', { required: 'Organization is required' })}
            delay={0.3}
          />

          <div className="mb-5">
            <AnimatedInput 
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password}
              registration={register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })}
              delay={0.4}
              rightElement={
                <button 
                  type="button"
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            
            {/* Password Strength Indicator */}
            <AnimatePresence>
              {passwordValue && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-[-10px] mb-4 flex gap-1 px-1"
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={\`h-1 flex-1 rounded-full transition-colors duration-500 \${
                        i < strength 
                          ? strength < 2 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : 'bg-emerald-400'
                          : 'bg-slate-700'
                      }\`} 
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatedInput 
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<ShieldCheck size={18} />}
            error={errors.confirmPassword}
            registration={register('confirmPassword', { 
              required: 'Please confirm password',
              validate: value => value === passwordValue || 'Passwords do not match'
            })}
            delay={0.5}
          />

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl flex justify-center items-center gap-2 mt-4 relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-slate-400 mt-6"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            Login here
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default RegisterPage;
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
