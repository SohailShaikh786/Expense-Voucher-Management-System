import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  Layers,
  X,
  Receipt
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  if (!user) return null;

  let navItems = [];

  if (user.role === 'EMPLOYEE') {
    navItems = [
      { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/employee/vouchers/new', label: 'Create Voucher', icon: PlusCircle },
      { to: '/employee/vouchers', label: 'My Vouchers', icon: FileText }
    ];
  } else if (user.role === 'DIRECTOR') {
    navItems = [
      { to: '/director/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/director/pending', label: 'Pending Approvals', icon: Clock },
      { to: '/director/vouchers', label: 'All Vouchers', icon: Layers }
    ];
  } else if (user.role === 'ACCOUNTS') {
    navItems = [
      { to: '/accounts/dashboard', label: 'Financial Overview', icon: LayoutDashboard },
      { to: '/accounts/vouchers', label: 'All Vouchers', icon: Layers }
    ];
  }

  const workspaceLabel =
    user.role === 'EMPLOYEE'
      ? 'Employee Portal'
      : user.role === 'DIRECTOR'
      ? 'Director Approvals'
      : 'Accounts & Finance';

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink-950/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
        />
      )}

      <aside
        className={`no-print fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-950 text-ink-300 flex flex-col transition-transform duration-300 ease-out border-r border-ink-800 ${
          isOpen ? 'tranink-x-0' : '-tranink-x-full md:tranink-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-ink-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-glow">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-semibold text-white tracking-tight text-sm block">
                ABC Expense
              </span>
              <span className="text-[10px] text-ink-400 font-medium block tracking-wide">
                Vouchers
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-ink-400 hover:text-white p-1.5 rounded-lg hover:bg-ink-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-ink-800/60">
          <p className="text-[10px] font-semibold text-ink-500 tracking-wide uppercase">Workspace</p>
          <p className="text-sm font-semibold text-white mt-0.5">{workspaceLabel}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to.endsWith('dashboard') || item.to.endsWith('new') || item.to.endsWith('pending')}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-glow'
                      : 'text-ink-400 hover:text-white hover:bg-ink-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink-800 bg-ink-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-500/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-ink-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
