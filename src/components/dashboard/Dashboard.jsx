import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { connectWallet, disconnectWallet, checkWalletConnection } from '../../utils/wallet';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Logo from '../../assets/images/logo/Logo.png';
import './Dashboard.css';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('language') || 'fa');

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            ...currentUser,
            ...userDoc.data()
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      setWalletConnected(true);
      setWalletAddress(walletData.address);
      setWalletBalance(walletData.balance);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(currentLang);
    document.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  }, [currentLang, i18n]);

  const handleConnectWallet = async () => {
    try {
      const walletData = await connectWallet();
      if (walletData) {
        setWalletConnected(true);
        setWalletAddress(walletData.address);
        setWalletBalance(walletData.balance);
        setMessage({
          text: currentLang === 'fa' ? 'کیف پول با موفقیت متصل شد' : 'Wallet connected successfully',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage({
        text: currentLang === 'fa' ? 'خطا در اتصال کیف پول' : 'Error connecting wallet',
        type: 'error'
      });
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletConnected(false);
      setWalletAddress('');
      setWalletBalance('');
      setMessage({
        text: currentLang === 'fa' ? 'کیف پول قطع شد' : 'Wallet disconnected',
        type: 'info'
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setMessage({
        text: currentLang === 'fa' ? 'خطا در قطع اتصال کیف پول' : 'Error disconnecting wallet',
        type: 'error'
      });
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'fa' ? 'en' : 'fa';
    setCurrentLang(newLang);
    localStorage.setItem('language', newLang);
    document.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <a href="/" className="nav-logo">
              <img src={Logo} alt="IRNFT Logo" />
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link">{currentLang === 'fa' ? 'خانه' : 'Home'}</a>
              <a href="/collections" className="nav-link">{currentLang === 'fa' ? 'کالکشن‌ها' : 'Collections'}</a>
              <a href="/marketplace" className="nav-link">{currentLang === 'fa' ? 'بازار' : 'Marketplace'}</a>
              <a href="/news" className="nav-link">{currentLang === 'fa' ? 'اخبار' : 'News'}</a>
              <a href="/dashboard" className="nav-link active">{currentLang === 'fa' ? 'داشبورد' : 'Dashboard'}</a>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder={currentLang === 'fa' ? 'جستجو...' : 'Search...'} />
            </div>
            <div className="auth-buttons">
              {walletConnected ? (
                <div className="wallet-info">
                  <span className="wallet-address">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <span className="wallet-balance">{walletBalance} ETH</span>
                  <button onClick={handleDisconnectWallet} className="disconnect-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button onClick={handleConnectWallet} className="connect-wallet-btn">
                  <i className="fas fa-wallet"></i>
                  {currentLang === 'fa' ? 'اتصال کیف پول' : 'Connect Wallet'}
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                {currentLang === 'fa' ? 'خروج' : 'Logout'}
              </button>
            </div>
            <div className="language-switcher">
              <button 
                className={`language-btn ${currentLang === 'fa' ? 'active' : ''}`}
                onClick={() => toggleLanguage()}
              >
                FA
              </button>
              <button 
                className={`language-btn ${currentLang === 'en' ? 'active' : ''}`}
                onClick={() => toggleLanguage()}
              >
                EN
              </button>
            </div>
          </div>

          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <a href="/" className="nav-link">{currentLang === 'fa' ? 'خانه' : 'Home'}</a>
          <a href="/collections" className="nav-link">{currentLang === 'fa' ? 'کالکشن‌ها' : 'Collections'}</a>
          <a href="/marketplace" className="nav-link">{currentLang === 'fa' ? 'بازار' : 'Marketplace'}</a>
          <a href="/news" className="nav-link">{currentLang === 'fa' ? 'اخبار' : 'News'}</a>
          <a href="/dashboard" className="nav-link active">{currentLang === 'fa' ? 'داشبورد' : 'Dashboard'}</a>
        </div>
        <div className="auth-buttons">
          {walletConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              <span className="wallet-balance">{walletBalance} ETH</span>
              <button onClick={handleDisconnectWallet} className="disconnect-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <button onClick={handleConnectWallet} className="connect-wallet-btn">
              <i className="fas fa-wallet"></i>
              {currentLang === 'fa' ? 'اتصال کیف پول' : 'Connect Wallet'}
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            {currentLang === 'fa' ? 'خروج' : 'Logout'}
          </button>
        </div>
        <div className="language-switcher">
          <button 
            className={`language-btn ${currentLang === 'fa' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            FA
          </button>
          <button 
            className={`language-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            EN
          </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>
            <i className="fas fa-user"></i>
            {currentLang === 'fa' ? 'پروفایل کاربری' : 'User Profile'}
          </h3>
          <div className="dashboard-card-content">
            <p>{currentLang === 'fa' ? 'نام کاربری' : 'Username'}: {user?.username}</p>
            <p>{currentLang === 'fa' ? 'ایمیل' : 'Email'}: {user?.email}</p>
            <p>{currentLang === 'fa' ? 'تاریخ عضویت' : 'Join Date'}: {formatDate(user?.createdAt)}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>
            <i className="fas fa-chart-bar"></i>
            {currentLang === 'fa' ? 'آمار کلی' : 'Overview'}
          </h3>
          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">{currentLang === 'fa' ? 'NFT های من' : 'My NFTs'}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">{currentLang === 'fa' ? 'تراکنش‌ها' : 'Transactions'}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">{currentLang === 'fa' ? 'موجودی' : 'Balance'}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>
            <i className="fas fa-history"></i>
            {currentLang === 'fa' ? 'آخرین فعالیت‌ها' : 'Recent Activities'}
          </h3>
          <div className="dashboard-activity">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">{currentLang === 'fa' ? 'ثبت نام در پلتفرم' : 'Platform Registration'}</div>
                <div className="activity-time">{formatDate(user?.createdAt)}</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">{currentLang === 'fa' ? 'اتصال کیف پول' : 'Wallet Connection'}</div>
                <div className="activity-time">{currentLang === 'fa' ? 'هنوز متصل نشده' : 'Not Connected Yet'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className={`message-box ${message.type}`}>
          <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 