import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi.getEmployeeDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load employee dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-ink-200 rounded-2xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-ink-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const totalAmount = data?.totalAmountClaimed || 0;
  const recentVouchers = data?.recentVouchers || [];

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-7">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-brand-700 uppercase mb-1">Employee</p>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
              Your expense workspace
            </h1>
            <p className="text-sm text-ink-500 mt-1.5 max-w-xl">
              Track drafts, submissions, and reimbursement status in one place.
            </p>
          </div>
          <Link to="/employee/vouchers/new" className="btn-primary shrink-0">
            <PlusCircle className="w-4 h-4" />
            Create New Voucher
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Claimed"
          value={`$${Number(totalAmount).toFixed(2)}`}
          subtext="Lifetime claims"
          icon={DollarSign}
          color="brand"
        />
        <StatCard title="All Vouchers" value={counts.TOTAL || 0} icon={FileText} color="slate" />
        <StatCard title="Drafts" value={counts.DRAFT || 0} subtext="Editable" icon={FileEdit} color="slate" />
        <StatCard
          title="Pending"
          value={counts.PENDING_APPROVAL || 0}
          subtext="Under review"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved"
          value={counts.APPROVED || 0}
          subtext="Director signed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected"
          value={counts.REJECTED || 0}
          subtext="Review reasons"
          icon={XCircle}
          color="rose"
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="font-display font-semibold text-ink-800">Recent Vouchers</h3>
            <p className="text-xs text-ink-400 mt-0.5">Latest expense claims you created</p>
          </div>
          <Link
            to="/employee/vouchers"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentVouchers.length === 0 ? (
          <div className="p-10 text-center text-ink-400 text-sm">
            You haven&apos;t created any expense vouchers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="py-3 px-6">Voucher #</th>
                  <th className="py-3 px-6">Expense Title</th>
                  <th className="py-3 px-6">Expense Date</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {recentVouchers.map((v) => (
                  <tr key={v.id} className="table-row">
                    <td className="py-3.5 px-6 font-mono font-semibold text-brand-700">{v.voucherNumber}</td>
                    <td className="py-3.5 px-6 font-medium text-ink-800">{v.expenseTitle}</td>
                    <td className="py-3.5 px-6 text-ink-500 whitespace-nowrap">
                      {new Date(v.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-ink-800">
                      ${Number(v.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/employee/vouchers/${v.id}`}
                        className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                      >
                        View &rarr;
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
