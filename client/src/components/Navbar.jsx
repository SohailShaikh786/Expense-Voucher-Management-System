import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    EMPLOYEE: 'bg-brand-50 text-brand-800 border-brand-200',
    DIRECTOR: 'bg-amber-50 text-amber-800 border-amber-200',
    ACCOUNTS: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };

  return (
    <header className="no-print bg-white/80 backdrop-blur-md border-b border-ink-200/80 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-ink-600 hover:bg-ink-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-sm md:hidden">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="font-display font-semibold text-ink-900 hidden sm:inline text-base tracking-tight">
              Expense Voucher System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border tracking-wide ${
                  roleColors[user.role] || 'bg-ink-100 text-ink-700'
                }`}
              >
                {user.role}
              </span>

              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-ink-800 leading-tight">{user.name}</div>
                <div className="text-xs text-ink-400">{user.department || user.email}</div>
              </div>

              <div className="w-9 h-9 rounded-full bg-ink-100 border border-ink-200 flex items-center justify-center text-ink-700 font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-ink-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
