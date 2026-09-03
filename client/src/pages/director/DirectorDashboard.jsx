import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  Activity,
  UserCheck
} from 'lucide-react';

export default function DirectorDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi.getDirectorDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load director dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const pendingCount = data?.pendingCount || 0;
  const pendingAmount = data?.pendingAmount || 0;
  const approvedToday = data?.approvedToday || 0;
  const rejectedToday = data?.rejectedToday || 0;
  const recentActivities = data?.recentActivities || [];
  const pendingQueue = data?.pendingQueue || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Director Executive Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review submitted reimbursement vouchers, manage approval workflows, and audit company spend.
          </p>
        </div>
        <Link
          to="/director/pending"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow transition-colors"
        >
          <Clock className="w-4 h-4" />
          Review Pending Queue ({pendingCount})
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          subtext="Requires executive signature"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Pending Amount"
          value={`$${Number(pendingAmount).toFixed(2)}`}
          subtext="Awaiting decision"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Approved Today"
          value={approvedToday}
          subtext="Processed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected Today"
          value={rejectedToday}
          subtext="Returned with reason"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Total Vouchers"
          value={counts.TOTAL || 0}
          subtext="Company-wide"
          icon={Layers}
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Queue Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Pending Approval Queue</h3>
              <p className="text-xs text-slate-400">Vouchers waiting for your approval signature</p>
            </div>
            <Link
              to="/director/pending"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Open Full Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No pending vouchers! All submitted reimbursement claims have been reviewed.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6">Voucher #</th>
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Expense Title</th>
                    <th className="py-3 px-6 text-right">Amount</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingQueue.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-semibold text-brand-600">
                        {v.voucherNumber}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-slate-800">{v.employee?.name}</div>
                        <div className="text-xs text-slate-400">{v.employee?.department}</div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-700 font-medium">
                        {v.expenseTitle}
                      </td>
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                        ${Number(v.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/director/vouchers/${v.id}`}
                          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Review &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity Audit Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Activity className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-slate-800 text-sm">Recent Activity Audit Trail</h3>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-800 font-semibold">{act.performedBy?.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                    {act.action}
                  </span>
                  <span className="truncate">{act.voucher?.voucherNumber}</span>
                </div>
                {act.notes && (
                  <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-1 bg-slate-50 p-1.5 rounded">
                    "{act.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
