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
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <div className="dashboard-nav-links">
            <a href="/" className="dashboard-nav-link">
              <i className="fas fa-home"></i>
              <span>{currentLang === 'fa' ? 'خانه' : 'Home'}</span>
            </a>
            <a href="/collections" className="dashboard-nav-link">
              <i className="fas fa-images"></i>
              <span>{currentLang === 'fa' ? 'کالکشن‌ها' : 'Collections'}</span>
            </a>
            <a href="/marketplace" className="dashboard-nav-link">
              <i className="fas fa-store"></i>
              <span>{currentLang === 'fa' ? 'بازار' : 'Marketplace'}</span>
            </a>
            <a href="/news" className="dashboard-nav-link">
              <i className="fas fa-newspaper"></i>
              <span>{currentLang === 'fa' ? 'اخبار' : 'News'}</span>
            </a>
          </div>

          <div className="nav-right">
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
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-box">
            <i className="fas fa-wallet icon"></i>
            <h3>{walletBalance || '0.00'} ETH</h3>
            <p>{currentLang === 'fa' ? 'موجودی کیف پول' : 'Wallet Balance'}</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-image icon"></i>
            <h3>{totalNFTs}</h3>
            <p>{currentLang === 'fa' ? 'تعداد NFT‌ها' : 'Total NFTs'}</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-chart-line icon"></i>
            <h3>{totalValue} ETH</h3>
            <p>{currentLang === 'fa' ? 'ارزش کل دارایی' : 'Total Value'}</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>
              <i className="fas fa-images"></i>
              {currentLang === 'fa' ? 'کالکشن‌های من' : 'My Collections'}
            </h3>
            <div className="dashboard-card-content">
              {/* محتوای کالکشن‌ها */}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>
              <i className="fas fa-store"></i>
              {currentLang === 'fa' ? 'فروشگاه من' : 'My Store'}
            </h3>
            <div className="dashboard-card-content">
              {/* محتوای فروشگاه */}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>
              <i className="fas fa-history"></i>
              {currentLang === 'fa' ? 'تاریخچه تراکنش‌ها' : 'Transaction History'}
            </h3>
            <div className="dashboard-card-content">
              {/* محتوای تراکنش‌ها */}
            </div>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className={`message-box ${message.type}`}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : message.type === 'error' ? 'times-circle' : 'info-circle'}`}></i>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 