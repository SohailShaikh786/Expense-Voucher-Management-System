import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserCheck, ShieldCheck, Calculator, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 p-4">
      <div className="max-w-md w-full">
        {/* Brand Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md mb-3">
              EV
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Expense Voucher System</h1>
            <p className="text-xs text-slate-500 mt-1">ABC Company Digital Reimbursement Portal</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@abccompany.com"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In to Account</span>
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              1-Click Demo Login (Internship Review)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('john.doe@abccompany.com', 'Employee@123')}
                disabled={isLoading}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-center transition-colors group"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-blue-900">Employee</span>
                <span className="block text-[10px] text-blue-600 truncate">John Doe</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('director@abccompany.com', 'Director@123')}
                disabled={isLoading}
                className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-center transition-colors group"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-purple-900">Director</span>
                <span className="block text-[10px] text-purple-600 truncate">S. Jenkins</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('accounts@abccompany.com', 'Accounts@123')}
                disabled={isLoading}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center transition-colors group"
              >
                <Calculator className="w-4 h-4 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-emerald-900">Accounts</span>
                <span className="block text-[10px] text-emerald-600 truncate">D. Miller</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              New employee?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:underline">
                Create an employee account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
