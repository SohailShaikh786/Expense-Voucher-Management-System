import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserCheck, ShieldCheck, Calculator, AlertCircle, Receipt } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);

    try {
      const user = await login(demoEmail, demoPassword);
      redirectUser(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (role) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login')) {
      navigate(from, { replace: true });
      return;
    }

    if (role === 'DIRECTOR') navigate('/director/dashboard', { replace: true });
    else if (role === 'ACCOUNTS') navigate('/accounts/dashboard', { replace: true });
    else navigate('/employee/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-950">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-ink-950 to-brand-900" />
        <div
          className="absolute inset-0 opacity-40 bg-auth-grid"
          style={{ backgroundSize: '48px 48px' }}
        />
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl animate-fade-in" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />

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

        <div className="relative z-10 max-w-md animate-fade-up" style={{ animationDelay: '120ms' }}>
          <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
            Reimbursements, reviewed with clarity.
          </h1>
          <p className="mt-4 text-brand-100/75 text-base leading-relaxed">
            Submit claims, route approvals, and keep a clean audit trail — built for employees, directors, and accounts.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-brand-300">3</p>
              <p className="text-brand-100/60 text-xs mt-1">Role workspaces</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-brand-300">1</p>
              <p className="text-brand-100/60 text-xs mt-1">Approval path</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-brand-300">∞</p>
              <p className="text-brand-100/60 text-xs mt-1">Audit history</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-brand-200/40 animate-fade-in" style={{ animationDelay: '200ms' }}>
          ABC Company · Digital reimbursement portal
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-10 bg-ink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
        <div className="relative w-full max-w-md animate-scale-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-glow">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">ABC Expense</p>
              <p className="text-[11px] text-ink-500">Voucher Management</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink-200/80 shadow-lift p-7 sm:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">Welcome back</h2>
              <p className="text-sm text-ink-500 mt-1">Sign in to your workspace</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label-field">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@abccompany.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-ink-100">
              <p className="text-[11px] font-semibold tracking-wide text-ink-400 text-center mb-3">
                Demo access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('john.doe@abccompany.com', 'Employee@123')}
                  disabled={isLoading}
                  className="p-2.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl text-center transition-all group"
                >
                  <UserCheck className="w-4 h-4 text-brand-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-brand-900">Employee</span>
                  <span className="block text-[10px] text-brand-600 truncate">John Doe</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('director@abccompany.com', 'Director@123')}
                  disabled={isLoading}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center transition-all group"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-amber-900">Director</span>
                  <span className="block text-[10px] text-amber-700 truncate">S. Jenkins</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('accounts@abccompany.com', 'Accounts@123')}
                  disabled={isLoading}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center transition-all group"
                >
                  <Calculator className="w-4 h-4 text-emerald-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-emerald-900">Accounts</span>
                  <span className="block text-[10px] text-emerald-700 truncate">D. Miller</span>
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs text-ink-500">
                New employee?{' '}
                <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
