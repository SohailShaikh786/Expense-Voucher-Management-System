import React, { useState, useEffect } from 'react';
import { voucherApi } from '../../api/voucherApi';
import SearchFilterBar from '../../components/SearchFilterBar';
import VoucherTable from '../../components/VoucherTable';
import SignatureModal from '../../components/SignatureModal';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

export default function DirectorVoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    department: '',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const [notification, setNotification] = useState(null);
  const [activeApproveVoucher, setActiveApproveVoucher] = useState(null);
  const [showSigModal, setShowSigModal] = useState(false);
  const [activeRejectVoucher, setActiveRejectVoucher] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, [filters]);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const res = await voucherApi.list(filters);
      setVouchers(res.data.vouchers);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleQuickApprove = (voucher) => {
    setActiveApproveVoucher(voucher);
    setShowSigModal(true);
  };

  const handleDirectorSignatureSave = async (sigData) => {
    if (!activeApproveVoucher) return;
    try {
      if (sigData.type === 'file') {
        await voucherApi.approve(activeApproveVoucher.id, {}, sigData.file);
      } else {
        await voucherApi.approve(activeApproveVoucher.id, { signatureBase64: sigData.data });
      }

      showToast('success', `Voucher ${activeApproveVoucher.voucherNumber} approved!`);
      setShowSigModal(false);
      setActiveApproveVoucher(null);
      fetchVouchers();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve voucher.');
    }
  };

  const handleQuickReject = (voucher) => {
    setActiveRejectVoucher(voucher);
    setRejectionReason('');
    setRejectError('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
      setRejectError('Rejection reason must be at least 5 characters long.');
      return;
    }

    try {
      await voucherApi.reject(activeRejectVoucher.id, rejectionReason.trim());
      showToast('success', `Voucher ${activeRejectVoucher.voucherNumber} rejected.`);
      setActiveRejectVoucher(null);
      fetchVouchers();
    } catch (err) {
      setRejectError(err.response?.data?.message || 'Failed to reject voucher.');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      department: '',
      amountMin: '',
      amountMax: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Organization Vouchers</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Comprehensive repository of all company expense vouchers with search and filter controls.
        </p>
      </div>

      {notification && (
        <div
          className={`mb-5 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
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

      <SearchFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      <VoucherTable
        vouchers={vouchers}
        pagination={pagination}
        isLoading={isLoading}
        userRole="DIRECTOR"
        onPageChange={(page) => setFilters({ ...filters, page })}
        onQuickApprove={handleQuickApprove}
        onQuickReject={handleQuickReject}
      />

      <SignatureModal
        isOpen={showSigModal}
        onClose={() => {
          setShowSigModal(false);
          setActiveApproveVoucher(null);
        }}
        onSave={handleDirectorSignatureSave}
        title={`Executive Signature — Voucher ${activeApproveVoucher?.voucherNumber}`}
      />

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
                  Enter rejection reason for voucher{' '}
                  <strong className="text-slate-800">{activeRejectVoucher.voucherNumber}</strong>:
                </p>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Policy cap exceeded, missing supporting receipt..."
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
