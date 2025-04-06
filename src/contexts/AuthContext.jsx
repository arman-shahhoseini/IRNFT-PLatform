import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app, db } from '../firebase/config';

// ایجاد Context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // بررسی وضعیت احراز هویت در هنگام بارگذاری
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // اگر کاربر اطلاعات پروفایل در Firestore داشت، آن‌ها را بازیابی کنیم
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // ترکیب اطلاعات کاربر از فایربیس و فایراستور
            setUser({
              ...firebaseUser,
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || userDoc.data().username || 'کاربر',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              profile: userDoc.data().profile || {},
              role: userDoc.data().role || 'user',
            });
          } else {
            // اگر اطلاعات در Firestore موجود نبود، فقط از اطلاعات Firebase Authentication استفاده کنیم
            setUser({
              ...firebaseUser,
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'کاربر',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              profile: {},
              role: 'user',
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('خطا در بررسی وضعیت احراز هویت:', error);
      } finally {
        setLoading(false);
      }
    });
    
    // تمیز کردن listener هنگام unmount شدن کامپوننت
    return () => unsubscribe();
  }, [auth]);

  // ثبت نام با ایمیل و رمز عبور
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration with:', userData.email);
      
      // ثبت نام کاربر با Firebase
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // به‌روزرسانی نام نمایشی کاربر
      await firebaseUpdateProfile(result.user, { displayName: userData.username });
      
      // ارسال ایمیل تأیید
      await sendEmailVerification(result.user);
      
      // ذخیره اطلاعات تکمیلی کاربر در Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString(),
        role: 'user',
        profile: {
          avatar: null,
          bio: '',
        }
      });
      
      console.log('Registration successful');
      toast.success('حساب کاربری با موفقیت ایجاد شد. لطفاً ایمیل خود را تأیید کنید.');
      navigate('/verify-email');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'خطا در ایجاد حساب کاربری';
      
      // مدیریت خطاهای رایج Firebase
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'این ایمیل قبلاً استفاده شده است';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'ایمیل نامعتبر است';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ورود با ایمیل و رمز عبور
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', email);
      
      // ورود با Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('Login successful');
      toast.success('با موفقیت وارد شدید!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'خطا در ورود به حساب کاربری';
      
      // مدیریت خطاهای رایج Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'ایمیل یا رمز عبور اشتباه است';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'تلاش‌های ناموفق زیادی انجام شده است. لطفاً بعداً دوباره امتحان کنید';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'این حساب کاربری غیرفعال شده است';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ورود با گوگل
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ورود با حساب گوگل
      const result = await signInWithPopup(auth, googleProvider);
      
      // بررسی اینکه آیا کاربر قبلاً در سیستم ثبت نام کرده است
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // اگر کاربر جدید است، اطلاعات آن را در Firestore ذخیره کنیم
        await setDoc(userDocRef, {
          username: result.user.displayName || 'کاربر گوگل',
          email: result.user.email,
          createdAt: new Date().toISOString(),
          role: 'user',
          profile: {
            avatar: result.user.photoURL,
            bio: '',
          }
        });
      }
      
      console.log('Google login successful');
      toast.success('با موفقیت وارد شدید!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      let errorMessage = 'خطا در ورود با گوگل';
      
      // مدیریت خطاهای رایج Firebase
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'پنجره‌ی احراز هویت گوگل بسته شد';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'حسابی با این ایمیل از قبل وجود دارد اما با روش احراز هویت متفاوت';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // خروج از حساب کاربری
  const logout = async () => {
    try {
      await signOut(auth);
      
      toast.success('با موفقیت خارج شدید');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('خطا در خروج از حساب کاربری');
    }
  };

  // بازیابی رمز عبور
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      // ارسال ایمیل بازیابی رمز عبور
      await sendPasswordResetEmail(auth, email);
      
      toast.success('ایمیل بازیابی رمز عبور ارسال شد');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'خطا در ارسال ایمیل بازیابی';
      
      // مدیریت خطاهای رایج Firebase
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'کاربری با این ایمیل یافت نشد';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'ایمیل نامعتبر است';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // بروزرسانی پروفایل کاربر
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error('کاربر احراز هویت نشده است');
      
      const userDocRef = doc(db, 'users', user.uid);
      
      // اگر نام کاربری جدیدی ارسال شده باشد، آن را در Firebase Authentication هم بروز کنیم
      if (profileData.username) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: profileData.username
        });
      }
      
      // بروزرسانی اطلاعات کاربر در Firestore
      await updateDoc(userDocRef, {
        ...(profileData.username && { username: profileData.username }),
        'profile.bio': profileData.bio || user.profile.bio || '',
        'profile.avatar': profileData.avatar || user.profile.avatar || null,
        // سایر فیلدهای پروفایل می‌توانند اینجا اضافه شوند
        updatedAt: new Date().toISOString()
      });
      
      // بازیابی اطلاعات جدید کاربر
      const updatedUserDoc = await getDoc(userDocRef);
      
      if (updatedUserDoc.exists()) {
        setUser(prev => ({
          ...prev,
          displayName: profileData.username || prev.displayName,
          profile: {
            ...prev.profile,
            ...updatedUserDoc.data().profile
          }
        }));
      }
      
      toast.success('پروفایل با موفقیت بروزرسانی شد');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message);
      toast.error(error.message || 'خطا در بروزرسانی پروفایل');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // مقادیر ارائه شده به Context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
