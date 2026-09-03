import React from 'react';
import { Printer, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VoucherPrintView({ voucher, onBack }) {
  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  const getSigSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `${API_ROOT}${url}`;
  };

  return (
    <div>
      {/* Top action bar (hidden in print) */}
      <div className="no-print flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Voucher Details
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* Official Voucher Document Sheet */}
      <div className="bg-white p-8 md:p-12 border border-slate-300 rounded-2xl shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl tracking-tighter">
                ABC
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">ABC COMPANY INC.</h1>
                <p className="text-xs text-slate-500 font-medium">Corporate Finance & Reimbursement Division</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wide text-slate-800">EXPENSE VOUCHER</h2>
            <p className="font-mono text-base font-bold text-brand-700 mt-1">{voucher.voucherNumber}</p>
            <div className="mt-1">
              <StatusBadge status={voucher.status} />
            </div>
          </div>
        </div>

        {/* Voucher Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Voucher Date</span>
            <span className="font-medium text-slate-800">
              {new Date(voucher.voucherDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Expense Date</span>
            <span className="font-medium text-slate-800">
              {new Date(voucher.expenseDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Department</span>
            <span className="font-medium text-slate-800">{voucher.departmentName}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase">Expense Category</span>
            <span className="font-medium text-slate-800">{voucher.expenseCategory.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Employee Details */}
        <div className="mb-6 p-4 rounded-xl border border-slate-200 text-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Claimant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-500">Employee Name:</span>
              <p className="font-semibold text-slate-800">{voucher.employee?.name}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Employee Email:</span>
              <p className="font-medium text-slate-800">{voucher.employee?.email}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Department:</span>
              <p className="font-medium text-slate-800">{voucher.employee?.department || voucher.departmentName}</p>
            </div>
          </div>
        </div>

        {/* Rejection Alert if Rejected */}
        {voucher.status === 'REJECTED' && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-6 text-rose-800 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Voucher Rejected by Director</h4>
              <p className="text-xs mt-1 leading-relaxed">{voucher.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Expense Item Details Table */}
        <div className="mb-8">
          <table className="w-full border-collapse text-left text-sm border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Expense Title & Description</th>
                <th className="py-3 px-4 w-36">Category</th>
                <th className="py-3 px-4 w-32 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-4 px-4 text-center font-medium text-slate-400">1</td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-900">{voucher.expenseTitle}</div>
                  {voucher.expenseDescription && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {voucher.expenseDescription}
                    </p>
                  )}
                </td>
                <td className="py-4 px-4 font-medium text-slate-700">
                  {voucher.expenseCategory.replace('_', ' ')}
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-900">
                  ${Number(voucher.amount).toFixed(2)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td colSpan="3" className="py-3 px-4 text-right uppercase text-xs tracking-wider text-slate-600">
                  Total Reimbursable Claim:
                </td>
                <td className="py-3 px-4 text-right text-lg text-brand-700 font-extrabold">
                  ${Number(voucher.amount).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Dual Signatures & Approvals Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-slate-200 pt-6">
          {/* Employee Signature */}
          <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Claimant Signature (Employee)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">I certify these expenses are true and incurred for official company business.</p>
            </div>
            <div className="my-3 flex items-center justify-center h-20 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              {voucher.employeeSignatureUrl ? (
                <img
                  src={getSigSrc(voucher.employeeSignatureUrl)}
                  alt="Employee Signature"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400 italic">No signature on file</span>
              )}
            </div>
            <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 flex justify-between">
              <span>Name: <strong className="text-slate-800">{voucher.employee?.name}</strong></span>
              <span>
                Date: {voucher.submittedAt ? new Date(voucher.submittedAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>

          {/* Director Signature */}
          <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Executive Approval (Director)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Approved under corporate expense reimbursement guidelines.</p>
            </div>
            <div className="my-3 flex items-center justify-center h-20 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              {voucher.directorSignatureUrl ? (
                <img
                  src={getSigSrc(voucher.directorSignatureUrl)}
                  alt="Director Signature"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : voucher.status === 'REJECTED' ? (
                <span className="text-xs text-rose-600 font-semibold">REJECTED BY DIRECTOR</span>
              ) : (
                <span className="text-xs text-slate-400 italic">Pending Director Signature</span>
              )}
            </div>
            <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 flex justify-between">
              <span>
                Director:{' '}
                <strong className="text-slate-800">
                  {voucher.director?.name || (voucher.status === 'APPROVED' ? 'Executive Director' : '—')}
                </strong>
              </span>
              <span>
                Date:{' '}
                {voucher.approvalDate
                  ? new Date(voucher.approvalDate).toLocaleDateString()
                  : voucher.status === 'APPROVED'
                  ? new Date(voucher.updatedAt).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Generated automatically by ABC Company Expense Voucher Management System &bull; Confidential
        </div>
      </div>
    </div>
  );
}
