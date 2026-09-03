import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Send, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VoucherTable({
  vouchers = [],
  pagination = {},
  isLoading = false,
  userRole = 'EMPLOYEE',
  onPageChange,
  onDelete,
  onSubmit,
  onQuickApprove,
  onQuickReject
}) {
  const showEmployeeCol = userRole === 'DIRECTOR' || userRole === 'ACCOUNTS';

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No vouchers found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          There are no expense vouchers matching your criteria. Try adjusting the search filters or create a new voucher.
        </p>
        {userRole === 'EMPLOYEE' && (
          <div className="mt-5">
            <Link
              to="/employee/vouchers/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              + Create New Voucher
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Voucher #</th>
              {showEmployeeCol && <th className="py-3.5 px-4">Employee</th>}
              <th className="py-3.5 px-4">Title & Category</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Expense Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vouchers.map((v) => {
              const detailUrl =
                userRole === 'EMPLOYEE'
                  ? `/employee/vouchers/${v.id}`
                  : userRole === 'DIRECTOR'
                  ? `/director/vouchers/${v.id}`
                  : `/accounts/vouchers/${v.id}`;

              return (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors group">
                  {/* Voucher number */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-600">
                    <Link to={detailUrl} className="hover:underline">
                      {v.voucherNumber}
                    </Link>
                  </td>

                  {/* Employee Name & Dept */}
                  {showEmployeeCol && (
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{v.employee?.name || '—'}</div>
                      <div className="text-xs text-slate-400">{v.employee?.email}</div>
                    </td>
                  )}

                  {/* Title & Category */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 line-clamp-1">{v.expenseTitle}</div>
                    <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                      {v.expenseCategory.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-slate-600">{v.departmentName}</td>

                  {/* Expense Date */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(v.expenseDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                    ${Number(v.amount).toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={v.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Button */}
                      <Link
                        to={detailUrl}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Employee Draft Actions */}
                      {userRole === 'EMPLOYEE' && v.status === 'DRAFT' && (
                        <>
                          <Link
                            to={`/employee/vouchers/${v.id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Draft"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {onSubmit && (
                            <button
                              type="button"
                              onClick={() => onSubmit(v)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Submit for Approval"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(v.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Director Quick Actions on Pending */}
                      {userRole === 'DIRECTOR' && v.status === 'PENDING_APPROVAL' && (
                        <>
                          {onQuickApprove && (
                            <button
                              type="button"
                              onClick={() => onQuickApprove(v)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve Voucher"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {onQuickReject && (
                            <button
                              type="button"
                              onClick={() => onQuickReject(v)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject Voucher"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
            </span>{' '}
            of <span className="font-semibold">{pagination.totalCount}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
