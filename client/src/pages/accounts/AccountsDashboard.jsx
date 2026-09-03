import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Layers,
  Printer,
  ArrowRight,
  PieChart
} from 'lucide-react';

export default function AccountsDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi.getAccountsDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load accounts dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const totalApproved = data?.totalApprovedAmount || 0;
  const totalExpense = data?.totalExpenseAmount || 0;
  const recentApproved = data?.recentApprovedVouchers || [];
  const categoryBreakdown = data?.categoryBreakdown || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Accounts & Finance Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organization-wide financial audit, approved expense tracking, and reimbursement disbursement records.
          </p>
        </div>
        <Link
          to="/accounts/vouchers"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition-colors"
        >
          <Layers className="w-4 h-4" />
          View All Organization Vouchers
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Approved Amount"
          value={`$${Number(totalApproved).toFixed(2)}`}
          subtext="Ready for payment disbursement"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Approved Vouchers"
          value={counts.APPROVED || 0}
          subtext="Fully signed & authorized"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Pipeline"
          value={counts.PENDING_APPROVAL || 0}
          subtext="Awaiting Director sign-off"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Claims Volume"
          value={`$${Number(totalExpense).toFixed(2)}`}
          subtext={`${counts.TOTAL || 0} vouchers total`}
          icon={PieChart}
          color="blue"
        />
      </div>

      {/* Approved Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            Approved Expenses by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block truncate">
                  {cat.category.replace('_', ' ')}
                </span>
                <span className="text-lg font-bold text-slate-800 block mt-1">
                  ${Number(cat.totalAmount).toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {cat.count} approved voucher{cat.count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Approved Vouchers for Accounts Processing */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Recent Approved Vouchers</h3>
            <p className="text-xs text-slate-400">Authorized by Director, ready for audit and payout</p>
          </div>
          <Link
            to="/accounts/vouchers"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All Vouchers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApproved.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No approved vouchers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Voucher #</th>
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-6">Expense Title</th>
                  <th className="py-3 px-6">Approval Date</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApproved.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-brand-600">
                      {v.voucherNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-slate-800">{v.employee?.name}</div>
                      <div className="text-xs text-slate-400">{v.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {v.expenseTitle}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                      {v.approvalDate ? new Date(v.approvalDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-emerald-700">
                      ${Number(v.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/accounts/vouchers/${v.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        View / Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
