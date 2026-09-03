import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { voucherApi } from '../../api/voucherApi';
import SearchFilterBar from '../../components/SearchFilterBar';
import VoucherTable from '../../components/VoucherTable';
import SignatureModal from '../../components/SignatureModal';
import { PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EmployeeVoucherList() {
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
  const [pendingSubmitVoucher, setPendingSubmitVoucher] = useState(null);
  const [showSigModal, setShowSigModal] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft voucher?')) return;
    try {
      await voucherApi.delete(id);
      showToast('success', 'Draft voucher deleted successfully.');
      fetchVouchers();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete voucher.');
    }
  };

  const handleSubmitVoucher = async (voucher) => {
    // If no signature, prompt user to attach signature first
    if (!voucher.employeeSignatureUrl) {
      setPendingSubmitVoucher(voucher);
      setShowSigModal(true);
      return;
    }

    try {
      await voucherApi.submit(voucher.id);
      showToast('success', `Voucher ${voucher.voucherNumber} submitted for Director approval!`);
      fetchVouchers();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to submit voucher.');
    }
  };

  const handleSignatureSave = async (sigData) => {
    if (!pendingSubmitVoucher) return;
    try {
      if (sigData.type === 'file') {
        await voucherApi.uploadSignature(pendingSubmitVoucher.id, sigData.file);
      } else {
        await voucherApi.update(pendingSubmitVoucher.id, { signatureBase64: sigData.data });
      }

      // After saving signature, automatically submit
      await voucherApi.submit(pendingSubmitVoucher.id);
      showToast('success', `Signature attached and voucher ${pendingSubmitVoucher.voucherNumber} submitted!`);
      setShowSigModal(false);
      setPendingSubmitVoucher(null);
      fetchVouchers();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to attach signature and submit.');
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
      {/* Top Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Expense Vouchers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal reimbursement claims, drafts, and submissions.
          </p>
        </div>
        <Link
          to="/employee/vouchers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Voucher
        </Link>
      </div>

      {/* Notifications */}
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

      {/* Search & Filter Toolbar */}
      <SearchFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Vouchers Table */}
      <VoucherTable
        vouchers={vouchers}
        pagination={pagination}
        isLoading={isLoading}
        userRole="EMPLOYEE"
        onPageChange={(page) => setFilters({ ...filters, page })}
        onDelete={handleDelete}
        onSubmit={handleSubmitVoucher}
      />

      {/* Signature Modal for submission if signature missing */}
      <SignatureModal
        isOpen={showSigModal}
        onClose={() => {
          setShowSigModal(false);
          setPendingSubmitVoucher(null);
        }}
        onSave={handleSignatureSave}
        title={`Attach Signature to Submit Voucher ${pendingSubmitVoucher?.voucherNumber}`}
      />
    </div>
  );
}
