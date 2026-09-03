import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout & Route Guards
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeVoucherList from './pages/employee/EmployeeVoucherList';
import VoucherCreateEditPage from './pages/employee/VoucherCreateEditPage';
import EmployeeVoucherDetail from './pages/employee/EmployeeVoucherDetail';

// Director Pages
import DirectorDashboard from './pages/director/DirectorDashboard';
import DirectorPendingQueue from './pages/director/DirectorPendingQueue';
import DirectorVoucherList from './pages/director/DirectorVoucherList';
import DirectorVoucherDetail from './pages/director/DirectorVoucherDetail';

// Accounts Pages
import AccountsDashboard from './pages/accounts/AccountsDashboard';
import AccountsVoucherList from './pages/accounts/AccountsVoucherList';
import AccountsVoucherDetail from './pages/accounts/AccountsVoucherDetail';

function RootRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'DIRECTOR') return <Navigate to="/director/dashboard" replace />;
  if (user.role === 'ACCOUNTS') return <Navigate to="/accounts/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Protected App Layout */}
      <Route element={<AppLayout />}>
        {/* 1. Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeVoucherList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers/new"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <VoucherCreateEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeVoucherDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vouchers/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <VoucherCreateEditPage />
            </ProtectedRoute>
          }
        />

        {/* 2. Director Routes */}
        <Route
          path="/director/dashboard"
          element={
            <ProtectedRoute allowedRoles={['DIRECTOR']}>
              <DirectorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/director/pending"
          element={
            <ProtectedRoute allowedRoles={['DIRECTOR']}>
              <DirectorPendingQueue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/director/vouchers"
          element={
            <ProtectedRoute allowedRoles={['DIRECTOR']}>
              <DirectorVoucherList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/director/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={['DIRECTOR']}>
              <DirectorVoucherDetail />
            </ProtectedRoute>
          }
        />

        {/* 3. Accounts Routes */}
        <Route
          path="/accounts/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ACCOUNTS']}>
              <AccountsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/vouchers"
          element={
            <ProtectedRoute allowedRoles={['ACCOUNTS']}>
              <AccountsVoucherList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={['ACCOUNTS']}>
              <AccountsVoucherDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
