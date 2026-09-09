import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
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
        <div className="h-28 bg-ink-200 rounded-2xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-ink-200 rounded-2xl"></div>
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
    <div className="page-shell">
      <div className="page-hero">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-7">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-emerald-700 uppercase mb-1">Accounts</p>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
              Finance overview
            </h1>
            <p className="text-sm text-ink-500 mt-1.5 max-w-xl">
              Track approved spend, category breakdowns, and vouchers ready for payout.
            </p>
          </div>
          <Link
            to="/accounts/vouchers"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-soft transition-colors shrink-0"
          >
            <Layers className="w-4 h-4" />
            All Organization Vouchers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Approved Amount"
          value={`$${Number(totalApproved).toFixed(2)}`}
          subtext="Ready for disbursement"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Approved Vouchers"
          value={counts.APPROVED || 0}
          subtext="Fully authorized"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Pipeline"
          value={counts.PENDING_APPROVAL || 0}
          subtext="Awaiting Director"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Claims Volume"
          value={`$${Number(totalExpense).toFixed(2)}`}
          subtext={`${counts.TOTAL || 0} vouchers total`}
          icon={PieChart}
          color="brand"
        />
      </div>

      {categoryBreakdown.length > 0 && (
        <div className="panel p-6">
          <h3 className="font-display font-semibold text-ink-800 text-sm mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            Approved Expenses by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.category}
                className="p-3.5 bg-ink-50 rounded-xl border border-ink-100 hover:border-brand-200 transition-colors"
              >
                <span className="text-[11px] font-bold text-ink-400 uppercase block truncate">
                  {cat.category.replace('_', ' ')}
                </span>
                <span className="font-display text-lg font-semibold text-ink-800 block mt-1">
                  ${Number(cat.totalAmount).toFixed(2)}
                </span>
                <span className="text-[11px] text-ink-400 block mt-0.5">
                  {cat.count} approved voucher{cat.count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="font-display font-semibold text-ink-800">Recent Approved Vouchers</h3>
            <p className="text-xs text-ink-400 mt-0.5">Authorized by Director — ready for audit and payout</p>
          </div>
          <Link
            to="/accounts/vouchers"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            All Vouchers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApproved.length === 0 ? (
          <div className="p-10 text-center text-ink-400 text-sm">No approved vouchers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="py-3 px-6">Voucher #</th>
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-6">Expense Title</th>
                  <th className="py-3 px-6">Approval Date</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {recentApproved.map((v) => (
                  <tr key={v.id} className="table-row">
                    <td className="py-3.5 px-6 font-mono font-semibold text-brand-700">{v.voucherNumber}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-ink-800">{v.employee?.name}</div>
                      <div className="text-xs text-ink-400">{v.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-6 text-ink-700 font-medium">{v.expenseTitle}</td>
                    <td className="py-3.5 px-6 text-ink-500 whitespace-nowrap">
                      {v.approvalDate ? new Date(v.approvalDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-emerald-700">
                      ${Number(v.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/accounts/vouchers/${v.id}`}
                        className="px-3 py-1.5 bg-ink-100 hover:bg-ink-200 text-ink-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3 h-3 text-ink-500" />
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
