import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { voucherApi } from '../../api/voucherApi';
import { useAuth } from '../../context/AuthContext';
import SignatureModal from '../../components/SignatureModal';
import {
  Save,
  Send,
  PenTool,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const CATEGORIES = [
  { value: 'TRAVEL', label: 'Travel & Transportation' },
  { value: 'FOOD', label: 'Food & Meals' },
  { value: 'ACCOMMODATION', label: 'Hotel & Accommodation' },
  { value: 'OFFICE_SUPPLIES', label: 'Office Supplies & Stationery' },
  { value: 'EQUIPMENT', label: 'Hardware & Equipment' },
  { value: 'UTILITIES', label: 'Utilities & Internet' },
  { value: 'TRAINING', label: 'Training, Seminars & Exams' },
  { value: 'OTHER', label: 'Other Business Expenses' }
];

const voucherSchema = z.object({
  departmentName: z.string().min(2, 'Department name must be at least 2 characters'),
  expenseTitle: z.string().min(3, 'Expense title must be at least 3 characters'),
  expenseDate: z.string().min(1, 'Expense date is mandatory'),
  expenseCategory: z.string().min(1, 'Please select a category'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  expenseDescription: z.string().max(1000, 'Description cannot exceed 1000 characters').optional()
});

export default function VoucherCreateEditPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureData, setSignatureData] = useState(null); // { type: 'base64', data } or { type: 'file', file }
  const [showSigModal, setShowSigModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      departmentName: user?.department || 'Engineering',
      expenseTitle: '',
      expenseDate: new Date().toISOString().split('T')[0],
      expenseCategory: 'TRAVEL',
      amount: '',
      expenseDescription: ''
    }
  });

  const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  useEffect(() => {
    if (isEditMode) {
      loadVoucher();
    }
  }, [id]);

  const loadVoucher = async () => {
    try {
      setIsLoadingVoucher(true);
      const res = await voucherApi.getById(id);
      const v = res.data.voucher;

      if (v.status !== 'DRAFT') {
        alert('This voucher has already been submitted and cannot be edited.');
        navigate(`/employee/vouchers/${id}`);
        return;
      }

      setValue('departmentName', v.departmentName);
      setValue('expenseTitle', v.expenseTitle);
      setValue('expenseDate', new Date(v.expenseDate).toISOString().split('T')[0]);
      setValue('expenseCategory', v.expenseCategory);
      setValue('amount', Number(v.amount));
      setValue('expenseDescription', v.expenseDescription || '');

      if (v.employeeSignatureUrl) {
        const fullUrl = v.employeeSignatureUrl.startsWith('http')
          ? v.employeeSignatureUrl
          : `${API_ROOT}${v.employeeSignatureUrl}`;
        setSignaturePreview(fullUrl);
      }
    } catch (err) {
      setServerError('Failed to load voucher for editing.');
    } finally {
      setIsLoadingVoucher(false);
    }
  };

  const handleSignatureSave = (sig) => {
    setSignatureData(sig);
    if (sig.type === 'base64') {
      setSignaturePreview(sig.data);
    } else {
      setSignaturePreview(sig.preview);
    }
  };

  const clearSignature = () => {
    setSignatureData(null);
    setSignaturePreview(null);
  };

  const onFormSubmit = async (values, shouldSubmit = false) => {
    setServerError('');

    if (shouldSubmit && !signaturePreview && !signatureData) {
      setServerError('Employee signature is mandatory before submitting for approval. Please attach your signature.');
      setShowSigModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        ...(signatureData?.type === 'base64' && { signatureBase64: signatureData.data }),
        ...(signaturePreview && !signatureData && { employeeSignatureUrl: signaturePreview.replace(API_ROOT, '') })
      };

      let voucherId = id;

      if (isEditMode) {
        const res = await voucherApi.update(id, payload);
        voucherId = res.data.voucher.id;
        if (signatureData?.type === 'file') {
          await voucherApi.uploadSignature(voucherId, signatureData.file);
        }
      } else {
        const res = await voucherApi.create(payload);
        voucherId = res.data.voucher.id;
        if (signatureData?.type === 'file') {
          await voucherApi.uploadSignature(voucherId, signatureData.file);
        }
      }

      if (shouldSubmit) {
        await voucherApi.submit(voucherId);
      }

      navigate(`/employee/vouchers/${voucherId}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save voucher. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingVoucher) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading voucher details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button and page title */}
      <div className="mb-6">
        <Link
          to="/employee/vouchers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Vouchers
        </Link>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Expense Voucher (Draft)' : 'Create New Expense Voucher'}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Enter expense claim details and attach your signature for reimbursement approval.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Form */}
      <form className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Department *
            </label>
            <input
              type="text"
              {...register('departmentName')}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="e.g. Engineering"
            />
            {errors.departmentName && (
              <p className="text-xs text-rose-600 mt-1">{errors.departmentName.message}</p>
            )}
          </div>

          {/* Expense Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Expense Date *
            </label>
            <input
              type="date"
              {...register('expenseDate')}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
            />
            {errors.expenseDate && (
              <p className="text-xs text-rose-600 mt-1">{errors.expenseDate.message}</p>
            )}
          </div>
        </div>

        {/* Expense Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Expense Title *
          </label>
          <input
            type="text"
            {...register('expenseTitle')}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="e.g. Client Dinner Meeting at Summit Club"
          />
          {errors.expenseTitle && (
            <p className="text-xs text-rose-600 mt-1">{errors.expenseTitle.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              {...register('expenseCategory')}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.expenseCategory && (
              <p className="text-xs text-rose-600 mt-1">{errors.expenseCategory.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Amount ($ USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount')}
                className="w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold text-slate-800"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-600 mt-1">{errors.amount.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Expense Description / Business Purpose (Optional)
          </label>
          <textarea
            rows={3}
            {...register('expenseDescription')}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="Explain the business context, attendees, or justification for reimbursement..."
          />
          {errors.expenseDescription && (
            <p className="text-xs text-rose-600 mt-1">{errors.expenseDescription.message}</p>
          )}
        </div>

        {/* Employee Signature Block */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Employee Signature <span className="text-rose-500">* (Required to submit)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
            {signaturePreview ? (
              <div className="flex items-center gap-4 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <img
                  src={signaturePreview}
                  alt="Employee Signature"
                  className="h-16 w-36 object-contain border border-slate-100 rounded bg-slate-50"
                />
                <div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signature Attached
                  </span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove / Re-sign
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                No signature attached yet. You can save as draft now or sign to submit.
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSigModal(true)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs transition-colors ml-auto"
            >
              <PenTool className="w-3.5 h-3.5 text-brand-600" />
              {signaturePreview ? 'Change Signature' : 'Draw or Upload Signature'}
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to="/employee/vouchers"
            className="w-full sm:w-auto px-4 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onFormSubmit(data, false))}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit((data) => onFormSubmit(data, true))}
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Submit for Approval</span>
          </button>
        </div>
      </form>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSigModal}
        onClose={() => setShowSigModal(false)}
        onSave={handleSignatureSave}
        title="Attach Employee Signature"
      />
    </div>
  );
}
