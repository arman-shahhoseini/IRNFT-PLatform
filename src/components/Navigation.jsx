import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { truncateAddress } from '../utils/helpers';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { account, balance, connectWallet, disconnectWallet } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('language', newLang);
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
      setIsMobileMenuOpen(false);
    }
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
    <>
      <nav className="main-nav">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <img src="/images/logo.png" alt="IRNFT" />
          </Link>

          <button
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/logo.png" alt="IRNFT" />
          </Link>
          <button
            className="close-menu"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="material-icons">close</i>
          </button>
        </div>

        <div className="mobile-nav-content">
          <div className="mobile-nav-section">
            <div className="section-title">{t('menu')}</div>
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if (link.path === '/dashboard') {
                      handleDashboardClick(e);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <i className="material-icons">{link.icon}</i>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mobile-nav-section">
            <div className="section-title">{t('account')}</div>
            {account ? (
              <div className="mobile-wallet-info">
                <div className="wallet-details">
                  <span className="wallet-balance">{balance} ETH</span>
                  <span className="wallet-address">{truncateAddress(account)}</span>
                </div>
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

          <div className="mobile-nav-section">
            <div className="section-title">{t('language')}</div>
            <div className="language-switcher">
              <button
                className={`language-option ${i18n.language === 'fa' ? 'active' : ''}`}
                onClick={() => {
                  if (i18n.language !== 'fa') {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                فارسی
              </button>
              <button
                className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  if (i18n.language !== 'en') {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                English
              </button>
            </div>
          </div>

          {isAuthenticated && (
            <button 
              className="logout-btn"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
            >
              <i className="material-icons">logout</i>
              {t('logout')}
            </button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation; 