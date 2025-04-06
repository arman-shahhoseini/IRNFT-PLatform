import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/Auth.css';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError(t('auth.passwordMismatch'));
    }
    
    try {
      setError('');
      setLoading(true);
      
      await register(email, password);
      navigate('/email-verification');
    } catch (err) {
      setError(t('auth.registrationError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('auth.register')}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.registerButton')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 