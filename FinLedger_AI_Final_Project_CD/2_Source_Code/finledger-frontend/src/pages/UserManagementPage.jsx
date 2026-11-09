import React, { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import ConfirmModal from '../components/common/ConfirmModal';
import useTitle from '../hooks/useTitle';
import toast from 'react-hot-toast';

// Simple counter animation component
const CountUp = ({ to }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(to, 10);
    if (isNaN(end)) return;
    if (start === end) return;
    
    const totalDuration = 1000;
    const incrementTime = 30; // ms
    const increment = (end / (totalDuration / incrementTime));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [to]);
  
  return <>{count}</>;
};

const UserManagementPage = () => {
  useTitle('User Management');
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const [roleConfirm, setRoleConfirm] = useState({ isOpen: false, id: null, newRole: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => userApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Role updated successfully');
      setRoleConfirm({ isOpen: false, id: null, newRole: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
      setRoleConfirm({ isOpen: false, id: null, newRole: null });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User removed');
      setDeleteConfirm({ isOpen: false, id: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      setDeleteConfirm({ isOpen: false, id: null });
    }
  });

  const handleRoleToggle = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'staff' : 'admin';
    setRoleConfirm({ isOpen: true, id: userId, newRole });
  };

  const confirmRoleUpdate = () => {
    updateRoleMutation.mutate({ id: roleConfirm.id, role: roleConfirm.newRole });
  };

  const handleDelete = (userId) => {
    setDeleteConfirm({ isOpen: true, id: userId });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteConfirm.id);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const usersList = usersResponse?.data || [];
  const totalUsers = usersList.length;
  const totalAdmins = usersList.filter(u => u.role === 'admin').length;
  const totalStaff = usersList.filter(u => u.role === 'staff').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Admin Only
            </span>
          </div>
          <p className="text-gray-400 mt-1">Manage organization members and their roles</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants} className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Total Users</span>
          <span className="text-2xl font-bold text-white"><CountUp to={totalUsers} /></span>
        </motion.div>
        <motion.div variants={itemVariants} className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Total Admins</span>
          <span className="text-2xl font-bold text-purple-400"><CountUp to={totalAdmins} /></span>
        </motion.div>
        <motion.div variants={itemVariants} className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Total Staff</span>
          <span className="text-2xl font-bold text-emerald-400"><CountUp to={totalStaff} /></span>
        </motion.div>
      </motion.div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-dark-bg/50 border-b border-dark-border text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700/50"></div>
                      <div className="w-24 h-4 rounded bg-slate-700/50"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 h-4 rounded bg-slate-700/50"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-6 rounded-full bg-slate-700/50"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-4 rounded bg-slate-700/50"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-16 h-8 rounded bg-slate-700/50 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : usersList.length <= 1 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No other users in your organization yet
                  </td>
                </tr>
              ) : (
                usersList.map((u, index) => {
                  const isCurrentUser = u._id === user?.id || u._id === user?._id; 
                  
                  return (
                    <motion.tr 
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-dark-bg/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{u.name}</p>
                              {isCurrentUser && (
                                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span 
                          layout
                          className={`px-2.5 py-1 inline-flex rounded-full text-xs font-medium border ${
                            u.role === 'admin' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {u.role === 'admin' ? 'Admin' : 'Staff'}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isCurrentUser && (
                          <div className="flex items-center justify-end gap-2">
                            {u.role === 'staff' ? (
                              <button
                                onClick={() => handleRoleToggle(u._id, u.role)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500 border border-purple-500/20 hover:border-purple-500 rounded-lg transition-all"
                                title="Make Admin"
                              >
                                <ShieldCheck size={14} /> Make Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleToggle(u._id, u.role)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all"
                                title="Make Staff"
                              >
                                <User size={14} /> Make Staff
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={roleConfirm.isOpen}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to ${roleConfirm.newRole}?`}
        onConfirm={confirmRoleUpdate}
        onCancel={() => setRoleConfirm({ isOpen: false, id: null, newRole: null })}
        isConfirming={updateRoleMutation.isPending}
      />
      
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete User"
        message="Delete this user? All their data remains but they cannot login."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
        isConfirming={deleteMutation.isPending}
      />
    </motion.div>
  );
};

export default UserManagementPage;
