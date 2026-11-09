import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, AlertCircle, Loader2, Lock, ShieldCheck, BrainCircuit, BarChart3, Database, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/auth/AuthLayout';
import LeftPanel from '../components/auth/LeftPanel';
import AnimatedInput from '../components/auth/AnimatedInput';
import { resetPasswordApi } from '../api/authApi';
import toast from 'react-hot-toast';

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

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await resetPasswordApi(token, data.password);
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. The token might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const leftPanelProps = {
    pageKey: "reset-password-panel",
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
        key="reset-form"
        initial={{ opacity: 0, y: 30, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-800 border border-indigo-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
      >
        <div className="flex flex-col items-center mb-8 relative z-10">
          <motion.div 
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30"
          >
            <Lock className="text-indigo-400" size={32} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white"
          >
            Create New Password
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 mt-2 text-sm text-center"
          >
            Please enter your new password below.
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
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            icon={<Lock size={18} />}
            error={errors.password}
            registration={register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            delay={0.1}
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

          <AnimatedInput 
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            icon={<ShieldCheck size={18} />}
            error={errors.confirmPassword}
            registration={register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            delay={0.2}
            rightElement={
              <button 
                type="button"
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-slate-400 mt-8"
        >
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            Back to Login
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
