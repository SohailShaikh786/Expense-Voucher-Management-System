import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { voucherApi } from '../../api/voucherApi';
import SignatureModal from '../../components/SignatureModal';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  X,
  Send,
  FileCheck
} from 'lucide-react';

export default function DirectorPendingQueue() {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Approval Modal state
  const [activeApproveVoucher, setActiveApproveVoucher] = useState(null);
  const [showSigModal, setShowSigModal] = useState(false);

  // Rejection Modal state
  const [activeRejectVoucher, setActiveRejectVoucher] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  const fetchPendingQueue = async () => {
    try {
      setIsLoading(true);
      const res = await voucherApi.list({ status: 'PENDING_APPROVAL', limit: 100 });
      setVouchers(res.data.vouchers);
    } catch (err) {
      console.error('Failed to load pending vouchers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenApprove = (voucher) => {
    setActiveApproveVoucher(voucher);
    setShowSigModal(true);
  };

  const handleDirectorSignatureSave = async (sigData) => {
    if (!activeApproveVoucher) return;
    try {
      setIsProcessing(true);
      if (sigData.type === 'file') {
        await voucherApi.approve(activeApproveVoucher.id, {}, sigData.file);
      } else {
        await voucherApi.approve(activeApproveVoucher.id, { signatureBase64: sigData.data });
      }

      showToast('success', `Voucher ${activeApproveVoucher.voucherNumber} approved successfully!`);
      setShowSigModal(false);
      setActiveApproveVoucher(null);
      fetchPendingQueue();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve voucher.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenReject = (voucher) => {
    setActiveRejectVoucher(voucher);
    setRejectionReason('');
    setRejectError('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
      setRejectError('A meaningful rejection reason (at least 5 characters) is mandatory.');
      return;
    }

    try {
      setIsProcessing(true);
      await voucherApi.reject(activeRejectVoucher.id, rejectionReason.trim());
      showToast('success', `Voucher ${activeRejectVoucher.voucherNumber} has been rejected.`);
      setActiveRejectVoucher(null);
      fetchPendingQueue();
    } catch (err) {
      setRejectError(err.response?.data?.message || 'Failed to reject voucher.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-amber-500" />
            Pending Approval Queue
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Actionable list of employee expense claims awaiting your executive signature or rejection.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
          {vouchers.length} Vouchers Pending Review
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Pending Vouchers List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-16 bg-slate-100 rounded"></div>
          <div className="h-16 bg-slate-100 rounded"></div>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Approval Queue is Clear!</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            All submitted expense vouchers have been reviewed and processed.
          </p>
          <div className="mt-5">
            <Link
              to="/director/vouchers"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              View All Organization Vouchers &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-brand-700">
                    {v.voucherNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                    Submitted {new Date(v.submittedAt || v.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  ${Number(v.amount).toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Employee</span>
                  <span className="font-bold text-slate-800">{v.employee?.name}</span>
                  <span className="text-xs text-slate-400 block">{v.employee?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Department & Category</span>
                  <span className="font-medium text-slate-800">{v.departmentName}</span>
                  <span className="text-xs text-slate-500 block">{v.expenseCategory.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Expense Title</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{v.expenseTitle}</span>
                  <span className="text-xs text-slate-500 block">
                    Expense date: {new Date(v.expenseDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {v.expenseDescription && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  {v.expenseDescription}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <Link
                  to={`/director/vouchers/${v.id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Full Voucher Details
                </Link>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenReject(v)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject (With Reason)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenApprove(v)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve with Signature
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Signature Modal for Director Approval */}
      <SignatureModal
        isOpen={showSigModal}
        onClose={() => {
          setShowSigModal(false);
          setActiveApproveVoucher(null);
        }}
        onSave={handleDirectorSignatureSave}
        title={`Director Approval Signature — Voucher ${activeApproveVoucher?.voucherNumber}`}
      />

      {/* Rejection Reason Modal */}
      {activeRejectVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Reject Expense Voucher</h3>
              </div>
              <button
                onClick={() => setActiveRejectVoucher(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Please provide a mandatory reason for rejecting voucher{' '}
                  <strong className="text-slate-800">{activeRejectVoucher.voucherNumber}</strong>. The employee will see this explanation.
                </p>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Missing detailed tax invoice, exceeds daily meal allowance without prior approval..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {rejectError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {rejectError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveRejectVoucher(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
