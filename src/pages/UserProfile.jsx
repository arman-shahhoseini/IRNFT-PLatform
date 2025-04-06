import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { FaUser, FaEnvelope, FaWallet, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './UserProfile.css';

const UserProfile = () => {
  const { user, loading, error, updateUserProfile, logout, verifyEmail } = useAuth();
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateUserProfile({
        displayName: formData.displayName
      });
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'موفق!',
          text: 'پروفایل شما با موفقیت به‌روز شد',
          confirmButtonText: 'تایید',
          rtl: true,
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#00ff9d'
        });
        setIsEditing(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: `به‌روزرسانی پروفایل با خطا مواجه شد: ${error.message}`,
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    }
  };

  const handleSendVerification = async () => {
    try {
      const result = await verifyEmail();
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'ایمیل ارسال شد',
          text: 'ایمیل تایید برای شما ارسال شد. لطفاً صندوق ایمیل خود را بررسی کنید.',
          confirmButtonText: 'تایید',
          rtl: true,
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#00ff9d'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: `ارسال ایمیل تایید با خطا مواجه شد: ${error.message}`,
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: `اتصال کیف پول با خطا مواجه شد: ${error.message}`,
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
      await disconnectWallet();
      Swal.fire({
        icon: 'success',
        title: 'موفق!',
        text: 'کیف پول با موفقیت قطع شد',
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: `قطع اتصال کیف پول با خطا مواجه شد: ${error.message}`,
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
      Swal.fire({
        title: 'خروج از حساب',
        text: 'آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله، خارج شوم',
        cancelButtonText: 'انصراف',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await logout();
          navigate('/');
          // پیام toast در تابع logout در AuthContext نمایش داده می‌شود، دیگر نیازی به نمایش پیام Swal نیست
        }
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: `خروج از حساب با خطا مواجه شد: ${error.message}`,
        confirmButtonText: 'تایید',
        rtl: true,
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff9d'
      });
    }
  };

  if (loading) {
    return <div className="loading-container">در حال بارگذاری اطلاعات کاربر...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>پروفایل کاربری</h1>
        <p>اطلاعات حساب کاربری خود را مدیریت کنید</p>
      </div>

      <div className="profile-content">
        <div className="profile-card user-info">
          <div className="profile-card-header">
            <h2>اطلاعات شخصی</h2>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit />
              <span>{isEditing ? 'انصراف' : 'ویرایش'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label>نام و نام خانوادگی</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                />
              </div>
              
              <div className="form-group">
                <label>نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled={true}
                  className="disabled-input"
                />
                <small>نام کاربری پس از ثبت‌نام قابل تغییر نیست</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">ذخیره تغییرات</button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>انصراف</button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-item">
                <div className="profile-icon">
                  <FaUser />
                </div>
                <div className="profile-info">
                  <h3>نام و نام خانوادگی</h3>
                  <p>{user?.displayName || 'تنظیم نشده'}</p>
                </div>
              </div>
              
              <div className="profile-item">
                <div className="profile-icon">
                  <FaUser />
                </div>
                <div className="profile-info">
                  <h3>نام کاربری</h3>
                  <p>{user?.username || 'تنظیم نشده'}</p>
                </div>
              </div>
              
              <div className="profile-item">
                <div className="profile-icon">
                  <FaEnvelope />
                </div>
                <div className="profile-info">
                  <h3>ایمیل</h3>
                  <p>{user?.email}</p>
                  <div className="email-verify-status">
                    {user?.emailVerified ? (
                      <span className="verified">تایید شده</span>
                    ) : (
                      <>
                        <span className="not-verified">تایید نشده</span>
                        <button 
                          onClick={handleSendVerification} 
                          className="verify-button"
                        >
                          ارسال ایمیل تایید
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card wallet-info">
          <h2>اطلاعات کیف پول</h2>
          <div className="profile-item">
            <div className="profile-icon">
              <FaWallet />
            </div>
            <div className="profile-info">
              <h3>آدرس کیف پول</h3>
              {isConnected && walletAddress ? (
                <>
                  <p className="wallet-address">{walletAddress}</p>
                  <button 
                    className="disconnect-wallet-button"
                    onClick={handleDisconnectWallet}
                  >
                    قطع اتصال کیف پول
                  </button>
                </>
              ) : (
                <>
                  <p>کیف پول متصل نشده است</p>
                  <button 
                    className="connect-wallet-button"
                    onClick={handleConnectWallet}
                  >
                    اتصال کیف پول
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-card account-actions">
          <h2>مدیریت حساب کاربری</h2>
          <div className="action-buttons">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt />
              <span>خروج از حساب کاربری</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 