import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import BlockchainPage from './pages/BlockchainPage';
import AIPage from './pages/AIPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import UserManagementPage from './pages/UserManagementPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminRoute from './components/auth/AdminRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-accent/30 selection:text-accent">
              <Toaster position="top-right" toastOptions={{
                className: '!bg-dark-card !text-white !border !border-dark-border !shadow-2xl !font-medium',
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                duration: 4000
              }} />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Protected Routes inside DashboardLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/blockchain" element={
                      <AdminRoute>
                        <BlockchainPage />
                      </AdminRoute>
                    } />
                    <Route path="/ai" element={
                      <AdminRoute>
                        <AIPage />
                      </AdminRoute>
                    } />
                    <Route path="/reports" element={
                      <AdminRoute>
                        <ReportsPage />
                      </AdminRoute>
                    } />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/admin/users" element={
                      <AdminRoute>
                        <UserManagementPage />
                      </AdminRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>

                {/* Catch all to 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
