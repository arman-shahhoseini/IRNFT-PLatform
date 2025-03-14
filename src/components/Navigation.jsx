import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { truncateAddress } from '../utils/helpers';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { account, balance, connectWallet, disconnectWallet } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // بستن منو با تغییر مسیر
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // بستن منو با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const hamburger = document.querySelector('.hamburger');
      if (
        mobileMenu &&
        !mobileMenu.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('language', newLang);
  };

  const navLinks = [
    { path: '/', label: t('home'), icon: 'home' },
    { path: '/collections', label: t('collections'), icon: 'grid_view' },
    { path: '/marketplace', label: t('marketplace'), icon: 'store' },
    { path: '/news', label: t('news'), icon: 'newspaper' },
  ];

  if (isAuthenticated) {
    navLinks.push({ path: '/dashboard', label: t('dashboard'), icon: 'dashboard' });
  }

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-content">
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="IRNFT" />
          </Link>
        </div>

        <div className="nav-right">
          <button
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('toggleMenu')}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="language-switcher">
            <button
              className={`language-btn ${i18n.language === 'fa' ? 'active' : ''}`}
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
            >
              {i18n.language === 'fa' ? 'EN' : 'فا'}
            </button>
          </div>
        </div>

        <div className="mobile-menu-content">
          <div className="auth-section">
            {account ? (
              <div className="wallet-info">
                <span className="wallet-address">{truncateAddress(account)}</span>
                <span className="wallet-balance">{balance} ETH</span>
                <button
                  className="disconnect-wallet-btn"
                  onClick={() => {
                    disconnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <i className="material-icons">link_off</i>
                  {t('disconnect')}
                </button>
              </div>
            ) : (
              <button
                className="connect-wallet-btn"
                onClick={() => {
                  connectWallet();
                  setIsMobileMenuOpen(false);
                }}
              >
                <i className="material-icons">account_balance_wallet</i>
                {t('connectWallet')}
              </button>
            )}

            {!isAuthenticated && (
              <Link
                to="/register"
                className="register-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons">person_add</i>
                {t('register')}
              </Link>
            )}
          </div>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="material-icons">{link.icon}</i>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <button className="logout-btn" onClick={logout}>
              <i className="material-icons">logout</i>
              {t('logout')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 