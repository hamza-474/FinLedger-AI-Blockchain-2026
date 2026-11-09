import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../../api/transactionApi';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [chainStatus, setChainStatus] = useState({ loading: true, valid: false });
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome to FinLedger AI', message: 'Your account is ready and blockchain node is synced.', time: 'Just now', unread: true },
    { id: 2, type: 'warning', title: 'Budget Alert', message: 'Software budget is at 85% capacity.', time: '2 hours ago', unread: true, link: '/budgets' },
    { id: 3, type: 'success', title: 'Report Generated', message: 'Monthly financial report is ready to download.', time: '1 day ago', unread: false, link: '/reports' }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  // Determine page title
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  useEffect(() => {
    const checkBlockchain = async () => {
      try {
        const { data } = await api.get('/blockchain/verify');
        setChainStatus({ loading: false, valid: data.success ? data.isValid : false });
      } catch (error) {
        setChainStatus({ loading: false, valid: false });
      }
    };
    checkBlockchain();
    const interval = setInterval(checkBlockchain, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch transactions to check for duplicates (Admin only)
  const { data: txResponse } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
    enabled: user?.role === 'admin',
    refetchInterval: 30000
  });

  useEffect(() => {
    if (txResponse?.data && user?.role === 'admin') {
      const pendingDuplicates = txResponse.data.filter(tx => tx.status === 'pending' && tx.isDuplicate);
      
      if (pendingDuplicates.length > 0) {
        const duplicateNotifs = pendingDuplicates.map(tx => ({
          id: `dup-${tx._id}`,
          type: 'warning',
          title: 'Duplicate Transaction Pending',
          message: `A pending transaction "${tx.title}" appears to be a duplicate.`,
          time: new Date(tx.createdAt || new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          unread: true,
          link: '/transactions'
        }));
        
        setNotifications(prev => {
          const nonDupNotifs = prev.filter(n => !n.id.toString().startsWith('dup-'));
          return [...duplicateNotifs, ...nonDupNotifs];
        });
      } else {
        setNotifications(prev => prev.filter(n => !n.id.toString().startsWith('dup-')));
      }
    }
  }, [txResponse, user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIconForType = (type) => {
    if (type === 'warning') return <AlertTriangle size={16} className="text-yellow-500" />;
    if (type === 'success') return <CheckCircle size={16} className="text-emerald-500" />;
    return <Info size={16} className="text-blue-500" />;
  };

  return (
    <header className="h-16 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Blockchain Status Badge */}
        {!chainStatus.loading && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${chainStatus.valid
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
            {chainStatus.valid ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>{chainStatus.valid ? 'Chain Valid ✓' : '⚠ Tampered'}</span>
          </div>
        )}

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-dark-bg"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-dark-border hover:bg-dark-bg/50 transition-colors cursor-pointer ${notif.unread ? 'bg-dark-bg/20' : ''}`}
                    onClick={() => {
                      if (notif.link) {
                        navigate(notif.link);
                        setShowNotifications(false);
                      }
                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">{getIconForType(notif.type)}</div>
                      <div>
                        <p className={`text-sm ${notif.unread ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{notif.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-gray-500 mt-2 font-medium">{notif.time}</p>
                      </div>
                      {notif.unread && <div className="w-2 h-2 bg-accent rounded-full mt-1.5 ml-auto shrink-0"></div>}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="p-3 text-center border-t border-dark-border bg-dark-bg/50 hover:bg-dark-border/50 transition-colors cursor-pointer"
                onClick={markAllAsRead}
              >
                <span className="text-xs font-bold text-accent">Mark all as read</span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {user && (
          <div 
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold ring-2 ring-primary/20 shadow-inner cursor-pointer hover:bg-primary/30 transition-colors"
            title="Account Settings"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
