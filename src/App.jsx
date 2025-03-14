import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Logo from '/images/logo/Logo.png'
import HeroVideo from '/images/hero/hero-bg.mp4'
import FatesFaces from '/images/collections/fates-faces.jpg'
import EclipseSyndicate from '/images/collections/eclipse-syndicate.jpg'
import NeonSovereigns from '/images/collections/neon-sovereigns.jpg'
import Auth from './components/auth/Auth'
import Dashboard from './components/dashboard/Dashboard'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { connectWallet, disconnectWallet, checkWalletConnection } from './utils/wallet'
import { useTranslation } from 'react-i18next'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState('fa')
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const checkWallet = async () => {
      const isConnected = await checkWalletConnection();
      if (isConnected) {
        const savedWallet = JSON.parse(localStorage.getItem('wallet'));
        if (savedWallet) {
          setWalletConnected(true);
          setWalletAddress(savedWallet.address);
          setWalletBalance(savedWallet.balance);
        }
      }
    };

    checkWallet();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuth(false)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setIsAuthenticated(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleConnectWallet = async () => {
    try {
      if (!isAuthenticated) {
        setMessage({
          text: 'لطفاً ابتدا وارد حساب کاربری خود شوید',
          type: 'warning'
        });
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      const walletData = await connectWallet();
      if (walletData) {
        setWalletConnected(true);
        setWalletAddress(walletData.address);
        setWalletBalance(walletData.balance);
        setMessage({
          text: 'کیف پول با موفقیت متصل شد',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage({
        text: 'خطا در اتصال کیف پول',
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
        text: 'کیف پول قطع شد',
        type: 'info'
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setMessage({
        text: 'خطا در قطع اتصال کیف پول',
        type: 'error'
      });
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    i18n.changeLanguage(newLang);
  };

  const Navigation = () => (
    <>
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <div className="dashboard-nav-links">
            <a href="/" className="dashboard-nav-link active">
              <i className="fas fa-home"></i>
              <span>{language === 'fa' ? 'خانه' : 'Home'}</span>
            </a>
            <a href="/collections" className="dashboard-nav-link">
              <i className="fas fa-images"></i>
              <span>{language === 'fa' ? 'کالکشن‌ها' : 'Collections'}</span>
            </a>
            <a href="/marketplace" className="dashboard-nav-link">
              <i className="fas fa-store"></i>
              <span>{language === 'fa' ? 'بازار' : 'Marketplace'}</span>
            </a>
            <a href="/news" className="dashboard-nav-link">
              <i className="fas fa-newspaper"></i>
              <span>{language === 'fa' ? 'اخبار' : 'News'}</span>
            </a>
            {isAuthenticated && (
              <a href="/dashboard" className="dashboard-nav-link">
                <i className="fas fa-chart-line"></i>
                <span>{language === 'fa' ? 'داشبورد' : 'Dashboard'}</span>
              </a>
            )}
          </div>

          <div className="nav-right">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder={language === 'fa' ? 'جستجو...' : 'Search...'} />
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
                  {language === 'fa' ? 'اتصال کیف پول' : 'Connect Wallet'}
                </button>
              )}
              {isAuthenticated ? (
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  {language === 'fa' ? 'خروج' : 'Logout'}
                </button>
              ) : (
                <button className="register-btn" onClick={() => setShowAuth(true)}>
                  <i className="fas fa-user-plus"></i>
                  {language === 'fa' ? 'ثبت نام' : 'Register'}
                </button>
              )}
            </div>
            <div className="language-switcher">
              <button 
                className={`language-btn ${language === 'fa' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('fa')}
              >
                FA
              </button>
              <button 
                className={`language-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
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
          <a href="/" className="nav-link active">
            <i className="fas fa-home"></i>
            <span>{language === 'fa' ? 'خانه' : 'Home'}</span>
          </a>
          <a href="/collections" className="nav-link">
            <i className="fas fa-images"></i>
            <span>{language === 'fa' ? 'کالکشن‌ها' : 'Collections'}</span>
          </a>
          <a href="/marketplace" className="nav-link">
            <i className="fas fa-store"></i>
            <span>{language === 'fa' ? 'بازار' : 'Marketplace'}</span>
          </a>
          <a href="/news" className="nav-link">
            <i className="fas fa-newspaper"></i>
            <span>{language === 'fa' ? 'اخبار' : 'News'}</span>
          </a>
          {isAuthenticated && (
            <a href="/dashboard" className="nav-link">
              <i className="fas fa-chart-line"></i>
              <span>{language === 'fa' ? 'داشبورد' : 'Dashboard'}</span>
            </a>
          )}
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
              {language === 'fa' ? 'اتصال کیف پول' : 'Connect Wallet'}
            </button>
          )}
          {isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              {language === 'fa' ? 'خروج' : 'Logout'}
            </button>
          ) : (
            <button className="register-btn" onClick={() => setShowAuth(true)}>
              <i className="fas fa-user-plus"></i>
              {language === 'fa' ? 'ثبت نام' : 'Register'}
            </button>
          )}
        </div>
        <div className="language-switcher">
          <button 
            className={`language-btn ${language === 'fa' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('fa')}
          >
            FA
          </button>
          <button 
            className={`language-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            EN
          </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
    </>
  );

  const HomePage = () => (
    <>
      <Navigation />
      <section className="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src={HeroVideo} type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>{language === 'fa' ? 'به IRNFT خوش آمدید' : 'Welcome to IRNFT'}</h1>
          <p>{language === 'fa' ? 'مجموعه‌های هنر دیجیتال منحصر به فرد را کشف کنید' : 'Discover Unique Digital Art Collections'}</p>
          <button className="cta-button">{language === 'fa' ? 'مشاهده کالکشن‌ها' : 'Explore Collections'}</button>
          <div className="hero-features">
            <div className="hero-feature">
              <i className="fas fa-shield-alt"></i>
              <span>{language === 'fa' ? 'امنیت بالا' : 'High Security'}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-bolt"></i>
              <span>{language === 'fa' ? 'سرعت معاملات' : 'Fast Transactions'}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-users"></i>
              <span>{language === 'fa' ? 'جامعه فعال' : 'Active Community'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="collections">
        <div className="collections-header">
          <h2>{language === 'fa' ? 'کالکشن‌های ویژه' : 'Featured Collections'}</h2>
          <div className="collections-line"></div>
        </div>
        
        <div className="collections-container">
          <div className="featured-collection">
            <div className="featured-content">
              <div className="featured-text">
                <div className="status-badge active">
                  <span className="status-dot"></span>
                  {language === 'fa' ? 'فعال' : 'Active'}
                </div>
                <h3>{language === 'fa' ? 'سرنوشت‌ها و چهره‌ها' : 'Fates & Faces'}</h3>
                <p>{language === 'fa' ? 'مجموعه‌ای منحصر به فرد از 20 NFT با طراحی‌های خیره‌کننده و مفاهیم عمیق' : 'A unique collection of 20 NFTs with stunning designs and deep concepts'}</p>
                <div className="collection-stats">
                  <div className="stat-item">
                    <i className="fas fa-cube"></i>
                    <span>20 NFT</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{language === 'fa' ? 'سطح 1-20' : 'Level 1-20'}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-crown"></i>
                    <span>{language === 'fa' ? '10 افسانه‌ای' : '10 Legend'}</span>
                  </div>
                </div>
                <button className="view-collection">
                  {language === 'fa' ? 'مشاهده کالکشن' : 'View Collection'}
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
              <div className="featured-image">
                <img src={FatesFaces} alt="Fates & Faces" />
              </div>
            </div>
          </div>

          <div className="upcoming-collections">
            <div className="upcoming-card" data-coming-soon={language === 'fa' ? 'به زودی' : 'Coming Soon'}>
              <div className="card-image">
                <img src={EclipseSyndicate} alt="Eclipse Syndicate" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{language === 'fa' ? 'سندیکا خسوف' : 'Eclipse Syndicate'}</h4>
                  <p>{language === 'fa' ? 'مجموعه‌ای مرموز از NFT‌های سایه‌ای با داستان‌های منحصر به فرد' : 'A mysterious collection of shadow NFTs with unique stories'}</p>
                </div>
              </div>
            </div>

            <div className="upcoming-card" data-coming-soon={language === 'fa' ? 'به زودی' : 'Coming Soon'}>
              <div className="card-image">
                <img src={NeonSovereigns} alt="Neon Sovereigns" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{language === 'fa' ? 'سلاطین نئون: فرمانروایی ملکه‌های سایبر' : 'Neon Sovereigns: Reign of the Cyber Queens'}</h4>
                  <p>{language === 'fa' ? 'مجموعه‌ای آینده‌نگرانه از NFT‌های سایبرپانک با طراحی‌های نئون' : 'A futuristic collection of cyberpunk NFTs with neon designs'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-about glass-box">
                <h3>{language === 'fa' ? 'درباره IRNFT' : 'About IRNFT'}</h3>
                <p>
                  {language === 'fa' 
                    ? 'پیشگام در عرصه هنر دیجیتال و NFT در ایران، با هدف خلق آینده‌ای درخشان برای هنرمندان.' 
                    : 'Pioneering Digital Art and NFT in Iran, creating a bright future for artists.'}
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-discord"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-telegram"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-column">
              <div className="footer-links glass-box">
                <h3>
                  <i className="fas fa-link link-icon"></i>
                  {language === 'fa' ? 'دسترسی سریع' : 'Quick Links'}
                </h3>
                <ul>
                  <li>
                    <a href="/">
                      <i className="fas fa-home"></i>
                      <span>{language === 'fa' ? 'خانه' : 'Home'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/collections">
                      <i className="fas fa-images"></i>
                      <span>{language === 'fa' ? 'کالکشن‌ها' : 'Collections'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/marketplace">
                      <i className="fas fa-store"></i>
                      <span>{language === 'fa' ? 'بازار' : 'Marketplace'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/news">
                      <i className="fas fa-newspaper"></i>
                      <span>{language === 'fa' ? 'اخبار' : 'News'}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-column">
              <div className="footer-support glass-box">
                <h3>
                  <i className="fas fa-headset support-icon"></i>
                  {language === 'fa' ? 'پشتیبانی' : 'Support'}
                </h3>
                <ul>
                  <li>
                    <a href="/faq">
                      <i className="fas fa-question-circle"></i>
                      <span>{language === 'fa' ? 'سوالات متداول' : 'FAQ'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/terms">
                      <i className="fas fa-file-contract"></i>
                      <span>{language === 'fa' ? 'قوانین و مقررات' : 'Terms of Service'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/privacy">
                      <i className="fas fa-shield-alt"></i>
                      <span>{language === 'fa' ? 'حریم خصوصی' : 'Privacy Policy'}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/contact">
                      <i className="fas fa-envelope"></i>
                      <span>{language === 'fa' ? 'تماس با ما' : 'Contact Us'}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-copyright glass-box">
            <p>{language === 'fa' ? '© ۱۴۰۳ IRNFT. تمامی حقوق محفوظ است.' : '© 2024 IRNFT. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </>
  );

  return (
    <Router>
      <div className="app">
        {showAuth ? (
          <Auth 
            onAuthSuccess={handleAuthSuccess} 
            onBack={() => setShowAuth(false)}
          />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        )}
      </div>
      {showMessage && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}
    </Router>
  );
}

export default App;
