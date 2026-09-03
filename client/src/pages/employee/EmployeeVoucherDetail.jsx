import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { voucherApi } from '../../api/voucherApi';
import StatusBadge from '../../components/StatusBadge';
import SignatureModal from '../../components/SignatureModal';
import VoucherPrintView from '../../components/VoucherPrintView';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  Tag,
  Edit,
  Send,
  Trash2,
  Printer,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function EmployeeVoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [showSigModal, setShowSigModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const res = await voucherApi.getById(id);
      setVoucher(res.data.voucher);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch voucher details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSigSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `${API_ROOT}${url}`;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this draft voucher?')) return;
    try {
      await voucherApi.delete(id);
      navigate('/employee/vouchers');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete voucher.');
    }
  };

  const handleSubmit = async () => {
    if (!voucher.employeeSignatureUrl) {
      setShowSigModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await voucherApi.submit(id);
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit voucher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignatureSave = async (sigData) => {
    try {
      setIsSubmitting(true);
      if (sigData.type === 'file') {
        await voucherApi.uploadSignature(id, sigData.file);
      } else {
        await voucherApi.update(id, { signatureBase64: sigData.data });
      }

      await voucherApi.submit(id);
      setShowSigModal(false);
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save signature and submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading voucher details...
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Unable to view voucher</h3>
        <p className="text-sm text-slate-500 mt-1">{error || 'Voucher not found.'}</p>
        <Link
          to="/employee/vouchers"
          className="inline-block mt-4 text-sm font-semibold text-brand-600 hover:underline"
        >
          &larr; Back to My Vouchers
        </Link>
      </div>
    );
  }

  if (isPrintMode) {
    return <VoucherPrintView voucher={voucher} onBack={() => setIsPrintMode(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/employee/vouchers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Vouchers
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 font-mono tracking-tight">
              {voucher.voucherNumber}
            </h1>
            <StatusBadge status={voucher.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {voucher.status === 'DRAFT' && (
            <>
              <Link
                to={`/employee/vouchers/${voucher.id}/edit`}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit for Approval
              </button>
            </>
          )}

          <button
            onClick={() => setIsPrintMode(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Printable View
          </button>
        </div>
      </div>

      {/* Rejection Alert if Rejected */}
      {voucher.status === 'REJECTED' && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-start gap-3.5">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Voucher Rejected by Director</h4>
            <p className="text-xs mt-1 leading-relaxed">{voucher.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expense Title</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{voucher.expenseTitle}</h2>
          {voucher.expenseDescription && (
            <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {voucher.expenseDescription}
            </p>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Amount
            </span>
            <span className="text-xl font-bold text-slate-800 mt-1 block">
              ${Number(voucher.amount).toFixed(2)}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Department
            </span>
            <span className="font-semibold text-slate-800 mt-1 block truncate">
              {voucher.departmentName}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Category
            </span>
            <span className="font-semibold text-slate-800 mt-1 block truncate">
              {voucher.expenseCategory.replace('_', ' ')}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Expense Date
            </span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {new Date(voucher.expenseDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Signatures & Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Signature */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Claimant Signature (Employee)</span>
                {voucher.employeeSignatureUrl ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Signed
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Not signed
                  </span>
                )}
              </div>
              <div className="h-24 bg-white rounded-lg border border-dashed border-slate-200 flex items-center justify-center p-2">
                {voucher.employeeSignatureUrl ? (
                  <img
                    src={getSigSrc(voucher.employeeSignatureUrl)}
                    alt="Employee Signature"
                    className="max-h-20 object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">No signature on file</span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>Employee: {voucher.employee?.name}</span>
                <span>{voucher.submittedAt ? new Date(voucher.submittedAt).toLocaleDateString() : 'Draft'}</span>
              </div>
            </div>

            {/* Director Signature */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Approval Signature (Director)</span>
                {voucher.directorSignatureUrl ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                ) : voucher.status === 'REJECTED' ? (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Rejected
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Pending Review</span>
                )}
              </div>
              <div className="h-24 bg-white rounded-lg border border-dashed border-slate-200 flex items-center justify-center p-2">
                {voucher.directorSignatureUrl ? (
                  <img
                    src={getSigSrc(voucher.directorSignatureUrl)}
                    alt="Director Signature"
                    className="max-h-20 object-contain"
                  />
                ) : voucher.status === 'REJECTED' ? (
                  <span className="text-xs text-rose-500 font-bold uppercase">REJECTED</span>
                ) : (
                  <span className="text-xs text-slate-400 italic">Awaiting Director Signature</span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>Director: {voucher.director?.name || '—'}</span>
                <span>{voucher.approvalDate ? new Date(voucher.approvalDate).toLocaleDateString() : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log / Activity Trail */}
        {voucher.auditLogs && voucher.auditLogs.length > 0 && (
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Workflow History & Audit Trail
            </h3>
            <div className="space-y-2">
              {voucher.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">
                      {log.action}
                    </span>
                    <span className="text-slate-700">{log.notes || 'Action recorded'}</span>
                  </div>
                  <div className="text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSigModal}
        onClose={() => setShowSigModal(false)}
        onSave={handleSignatureSave}
        title="Attach Employee Signature to Submit"
      />
    </div>
  );
}
