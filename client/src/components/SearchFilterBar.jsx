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
    <div className="panel p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -tranink-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by voucher #, title, description, or employee..."
            className="input-field pl-10"
          />
        </div>

        {showStatusFilter && (
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="input-field md:w-auto"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="input-field md:w-auto"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 text-sm font-medium border rounded-xl flex items-center gap-1.5 transition-colors ${
            showAdvanced
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'bg-ink-50 border-ink-200 text-ink-600 hover:bg-ink-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="btn-secondary"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-ink-100 animate-fade-up">
          <div>
            <label className="label-field">Department</label>
            <input
              type="text"
              value={filters.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="e.g. Engineering"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Amount Range ($)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.amountMin || ''}
                onChange={(e) => handleChange('amountMin', e.target.value)}
                placeholder="Min"
                className="input-field"
              />
              <span className="text-ink-400">-</span>
              <input
                type="number"
                value={filters.amountMax || ''}
                onChange={(e) => handleChange('amountMax', e.target.value)}
                placeholder="Max"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Expense Date From / To</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                className="input-field text-xs"
              />
              <span className="text-ink-400">-</span>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Sort By</label>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="input-field text-xs"
              >
                <option value="createdAt">Created Date</option>
                <option value="expenseDate">Expense Date</option>
                <option value="amount">Amount</option>
                <option value="voucherNumber">Voucher #</option>
              </select>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className="input-field text-xs w-28"
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
