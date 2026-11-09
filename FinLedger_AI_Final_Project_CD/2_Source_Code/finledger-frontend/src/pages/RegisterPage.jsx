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
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
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
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                        i < strength 
                          ? strength < 2 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : 'bg-emerald-400'
                          : 'bg-slate-700'
                      }`} 
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