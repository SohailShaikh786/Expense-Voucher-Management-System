import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    EMPLOYEE: 'bg-blue-100 text-blue-800 border-blue-200',
    DIRECTOR: 'bg-purple-100 text-purple-800 border-purple-200',
    ACCOUNTS: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              EV
            </div>
            <span className="font-bold text-slate-900 hidden sm:inline text-base">
              ABC Expense Voucher
            </span>
          </div>
        </div>

        {/* Right: User Profile & Role & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                  roleColors[user.role] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {user.role}
              </span>

              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</div>
                <div className="text-xs text-slate-400">{user.department || user.email}</div>
              </div>

              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
