import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Save, Key, Lock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const SettingsPage = () => {
  const { user, updateUser } = useContext(AuthContext);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await api.put('/auth/update-profile', { name });
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (response.data.success) {
        toast.success('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-6xl mx-auto pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white tracking-wide">Account Settings</h2>
        <p className="text-gray-400 mt-1">Manage your profile, security, and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 1 — Profile Card (left side) */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 h-full shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent/80 to-accent/20 flex items-center justify-center text-white text-3xl font-bold mb-4 ring-4 ring-accent/10 shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{user?.name}</h3>
              
              <div className="flex flex-col items-center gap-3 w-full">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
                  user?.role === 'admin' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {user?.role || 'Staff'}
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-dark-bg px-4 py-2 rounded-lg border border-dark-border w-full justify-center">
                  <Building2 size={16} className="text-accent" />
                  <span>{user?.organization || 'FinLedger AI'}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20 w-full mt-2">
                  <Shield size={16} />
                  <span className="font-medium">Account Active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION 2 — Personal Information (right side, top) */}
          <motion.div variants={itemVariants} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-border pb-4">
              <User className="text-accent" /> Personal Information
            </h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full bg-dark-bg/50 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role</label>
                  <div className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 flex items-center gap-2 cursor-not-allowed opacity-80">
                    <Shield size={18} className="text-gray-500" />
                    <span className={`capitalize font-medium ${
                      user?.role === 'admin' ? 'text-purple-400' : 'text-emerald-400'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Organization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Building2 size={18} />
                    </div>
                    <input
                      type="text"
                      value={user?.organization || ''}
                      readOnly
                      className="w-full bg-dark-bg/50 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95"
                >
                  {isUpdatingProfile ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{isUpdatingProfile ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* SECTION 3 — Change Password (right side, bottom) */}
          <motion.div variants={itemVariants} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-dark-border pb-4">
              <Key className="text-primary" /> Change Password
            </h3>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
                >
                  {isUpdatingPassword ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Key size={18} />
                  )}
                  <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
