import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaArrowRight } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>صفحه مورد نظر یافت نشد</h2>
        <p>متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
        <div className="not-found-actions">
          <Link to="/" className="home-button">
            <FaHome />
            <span>صفحه اصلی</span>
          </Link>
          <button onClick={() => window.history.back()} className="back-button">
            <FaArrowRight />
            <span>بازگشت به صفحه قبلی</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 