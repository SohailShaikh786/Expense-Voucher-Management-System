import React from 'react';
import { Clock, CheckCircle2, XCircle, FileEdit } from 'lucide-react';

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-ink-100 text-ink-700 border-ink-200',
    dot: 'bg-ink-400',
    icon: FileEdit
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle
  }
};

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-ink-100 text-ink-700 border-ink-200',
    dot: 'bg-ink-400',
    icon: Clock
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
}
