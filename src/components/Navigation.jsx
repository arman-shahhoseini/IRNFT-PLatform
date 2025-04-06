import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { FaHome, FaStore, FaNewspaper, FaWallet, FaSignInAlt, FaUserPlus, FaUser } from 'react-icons/fa';
import { MdCollections } from 'react-icons/md';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdCreateNewFolder } from 'react-icons/md';
import Logo from '../assets/images/logo/Logo.png';
import './Navigation.css';
import { toast } from '../utils/toast.jsx';
import { MessageType } from './common/CustomMessageBox';
import WalletDialog from './WalletDialog/WalletDialog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      if (isConnected) {
        await disconnectWallet();
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('خطا در خروج از حساب کاربری');
    }
  };

  const showWalletConnectDialog = () => {
    if (!user) {
      toast.dismiss();
      
      toast.warning('لطفا ابتدا وارد حساب کاربری خود شوید', {
        autoClose: 3000,
        closeOnClick: true
      });
      return;
    }
    
    setIsWalletDialogOpen(true);
  };

  const handleWalletSelect = (walletType) => {
    connectWallet(walletType);
  };

  const navLinks = [
    { path: '/', icon: <FaHome />, label: 'خانه' },
    { path: '/marketplace', icon: <FaStore />, label: 'بازار' },
    { path: '/create', icon: <MdCreateNewFolder />, label: 'ساخت NFT' },
    { path: '/about', icon: <AiOutlineInfoCircle />, label: 'درباره ما' },
  ];

  if (user) {
    navLinks.push({ path: '/dashboard', icon: <FaUser />, label: 'داشبورد' });
  }

  const isActive = (path) => location.pathname === path;

  const handleAuth = (path) => {
    navigate(path);
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-start">
          <Link to="/" className="nav-brand">
            <img src={Logo} alt="IRNFT" />
          </Link>

          <div className="desktop-nav">
            <div className="nav-links">
              {navLinks.map(({ path, icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${isActive(path) ? 'active' : ''}`}
                >
                  <span>{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-end">
          <div className="auth-buttons">
            {(!isMobile || (isMobile && user)) && (
              isConnected ? (
                <button className="wallet-btn connected" onClick={disconnectWallet}>
                  <FaWallet />
                  <span>{address && address.length >= 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}</span>
                </button>
              ) : (
                <button className="wallet-btn" onClick={showWalletConnectDialog}>
                  <FaWallet />
                  <span>اتصال کیف پول</span>
                </button>
              )
            )}

            {user ? (
              !isMobile && (
                <button className="auth-btn login-btn" onClick={handleLogout}>
                  <FaSignInAlt />
                  <span>خروج</span>
                </button>
              )
            ) : (
              <>
                <Link to="/login" className="auth-btn login-btn">
                  <FaSignInAlt />
                  <span>ورود</span>
                </Link>
                <Link to="/register" className="auth-btn register-btn">
                  <FaUserPlus />
                  <span>ثبت نام</span>
                </Link>
              </>
            )}
          </div>

          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <div className="mobile-menu-content">
          <div className="mobile-nav-section">
            <h3 className="section-title menu-title">منو</h3>
            <div className="mobile-nav-links">
              {navLinks.map(({ path, icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`mobile-nav-link ${isActive(path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{icon}</span>
                  <span className="mobile-nav-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mobile-nav-section">
            <h3 className="section-title account-title">حساب کاربری</h3>
            <div className="auth-buttons-mobile">
              {user ? (
                <>
                  {isConnected ? (
                    <button className="mobile-auth-btn wallet connected" onClick={disconnectWallet}>
                      <FaWallet />
                      <span>قطع اتصال کیف پول</span>
                    </button>
                  ) : (
                    <button className="mobile-auth-btn wallet" onClick={showWalletConnectDialog}>
                      <FaWallet />
                      <span>اتصال کیف پول</span>
                    </button>
                  )}
                  <button className="mobile-auth-btn logout" onClick={handleLogout}>
                    <FaSignInAlt />
                    <span>خروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-auth-btn login" onClick={() => setIsMenuOpen(false)}>
                    <FaSignInAlt />
                    <span>ورود</span>
                  </Link>
                  <Link to="/register" className="mobile-auth-btn register" onClick={() => setIsMenuOpen(false)}>
                    <FaUserPlus />
                    <span>ثبت نام</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <WalletDialog 
        isOpen={isWalletDialogOpen} 
        onClose={() => setIsWalletDialogOpen(false)} 
        onWalletSelect={handleWalletSelect} 
      />
    </nav>
  );
};

export default Navigation; 