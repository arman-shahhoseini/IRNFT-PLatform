import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaWallet, FaGem, FaHistory, FaHeart, FaStore, FaEnvelope } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // نمونه داده برای کارت‌های داشبورد
  const dashboardData = {
    balance: '0.00',
    nftsOwned: 0,
    nftsCreated: 0,
    activities: 0,
    favorites: 0
  };
  
  const cards = [
    {
      title: 'موجودی کیف پول',
      value: dashboardData.balance,
      unit: 'ETH',
      icon: <FaWallet />,
      color: '#00ff9d'
    },
    {
      title: 'NFT های خریداری شده',
      value: dashboardData.nftsOwned,
      icon: <FaGem />,
      color: '#3d5afe'
    },
    {
      title: 'NFT های ساخته شده',
      value: dashboardData.nftsCreated,
      icon: <FaStore />,
      color: '#ff6b6b'
    },
    {
      title: 'فعالیت های اخیر',
      value: dashboardData.activities,
      icon: <FaHistory />,
      color: '#ffb300'
    },
    {
      title: 'علاقه‌مندی‌ها',
      value: dashboardData.favorites,
      icon: <FaHeart />,
      color: '#ff6bcb'
    }
  ];
  
  const menuItems = [
    {
      title: 'پروفایل کاربری',
      icon: <FaUser />,
      path: '/profile',
      description: 'مشاهده و ویرایش اطلاعات حساب کاربری'
    },
    {
      title: 'کیف پول',
      icon: <FaWallet />,
      path: '/wallet',
      description: 'مدیریت کیف پول و موجودی'
    },
    {
      title: 'مجموعه‌های من',
      icon: <FaGem />,
      path: '/my-collections',
      description: 'مدیریت NFT های خود'
    },
    {
      title: 'فعالیت‌های اخیر',
      icon: <FaHistory />,
      path: '/activity',
      description: 'مشاهده تاریخچه تراکنش‌ها و فعالیت‌ها'
    },
    {
      title: 'علاقه‌مندی‌ها',
      icon: <FaHeart />,
      path: '/favorites',
      description: 'NFT های مورد علاقه شما'
    },
    {
      title: 'بازارچه',
      icon: <FaStore />,
      path: '/marketplace',
      description: 'خرید و فروش NFT ها'
    }
  ];
  
  const handleNavigateClick = (path) => {
    navigate(path);
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>داشبورد کاربری</h1>
        <p>سلام، <span className="user-name">{user?.displayName || user?.username}</span> به پلتفرم IRNFT خوش آمدید</p>
      </div>
      
      <div className="dashboard-stat-cards">
        {cards.map((card, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-details">
              <h3>{card.title}</h3>
              <p className="stat-value">
                {card.value}
                {card.unit && <span className="stat-unit">{card.unit}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-verify-email">
        {!user?.emailVerified && (
          <div className="verify-email-alert">
            <FaEnvelope />
            <div className="verify-email-content">
              <h3>تایید ایمیل</h3>
              <p>لطفاً ایمیل خود را تایید کنید تا از همه امکانات سایت بهره‌مند شوید.</p>
            </div>
            <button 
              className="verify-email-button"
              onClick={() => navigate('/verify-email')}
            >
              تایید ایمیل
            </button>
          </div>
        )}
      </div>
      
      <h2 className="dashboard-section-title">منوی سریع</h2>
      
      <div className="dashboard-menu">
        {menuItems.map((item, index) => (
          <div 
            className="dashboard-menu-item" 
            key={index}
            onClick={() => handleNavigateClick(item.path)}
          >
            <div className="menu-icon">
              {item.icon}
            </div>
            <div className="menu-details">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-main-content">
        <div className="dashboard-section dashboard-welcome">
          <h2>به پلتفرم IRNFT خوش آمدید!</h2>
          <p>IRNFT اولین پلتفرم ایرانی برای خرید، فروش و ساخت توکن‌های غیرمثلی (NFT) است. شما می‌توانید آثار هنری، موسیقی، و محتوای دیجیتال خود را به NFT تبدیل کرده و در بازار ما به فروش برسانید.</p>
          <div className="dashboard-cta-buttons">
            <button className="cta-button primary" onClick={() => navigate('/create-nft')}>
              ساخت NFT جدید
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/marketplace')}>
              مشاهده بازارچه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 