import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Link as LinkIcon,
  Sparkles,
  BarChart2,
  Settings,
  LogOut,
  X,
  Users
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = React.useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ArrowLeftRight size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <Wallet size={20} /> },
    { name: 'Blockchain', path: '/blockchain', icon: <LinkIcon size={20} /> },
    { name: 'AI Insights', path: '/ai', icon: <Sparkles size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
    ...(user?.role === 'admin' ? [{ name: 'User Management', path: '/admin/users', icon: <Users size={20} /> }] : []),
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[260px] bg-dark-card border-r border-dark-border
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-border">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
            <LinkIcon className="text-accent" size={24} />
            <span>FinLedger AI</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-accent/10 text-accent font-medium shadow-[inset_4px_0_0_0_rgba(99,102,241,1)]'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-dark-border/50'
                }
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile & Logout */}
        {user && (
          <div className="p-4 border-t border-dark-border bg-dark-card mt-auto">
            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 mb-4 px-3 py-2 -mx-1 rounded-xl transition-colors ${isActive ? 'bg-accent/10 shadow-[inset_4px_0_0_0_rgba(99,102,241,1)]' : 'hover:bg-dark-border/50 cursor-pointer'}`}
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize truncate">{user.email}</p>
                </div>
                {user.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">Admin</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Staff</span>
                )}
              </div>
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
