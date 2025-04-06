import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilter, FaWallet, FaShoppingCart, FaGem, FaExchangeAlt, FaHeart } from 'react-icons/fa';
import './Activity.css';

const Activity = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  
  // نمونه داده‌های فعالیت (در پروژه واقعی این داده‌ها از API دریافت می‌شوند)
  const activities = [
    {
      id: 1,
      type: 'purchase',
      title: 'خرید NFT',
      description: 'NFT "سیمرغ افسانه‌ای" را خریداری کردید',
      date: '۱۴۰۳/۰۱/۱۲',
      time: '۱۴:۳۰',
      amount: '0.25 ETH',
      status: 'completed',
      icon: <FaShoppingCart />
    },
    {
      id: 2,
      type: 'sale',
      title: 'فروش NFT',
      description: 'NFT "پرنده آبی" را فروختید',
      date: '۱۴۰۳/۰۱/۰۵',
      time: '۱۰:۱۵',
      amount: '0.12 ETH',
      status: 'completed',
      icon: <FaGem />
    },
    {
      id: 3,
      type: 'transfer',
      title: 'انتقال NFT',
      description: 'NFT "گل سرخ" را به آدرس 0x21...3F7D منتقل کردید',
      date: '۱۴۰۲/۱۲/۲۸',
      time: '۲۰:۴۵',
      amount: '-',
      status: 'completed',
      icon: <FaExchangeAlt />
    },
    {
      id: 4,
      type: 'favorite',
      title: 'علاقه‌مندی',
      description: 'NFT "دماوند" را به علاقه‌مندی‌ها اضافه کردید',
      date: '۱۴۰۲/۱۲/۲۰',
      time: '۱۱:۳۰',
      amount: '-',
      status: 'completed',
      icon: <FaHeart />
    },
    {
      id: 5,
      type: 'deposit',
      title: 'واریز به کیف پول',
      description: 'مبلغ ETH 0.5 به کیف پول شما واریز شد',
      date: '۱۴۰۲/۱۲/۱۵',
      time: '۰۹:۱۰',
      amount: '0.5 ETH',
      status: 'completed',
      icon: <FaWallet />
    }
  ];
  
  // فیلتر کردن فعالیت‌ها
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="activity-container">
      <div className="activity-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
          <span>بازگشت به داشبورد</span>
        </button>
        <h1>تاریخچه فعالیت‌ها</h1>
      </div>
      
      <div className="activity-filter">
        <div className="filter-label">
          <FaFilter />
          <span>فیلتر:</span>
        </div>
        <div className="filter-options">
          <button 
            className={`filter-option ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            همه
          </button>
          <button 
            className={`filter-option ${filter === 'purchase' ? 'active' : ''}`}
            onClick={() => setFilter('purchase')}
          >
            خرید
          </button>
          <button 
            className={`filter-option ${filter === 'sale' ? 'active' : ''}`}
            onClick={() => setFilter('sale')}
          >
            فروش
          </button>
          <button 
            className={`filter-option ${filter === 'transfer' ? 'active' : ''}`}
            onClick={() => setFilter('transfer')}
          >
            انتقال
          </button>
          <button 
            className={`filter-option ${filter === 'deposit' ? 'active' : ''}`}
            onClick={() => setFilter('deposit')}
          >
            واریز
          </button>
          <button 
            className={`filter-option ${filter === 'favorite' ? 'active' : ''}`}
            onClick={() => setFilter('favorite')}
          >
            علاقه‌مندی
          </button>
        </div>
      </div>
      
      <div className="activity-list">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-item ${activity.type}`}>
              <div className="activity-icon">
                {activity.icon}
              </div>
              <div className="activity-details">
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="activity-date">{activity.date}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
              <div className="activity-status">
                {activity.amount !== '-' && (
                  <div className="activity-amount">
                    {activity.amount}
                  </div>
                )}
                <div className={`status-badge ${activity.status}`}>
                  {activity.status === 'completed' ? 'تکمیل شده' : 'در حال پردازش'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-activities">
            <div className="empty-icon">
              <FaFilter />
            </div>
            <p>هیچ فعالیتی با فیلتر انتخاب‌شده یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity; 