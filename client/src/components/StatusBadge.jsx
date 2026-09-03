import React from 'react';
import { Clock, CheckCircle2, XCircle, FileEdit } from 'lucide-react';

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-400',
    icon: FileEdit
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
    icon: Clock
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
    icon: XCircle
  }
};

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-gray-100 text-gray-700 border-gray-300',
    dot: 'bg-gray-400',
    icon: Clock
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
}
