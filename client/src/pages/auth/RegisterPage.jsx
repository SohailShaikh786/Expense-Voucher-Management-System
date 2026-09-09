import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, AlertCircle, Receipt } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Engineering'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ ...formData, role: 'EMPLOYEE' });
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-950">
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-ink-950 to-brand-900" />
        <div
          className="absolute inset-0 opacity-40 bg-auth-grid"
          style={{ backgroundSize: '48px 48px' }}
        />
        <div className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-brand-400/15 blur-3xl" />

        <div className="relative z-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">ABC Expense</p>
              <p className="text-xs text-brand-200/80 tracking-wide">Voucher Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
            Join the employee portal.
          </h1>
          <p className="mt-4 text-brand-100/75 text-base leading-relaxed">
            Create your account to submit expense vouchers and track approvals from draft to reimbursement.
          </p>
        </div>

        <p className="relative z-10 text-xs text-brand-200/40">ABC Company · Employee registration</p>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10 bg-ink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
        <div className="relative w-full max-w-md animate-scale-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-glow">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">ABC Expense</p>
              <p className="text-[11px] text-ink-500">Create employee account</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink-200/80 shadow-lift p-7 sm:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">Create account</h2>
              <p className="text-sm text-ink-500 mt-1">Employees only — directors & accounts are provisioned by admin</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alice Cooper"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alice@abccompany.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="label-field">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Create Employee Account</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-ink-100 text-center">
              <p className="text-xs text-ink-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
