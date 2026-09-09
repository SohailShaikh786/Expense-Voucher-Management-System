import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/StatCard';
import {
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  Activity
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
        <div className="h-28 bg-ink-200 rounded-2xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-ink-200 rounded-2xl"></div>
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
    <div className="page-shell">
      <div className="page-hero">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-7">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-amber-700 uppercase mb-1">Director</p>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
              Approval overview
            </h1>
            <p className="text-sm text-ink-500 mt-1.5 max-w-xl">
              Review pending claims, sign off approvals, and monitor company spend.
            </p>
          </div>
          <Link
            to="/director/pending"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-soft transition-colors shrink-0"
          >
            <Clock className="w-4 h-4" />
            Review Pending ({pendingCount})
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          subtext="Requires signature"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Pending Amount"
          value={`$${Number(pendingAmount).toFixed(2)}`}
          subtext="Awaiting decision"
          icon={DollarSign}
          color="brand"
        />
        <StatCard title="Approved Today" value={approvedToday} subtext="Processed" icon={CheckCircle2} color="emerald" />
        <StatCard title="Rejected Today" value={rejectedToday} subtext="Returned" icon={XCircle} color="rose" />
        <StatCard title="Total Vouchers" value={counts.TOTAL || 0} subtext="Company-wide" icon={Layers} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 panel">
          <div className="panel-header">
            <div>
              <h3 className="font-display font-semibold text-ink-800">Pending Approval Queue</h3>
              <p className="text-xs text-ink-400 mt-0.5">Waiting for your signature</p>
            </div>
            <Link
              to="/director/pending"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              Open Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-10 text-center text-ink-400 text-sm">
              No pending vouchers — all submitted claims have been reviewed.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="py-3 px-6">Voucher #</th>
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Expense Title</th>
                    <th className="py-3 px-6 text-right">Amount</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {pendingQueue.map((v) => (
                    <tr key={v.id} className="table-row">
                      <td className="py-3.5 px-6 font-mono font-semibold text-brand-700">{v.voucherNumber}</td>
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-ink-800">{v.employee?.name}</div>
                        <div className="text-xs text-ink-400">{v.employee?.department}</div>
                      </td>
                      <td className="py-3.5 px-6 text-ink-700 font-medium">{v.expenseTitle}</td>
                      <td className="py-3.5 px-6 text-right font-bold text-ink-900">
                        ${Number(v.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/director/vouchers/${v.id}`}
                          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-lg transition-colors"
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

        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-100">
            <Activity className="w-4 h-4 text-brand-600" />
            <h3 className="font-display font-semibold text-ink-800 text-sm">Recent Activity</h3>
          </div>

          <div className="space-y-3.5">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-ink-400 text-center py-6">No recent activity</p>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-ink-800 font-semibold">{act.performedBy?.name}</span>
                    <span className="text-[10px] text-ink-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-ink-500 mt-0.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-md bg-ink-100 font-mono text-[10px] font-bold text-ink-700">
                      {act.action}
                    </span>
                    <span className="truncate">{act.voucher?.voucherNumber}</span>
                  </div>
                  {act.notes && (
                    <p className="text-[11px] text-ink-600 mt-1 italic line-clamp-1 bg-ink-50 p-1.5 rounded-lg">
                      &ldquo;{act.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
