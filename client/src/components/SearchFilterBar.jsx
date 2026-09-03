import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'FOOD', label: 'Food & Meals' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'OFFICE_SUPPLIES', label: 'Office Supplies' },
  { value: 'EQUIPMENT', label: 'Equipment' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'TRAINING', label: 'Training & Certifications' },
  { value: 'OTHER', label: 'Other' }
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
];

export default function SearchFilterBar({ filters, onFilterChange, onReset, showStatusFilter = true }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      {/* Primary search row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by voucher #, title, description, or employee..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        {showStatusFilter && (
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        {/* Category Dropdown */}
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Toggle Advanced */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 text-sm font-medium border rounded-lg flex items-center gap-1.5 transition-colors ${
            showAdvanced
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Advanced Filter Collapse */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <input
              type="text"
              value={filters.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="e.g. Engineering"
              className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Amount range */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Amount Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.amountMin || ''}
                onChange={(e) => handleChange('amountMin', e.target.value)}
                placeholder="Min"
                className="w-full px-2.5 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={filters.amountMax || ''}
                onChange={(e) => handleChange('amountMax', e.target.value)}
                placeholder="Max"
                className="w-full px-2.5 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Expense Date From / To
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Sort By & Order */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="createdAt">Created Date</option>
                <option value="expenseDate">Expense Date</option>
                <option value="amount">Amount</option>
                <option value="voucherNumber">Voucher #</option>
              </select>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className="w-28 px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
