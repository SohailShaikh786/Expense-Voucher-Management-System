import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  Layers,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  if (!user) return null;

  // Define navigation links according to Role
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

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`no-print fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow">
              EV
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-sm block">ABC Company</span>
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                Reimbursements
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tag */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</p>
          <p className="text-sm font-bold text-white mt-0.5">
            {user.role === 'EMPLOYEE' && 'Employee Portal'}
            {user.role === 'DIRECTOR' && 'Director Approvals'}
            {user.role === 'ACCOUNTS' && 'Accounts & Finance'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to.endsWith('dashboard') || item.to.endsWith('new') || item.to.endsWith('pending')}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info Bar at bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
