import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  
  // ارسال فرم بازیابی رمز عبور
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error(t('auth.errors.emailRequired'));
      return;
    }
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(true);
        toast.success(t('auth.resetPasswordSuccess'));
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.message || t('auth.errors.resetPasswordFailed'));
    }
  };
  
  // بازگشت به صفحه اصلی
  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowRight} />
          {t('common.back')}
        </button>
        
        <div className="auth-header">
          <h1>{t('auth.resetPassword')}</h1>
          <p>{t('auth.resetPasswordSubtitle')}</p>
        </div>
        
        {success ? (
          <div className="reset-success">
            <div className="success-icon">
              <FontAwesomeIcon icon={faEnvelope} size="3x" />
            </div>
            <h2>{t('auth.resetPasswordEmailSent')}</h2>
            <p>{t('auth.resetPasswordCheckEmail', { email })}</p>
            <p className="reset-instructions">
              {t('auth.resetPasswordInstructions')}
            </p>
            <Link to="/login" className="auth-submit-btn">
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} />
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.sendResetLink')}
            </button>
            
            <div className="auth-toggle">
              <p>{t('auth.rememberPassword')}</p>
              <Link to="/login">
                {t('auth.login')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 