import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WalletProvider } from './contexts/WalletContext';
import { useAuth } from './contexts/AuthContext';
import { ToastContainerComponent } from './utils/toast';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Marketplace from './pages/Marketplace';
import News from './pages/News';
import Support from './pages/Support';
import FirebaseAuth from './components/auth/FirebaseAuth';
import ResetPassword from './components/auth/ResetPassword';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import FatesFaces from './pages/FatesFaces';
import Favorites from './pages/Favorites';
import './utils/toast.css';
import './App.css';
import './i18n';

// کامپوننت برای محافظت از مسیرهای نیازمند احراز هویت
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// کامپوننت برای هدایت کاربران لاگین شده از صفحات ورود
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }

  if (user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

// کامپوننت اصلی برنامه
function App() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  
  return (
    <WalletProvider>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            {/* صفحات عمومی */}
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/fates-faces" element={<FatesFaces />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/news" element={<News />} />
            <Route path="/support" element={<Support />} />
            
            {/* صفحات مربوط به احراز هویت */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <FirebaseAuth mode="login" />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <FirebaseAuth mode="register" />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/verify-email" 
              element={<VerifyEmail />}
            />
            
            {/* صفحات نیازمند احراز هویت */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* صفحه 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <ToastContainerComponent />
      </div>
    </WalletProvider>
  );
}

export default App;