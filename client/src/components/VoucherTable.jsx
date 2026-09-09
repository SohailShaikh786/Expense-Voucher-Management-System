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
      <div className="panel p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-ink-200 rounded w-1/4"></div>
          <div className="h-12 bg-ink-100 rounded-xl"></div>
          <div className="h-12 bg-ink-100 rounded-xl"></div>
          <div className="h-12 bg-ink-100 rounded-xl"></div>
          <div className="h-12 bg-ink-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="panel p-12 text-center">
        <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto text-ink-400 mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink-800">No vouchers found</h3>
        <p className="text-sm text-ink-500 mt-1 max-w-md mx-auto">
          There are no expense vouchers matching your criteria. Try adjusting the search filters or create a new voucher.
        </p>
        {userRole === 'EMPLOYEE' && (
          <div className="mt-5">
            <Link to="/employee/vouchers/new" className="btn-primary">
              + Create New Voucher
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="table-head">
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
          <tbody className="divide-y divide-ink-100">
            {vouchers.map((v) => {
              const detailUrl =
                userRole === 'EMPLOYEE'
                  ? `/employee/vouchers/${v.id}`
                  : userRole === 'DIRECTOR'
                  ? `/director/vouchers/${v.id}`
                  : `/accounts/vouchers/${v.id}`;

              return (
                <tr key={v.id} className="table-row group">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-700">
                    <Link to={detailUrl} className="hover:underline">
                      {v.voucherNumber}
                    </Link>
                  </td>

                  {showEmployeeCol && (
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-ink-800">{v.employee?.name || '—'}</div>
                      <div className="text-xs text-ink-400">{v.employee?.email}</div>
                    </td>
                  )}

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-ink-800 line-clamp-1">{v.expenseTitle}</div>
                    <span className="inline-block text-[11px] font-medium text-ink-500 bg-ink-100 px-2 py-0.5 rounded-md mt-0.5">
                      {v.expenseCategory.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-ink-600">{v.departmentName}</td>

                  <td className="py-3.5 px-4 text-ink-600 whitespace-nowrap">
                    {new Date(v.expenseDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right font-semibold text-ink-800 whitespace-nowrap">
                    ${Number(v.amount).toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={v.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={detailUrl}
                        className="p-1.5 text-ink-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {userRole === 'EMPLOYEE' && v.status === 'DRAFT' && (
                        <>
                          <Link
                            to={`/employee/vouchers/${v.id}/edit`}
                            className="p-1.5 text-ink-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Draft"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {onSubmit && (
                            <button
                              type="button"
                              onClick={() => onSubmit(v)}
                              className="p-1.5 text-ink-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Submit for Approval"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(v.id)}
                              className="p-1.5 text-ink-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {userRole === 'DIRECTOR' && v.status === 'PENDING_APPROVAL' && (
                        <>
                          {onQuickApprove && (
                            <button
                              type="button"
                              onClick={() => onQuickApprove(v)}
                              className="p-1.5 text-ink-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve Voucher"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {onQuickReject && (
                            <button
                              type="button"
                              onClick={() => onQuickReject(v)}
                              className="p-1.5 text-ink-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-200 bg-ink-50/50 text-xs text-ink-600">
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
              className="p-1.5 border border-ink-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-1.5 border border-ink-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
