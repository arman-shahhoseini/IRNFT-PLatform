import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const resources = {
  fa: {
    translation: {
      nav: {
        home: 'خانه',
        collections: 'کالکشن‌ها',
        marketplace: 'بازار',
        news: 'اخبار',
        search: 'جستجو...'
      },
      wallet: {
        connect: 'اتصال کیف پول',
        connected: 'کیف پول با موفقیت متصل شد',
        disconnected: 'کیف پول قطع شد',
        connectionError: 'خطا در اتصال به کیف پول',
        disconnectError: 'خطا در قطع اتصال کیف پول',
        loginRequired: 'لطفاً ابتدا وارد حساب کاربری خود شوید'
      },
      auth: {
        logout: 'خروج'
      },
      dashboard: {
        balance: 'موجودی',
        nfts: 'NFT های من',
        transactions: 'تراکنش‌ها',
        recentActivity: 'فعالیت‌های اخیر',
        noActivity: 'هنوز فعالیتی ثبت نشده است',
        noNFTs: 'هنوز NFT ای ثبت نشده است',
        noTransactions: 'هنوز تراکنشی ثبت نشده است',
        welcome: 'خوش آمدید',
        login: 'ورود به حساب',
        register: 'ثبت نام',
        email: 'ایمیل',
        password: 'رمز عبور',
        username: 'نام کاربری',
        submit: 'ورود',
        registerSubmit: 'ثبت نام',
        loading: 'در حال پردازش...',
        or: 'یا',
        loginWithGoogle: 'ورود با گوگل',
        noAccount: 'حساب کاربری ندارید؟',
        registerLink: 'ثبت نام کنید',
        hasAccount: 'قبلاً ثبت نام کرده‌اید؟',
        loginLink: 'وارد شوید',
        error: {
          emailExists: 'این ایمیل قبلاً ثبت شده است',
          usernameExists: 'این نام کاربری قبلاً انتخاب شده است',
          invalidEmail: 'ایمیل نامعتبر است',
          weakPassword: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
          userDisabled: 'این حساب کاربری غیرفعال شده است',
          userNotFound: 'کاربری با این ایمیل یافت نشد',
          wrongPassword: 'رمز عبور اشتباه است',
          default: 'خطا در ورود به سیستم'
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        collections: 'Collections',
        marketplace: 'Marketplace',
        news: 'News',
        search: 'Search...'
      },
      wallet: {
        connect: 'Connect Wallet',
        connected: 'Wallet connected successfully',
        disconnected: 'Wallet disconnected',
        connectionError: 'Error connecting wallet',
        disconnectError: 'Error disconnecting wallet',
        loginRequired: 'Please login first'
      },
      auth: {
        logout: 'Logout'
      },
      dashboard: {
        balance: 'Balance',
        nfts: 'My NFTs',
        transactions: 'Transactions',
        recentActivity: 'Recent Activity',
        noActivity: 'No activity yet',
        noNFTs: 'No NFTs yet',
        noTransactions: 'No transactions yet',
        welcome: 'Welcome',
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        username: 'Username',
        submit: 'Login',
        registerSubmit: 'Register',
        loading: 'Processing...',
        or: 'or',
        loginWithGoogle: 'Login with Google',
        noAccount: 'Don\'t have an account?',
        registerLink: 'Register',
        hasAccount: 'Already have an account?',
        loginLink: 'Login',
        error: {
          emailExists: 'This email is already registered',
          usernameExists: 'This username is already taken',
          invalidEmail: 'Invalid email address',
          weakPassword: 'Password must be at least 6 characters',
          userDisabled: 'This account has been disabled',
          userNotFound: 'No user found with this email',
          wrongPassword: 'Incorrect password',
          default: 'Error logging in'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa',
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    }
  });

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzovIXHsl4h9qPlWB8xt92p9Yw_mrPUIU",
  authDomain: "irnftplatforn-database.firebaseapp.com",
  projectId: "irnftplatforn-database",
  storageBucket: "irnftplatforn-database.firebasestorage.app",
  messagingSenderId: "443800997169",
  appId: "1:443800997169:web:2145a8d4b710c741d2f410",
  measurementId: "G-FXEWS782V5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default i18n; 