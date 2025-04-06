import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const FirebaseAuth = ({ mode = 'login' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // بررسی پارامترهای URL برای خطاهای احتمالی
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    
    if (errorParam) {
      let errorMessage = '';
      
      switch (errorParam) {
        case 'auth/user-not-found':
          errorMessage = t('auth.errors.userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('auth.errors.wrongPassword');
          break;
        case 'auth/email-already-in-use':
          errorMessage = t('auth.errors.emailInUse');
          break;
        case 'auth/weak-password':
          errorMessage = t('auth.errors.weakPassword');
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.errors.invalidEmail');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.errors.tooManyRequests');
          break;
        default:
          errorMessage = t('auth.errors.default');
      }
      
      toast.error(errorMessage);
    }
  }, [location, t]);
  
  // تغییر مقادیر فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // تغییر وضعیت نمایش رمز عبور
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  // تغییر وضعیت نمایش تأیید رمز عبور
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };
  
  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted', formData);
    toast.info('در حال پردازش درخواست...');
    
    try {
      // اعتبارسنجی فرم
      if (mode === 'register') {
        // بررسی مطابقت رمز عبور و تأیید آن
        if (formData.password !== formData.confirmPassword) {
          console.error('Password mismatch');
          toast.error(t('auth.errors.passwordMismatch'));
          return;
        }
        
        // بررسی طول رمز عبور
        if (formData.password.length < 8) {
          console.error('Password too short');
          toast.error(t('auth.errors.passwordLength'));
          return;
        }
        
        console.log('Attempting to register with:', { email: formData.email, username: formData.username });
        
        // ثبت نام کاربر
        const result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        console.log('Register result:', result);
        
        if (result.success) {
          navigate('/verify-email');
        } else {
          console.error('Registration failed:', result.error);
        }
      } else {
        console.log('Attempting to login with:', { email: formData.email });
        
        // ورود کاربر
        const result = await login(formData.email, formData.password);
        
        console.log('Login result:', result);
        
        if (result.success) {
          // در صورت موفقیت، کاربر توسط AuthContext به مسیر مناسب هدایت می‌شود
          console.log('Login successful, redirecting...');
        } else {
          console.error('Login failed:', result.error);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('خطا در پردازش فرم: ' + (error.message || 'خطای ناشناخته'));
    }
  };
  
  // ورود با گوگل
  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };
  
  // بازگشت به صفحه اصلی
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowRight} />
          {t('common.back')}
        </button>
        
        <div className="auth-header">
          <h1>{mode === 'register' ? t('auth.register') : t('auth.login')}</h1>
          <p>{mode === 'register' ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username">
                <FontAwesomeIcon icon={faUser} />
                {t('auth.username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="auth-input"
                placeholder={t('auth.usernamePlaceholder')}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} />
              {t('auth.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder={t('auth.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} />
              {t('auth.password')}
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FontAwesomeIcon icon={faLock} />
                {t('auth.confirmPassword')}
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}
          
          {mode === 'login' && (
            <div className="form-options">
              <Link to="/reset-password" className="forgot-password-link">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? t('common.loading') : mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>{t('auth.orContinueWith')}</span>
        </div>
        
        <div className="auth-actions">
          <button 
            className="google-auth-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faGoogle} />
            {t('auth.continueWithGoogle')}
          </button>
        </div>
        
        <div className="auth-toggle">
          <p>
            {mode === 'login'
              ? t('auth.dontHaveAccount')
              : t('auth.alreadyHaveAccount')
            }
          </p>
          <Link to={mode === 'login' ? '/register' : '/login'}>
            {mode === 'login' ? t('auth.register') : t('auth.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAuth; 