import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import '../components/auth/Auth.css';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  // ارسال مجدد ایمیل تأیید
  const handleResendEmail = async () => {
    if (!currentUser) {
      toast.error(t('auth.errors.notLoggedIn'));
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendEmailVerification(currentUser);
      toast.success(t('auth.verifyEmailResent'));
    } catch (error) {
      console.error('Error sending verification email:', error);
      let errorMessage = t('auth.errors.verificationEmailFailed');
      
      // مدیریت خطاهای رایج Firebase
      if (error.code === 'auth/too-many-requests') {
        errorMessage = t('auth.errors.tooManyRequests');
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // چک کردن تأیید ایمیل
  const handleCheckVerification = async () => {
    if (!currentUser) {
      toast.error(t('auth.errors.notLoggedIn'));
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // بازخوانی اطلاعات کاربر از سرور
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        toast.success(t('auth.emailVerified'));
        navigate('/dashboard');
      } else {
        toast.info(t('auth.emailNotVerifiedYet'));
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      toast.error(t('auth.errors.checkVerificationFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // برگشت به صفحه اصلی
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card verify-email-card">
        <button className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowRight} />
          {t('common.back')}
        </button>
        
        <div className="auth-header">
          <h1>{t('auth.verifyEmail')}</h1>
          <p>{t('auth.verifyEmailSubtitle')}</p>
        </div>
        
        <div className="verify-email-icon">
          <FontAwesomeIcon icon={faEnvelope} size="3x" />
        </div>
        
        <div className="verify-email-message">
          <p>{t('auth.verifyEmailMessage', { email: currentUser?.email || '...' })}</p>
          <p className="verify-email-instructions">{t('auth.verifyEmailInstructions')}</p>
        </div>
        
        <div className="auth-actions verify-email-actions">
          <button 
            className="auth-submit-btn"
            onClick={handleResendEmail}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.resendVerificationEmail')}
          </button>
          
          <button 
            className="auth-alt-btn"
            onClick={handleCheckVerification}
            disabled={loading}
          >
            {t('auth.checkVerificationStatus')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 