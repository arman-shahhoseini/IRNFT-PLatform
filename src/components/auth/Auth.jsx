import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { validatePassword } from '../../utils/validation';
import { useTranslation } from 'react-i18next';
import './Auth.css';

const Auth = ({ onAuthSuccess, onBack }) => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setEmail(userData.email || '');
      setUsername(userData.username || '');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          localStorage.setItem('user', JSON.stringify({
            ...user,
            username: userData.username
          }));
          onAuthSuccess();
        }
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        const emailQuery = await getDoc(doc(db, 'emails', email));
        if (emailQuery.exists()) {
          setError(i18n.language === 'fa' ? 'این ایمیل قبلاً ثبت شده است' : 'This email is already registered');
          setLoading(false);
          return;
        }

        const usernameQuery = await getDoc(doc(db, 'usernames', username));
        if (usernameQuery.exists()) {
          setError(i18n.language === 'fa' ? 'این نام کاربری قبلاً انتخاب شده است' : 'This username is already taken');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          createdAt: new Date().toISOString()
        });

        await setDoc(doc(db, 'emails', email), {
          userId: user.uid
        });

        await setDoc(doc(db, 'usernames', username), {
          userId: user.uid
        });

        localStorage.setItem('user', JSON.stringify({
          ...user,
          username
        }));

        onAuthSuccess();
      }
    } catch (error) {
      console.error('Auth error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(i18n.language === 'fa' ? 'این ایمیل قبلاً ثبت شده است' : 'This email is already registered');
          break;
        case 'auth/invalid-email':
          setError(i18n.language === 'fa' ? 'ایمیل نامعتبر است' : 'Invalid email address');
          break;
        case 'auth/operation-not-allowed':
          setError(i18n.language === 'fa' ? 'ثبت نام با ایمیل غیرفعال است' : 'Email registration is disabled');
          break;
        case 'auth/weak-password':
          setError(i18n.language === 'fa' ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : 'Password must be at least 6 characters');
          break;
        case 'auth/user-disabled':
          setError(i18n.language === 'fa' ? 'این حساب کاربری غیرفعال شده است' : 'This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError(i18n.language === 'fa' ? 'کاربری با این ایمیل یافت نشد' : 'No user found with this email');
          break;
        case 'auth/wrong-password':
          setError(i18n.language === 'fa' ? 'رمز عبور اشتباه است' : 'Wrong password');
          break;
        default:
          setError(i18n.language === 'fa' ? 'خطا در ورود به سیستم' : 'Error signing in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        const username = user.email.split('@')[0];
        
        await setDoc(doc(db, 'users', user.uid), {
          username,
          email: user.email,
          createdAt: new Date().toISOString()
        });

        await setDoc(doc(db, 'emails', user.email), {
          userId: user.uid
        });

        await setDoc(doc(db, 'usernames', username), {
          userId: user.uid
        });

        localStorage.setItem('user', JSON.stringify({
          ...user,
          username
        }));
      } else {
        const userData = userDoc.data();
        localStorage.setItem('user', JSON.stringify({
          ...user,
          username: userData.username
        }));
      }

      onAuthSuccess();
    } catch (error) {
      console.error('Google auth error:', error);
      setError(i18n.language === 'fa' ? 'خطا در ورود با گوگل' : 'Error signing in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-button" onClick={onBack}>
        <i className="fas fa-arrow-right"></i>
        {i18n.language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
      </button>
      
      <div className="auth-box">
        <div className="auth-header">
          <h2>{isLogin ? (i18n.language === 'fa' ? 'ورود به حساب' : 'Sign In') : (i18n.language === 'fa' ? 'ثبت نام' : 'Sign Up')}</h2>
          <p>{i18n.language === 'fa' ? 'به پلتفرم NFT ایرانی خوش آمدید' : 'Welcome to Iranian NFT Platform'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>{i18n.language === 'fa' ? 'نام کاربری' : 'Username'}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                minLength={3}
                maxLength={30}
              />
            </div>
          )}

          <div className="form-group">
            <label>{i18n.language === 'fa' ? 'ایمیل' : 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>{i18n.language === 'fa' ? 'رمز عبور' : 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (i18n.language === 'fa' ? 'در حال پردازش...' : 'Processing...') : isLogin ? (i18n.language === 'fa' ? 'ورود' : 'Sign In') : (i18n.language === 'fa' ? 'ثبت نام' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-divider">
          <span>{i18n.language === 'fa' ? 'یا' : 'or'}</span>
        </div>

        <button className="google-auth-btn" onClick={handleGoogleLogin} disabled={loading}>
          <i className="fab fa-google"></i>
          {i18n.language === 'fa' ? 'ورود با گوگل' : 'Sign in with Google'}
        </button>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              {i18n.language === 'fa' ? 'حساب کاربری ندارید؟' : "Don't have an account?"}{' '}
              <button onClick={() => setIsLogin(false)}>{i18n.language === 'fa' ? 'ثبت نام کنید' : 'Sign Up'}</button>
            </p>
          ) : (
            <p>
              {i18n.language === 'fa' ? 'قبلاً ثبت نام کرده‌اید؟' : 'Already have an account?'}{' '}
              <button onClick={() => setIsLogin(true)}>{i18n.language === 'fa' ? 'وارد شوید' : 'Sign In'}</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 