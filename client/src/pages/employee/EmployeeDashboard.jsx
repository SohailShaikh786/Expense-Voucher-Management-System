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
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const totalAmount = data?.totalAmountClaimed || 0;
  const recentVouchers = data?.recentVouchers || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Employee Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your expense reimbursement submissions, drafts, and status history.
          </p>
        </div>
        <Link
          to="/employee/vouchers/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Voucher
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Claimed"
          value={`$${Number(totalAmount).toFixed(2)}`}
          subtext="Lifetime claims"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="All Vouchers"
          value={counts.TOTAL || 0}
          icon={FileText}
          color="slate"
        />
        <StatCard
          title="Drafts"
          value={counts.DRAFT || 0}
          subtext="Editable"
          icon={FileEdit}
          color="slate"
        />
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

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Recent Vouchers</h3>
            <p className="text-xs text-slate-400">Latest expense claims you created</p>
          </div>
          <Link
            to="/employee/vouchers"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All My Vouchers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentVouchers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            You haven't created any expense vouchers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Voucher #</th>
                  <th className="py-3 px-6">Expense Title</th>
                  <th className="py-3 px-6">Expense Date</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-brand-600">
                      {v.voucherNumber}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-800">
                      {v.expenseTitle}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(v.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-800">
                      ${Number(v.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/employee/vouchers/${v.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
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
