import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    blue: 'bg-brand-50 text-brand-700 border-brand-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-ink-100 text-ink-600 border-ink-200'
  };

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-ink-200/80 shadow-soft hover:shadow-lift hover:border-brand-200/60 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand-400/0 to-transparent group-hover:via-brand-500/80 transition-all duration-300" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-ink-500">{title}</p>
          <h3 className="font-display text-2xl font-semibold text-ink-900 mt-1.5 tracking-tight truncate">
            {value}
          </h3>
          {subtext && <p className="text-xs text-ink-400 mt-1.5">{subtext}</p>}
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${
              colorMap[color] || colorMap.brand
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
