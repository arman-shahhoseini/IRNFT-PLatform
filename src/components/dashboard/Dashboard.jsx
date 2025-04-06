import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { connectWallet, disconnectWallet, checkWalletConnection } from '../../utils/wallet';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Logo from '../../assets/images/logo/Logo.png';
import './Dashboard.css';
import Swal from 'sweetalert2';

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
      if (!user) {
        Swal.fire({
          icon: 'warning',
          title: 'توجه!',
          text: 'لطفا ابتدا وارد حساب کاربری خود شوید',
          confirmButtonText: 'تایید',
          rtl: true,
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#00ff9d'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }
      
      Swal.fire({
        title: 'در حال اتصال...',
        text: 'لطفاً MetaMask خود را باز کنید',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: '#1a1a2e',
        color: '#ffffff',
        rtl: true
      });
      
      const walletData = await connectWallet();
      
      Swal.close();
      
      if (walletData) {
        setWalletConnected(true);
        setWalletAddress(walletData.address);
        setWalletBalance(walletData.balance);
        
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            walletAddress: walletData.address,
            lastWalletConnection: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      Swal.close();
      
      console.error('Error connecting wallet:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'خطا در اتصال به کیف پول: ' + (error.message || 'خطای ناشناخته'),
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const result = await Swal.fire({
        icon: 'question',
        title: 'قطع اتصال کیف پول',
        text: 'آیا مطمئن هستید که می‌خواهید اتصال کیف پول را قطع کنید؟',
        showCancelButton: true,
        confirmButtonText: 'بله، قطع شود',
        cancelButtonText: 'انصراف',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d',
        cancelButtonColor: '#ff3b3b'
      });
      
      if (!result.isConfirmed) {
        return;
      }
      
      await disconnectWallet();
      setWalletConnected(false);
      setWalletAddress('');
      setWalletBalance('');
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletAddress: null,
          lastWalletDisconnection: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'خطا در قطع اتصال کیف پول: ' + (error.message || 'خطای ناشناخته'),
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    }
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
    </div>
  );
};

export default Dashboard; 