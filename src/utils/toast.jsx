import React from 'react';
import { ToastContainer, toast as toastify } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import { useTranslation } from 'react-i18next';

// تنظیمات پیش‌فرض برای همه toast ها
const defaultOptions = {
  position: 'top-left',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
  draggable: true,
  rtl: true,
  theme: 'dark',
  closeButton: ({ closeToast }) => (
    <button onClick={closeToast} className="custom-toast-close-button">
      <FontAwesomeIcon icon={faXmark} />
    </button>
  ),
  icon: false // غیرفعال کردن آیکون پیش‌فرض
};

// قالب‌بندی سفارشی برای محتوای toast
const CustomToastContent = ({ icon, text }) => (
  <div className="custom-toast-content">
    {icon && <div className="custom-toast-icon">{icon}</div>}
    <div className="custom-toast-text">{text}</div>
  </div>
);

// API عمومی
export const toast = {
  success: (message, options = {}) => {
    return toastify(
      <CustomToastContent 
        icon={<FontAwesomeIcon icon={faCheck} />} 
        text={message} 
      />, 
      {
        ...defaultOptions,
        ...options,
        className: 'custom-toast success-toast',
        progressClassName: 'toast-progress-success'
      }
    );
  },
  
  error: (message, options = {}) => {
    return toastify(
      <CustomToastContent 
        icon={<FontAwesomeIcon icon={faXmark} />} 
        text={message} 
      />, 
      {
        ...defaultOptions,
        ...options,
        className: 'custom-toast error-toast',
        progressClassName: 'toast-progress-error'
      }
    );
  },
  
  warning: (message, options = {}) => {
    return toastify(
      <CustomToastContent 
        icon={<FontAwesomeIcon icon={faExclamationTriangle} />} 
        text={message} 
      />, 
      {
        ...defaultOptions,
        ...options,
        className: 'custom-toast warning-toast',
        progressClassName: 'toast-progress-warning'
      }
    );
  },
  
  info: (message, options = {}) => {
    return toastify(
      <CustomToastContent 
        icon={<FontAwesomeIcon icon={faInfoCircle} />} 
        text={message} 
      />, 
      {
        ...defaultOptions,
        ...options,
        className: 'custom-toast info-toast',
        progressClassName: 'toast-progress-info'
      }
    );
  },
  
  // اضافه کردن تابع dismiss برای حذف دستی پیام‌ها
  dismiss: (id) => {
    if (id) {
      toastify.dismiss(id);
    } else {
      toastify.dismiss();
    }
  }
};

// کامپوننت ToastContainer که باید در اپلیکیشن اصلی قرار گیرد
export const ToastContainerComponent = () => (
  <ToastContainer
    position={defaultOptions.position}
    autoClose={defaultOptions.autoClose}
    hideProgressBar={defaultOptions.hideProgressBar}
    closeOnClick={defaultOptions.closeOnClick}
    pauseOnHover={defaultOptions.pauseOnHover}
    pauseOnFocusLoss={defaultOptions.pauseOnFocusLoss}
    draggable={defaultOptions.draggable}
    rtl={defaultOptions.rtl}
    theme={defaultOptions.theme}
    closeButton={defaultOptions.closeButton}
  />
);

// تابع کمکی برای ترجمه‌ی پیام‌های اتصال ولت
export const walletMessages = () => {
  const { t, i18n } = useTranslation();
  
  return {
    notInstalled: t('wallet.notInstalled'),
    connectionError: t('wallet.connectionError'),
    connectionSuccess: t('wallet.connectionSuccess'),
    disconnectionSuccess: t('wallet.disconnectionSuccess'),
    wrongNetwork: t('wallet.wrongNetwork'),
    notConnected: t('wallet.notConnected')
  };
};

// HOC برای استفاده از toast در کامپوننت‌های کلاسی
export const withToast = (Component) => {
  return (props) => {
    return <Component {...props} toast={toast} />;
  };
}; 