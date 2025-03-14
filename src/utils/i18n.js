import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants'
import { storage } from './storage'

const LANGUAGE_KEY = 'language'

// ترجمه‌های پیش‌فرض
const translations = {
  fa: {
    // عمومی
    app: {
      name: 'IRNFT',
      description: 'پلتفرم NFT ایرانی'
    },
    common: {
      loading: 'در حال بارگذاری...',
      error: 'خطا',
      success: 'موفقیت',
      warning: 'هشدار',
      info: 'اطلاعات',
      save: 'ذخیره',
      cancel: 'انصراف',
      delete: 'حذف',
      edit: 'ویرایش',
      search: 'جستجو',
      filter: 'فیلتر',
      sort: 'مرتب‌سازی',
      more: 'بیشتر',
      less: 'کمتر'
    },
    auth: {
      login: 'ورود',
      register: 'ثبت نام',
      logout: 'خروج',
      email: 'ایمیل',
      password: 'رمز عبور',
      username: 'نام کاربری',
      forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
      loginWithGoogle: 'ورود با گوگل',
      dontHaveAccount: 'حساب کاربری ندارید؟',
      alreadyHaveAccount: 'حساب کاربری دارید؟'
    },
    dashboard: {
      title: 'داشبورد',
      totalBalance: 'موجودی کل',
      totalNFTs: 'تعداد NFT ها',
      totalValue: 'ارزش کل',
      recentActivity: 'فعالیت‌های اخیر',
      myNFTs: 'NFT های من',
      marketplace: 'بازار',
      settings: 'تنظیمات'
    },
    profile: {
      title: 'پروفایل',
      personalInfo: 'اطلاعات شخصی',
      walletInfo: 'اطلاعات کیف پول',
      activityHistory: 'تاریخچه فعالیت',
      settings: 'تنظیمات'
    },
    nft: {
      create: 'ایجاد NFT',
      edit: 'ویرایش NFT',
      delete: 'حذف NFT',
      transfer: 'انتقال NFT',
      sell: 'فروش NFT',
      buy: 'خرید NFT',
      price: 'قیمت',
      description: 'توضیحات',
      image: 'تصویر',
      status: 'وضعیت',
      owner: 'مالک',
      createdAt: 'تاریخ ایجاد',
      updatedAt: 'تاریخ بروزرسانی'
    },
    marketplace: {
      title: 'بازار',
      buyNFT: 'خرید NFT',
      sellNFT: 'فروش NFT',
      price: 'قیمت',
      filter: 'فیلتر',
      sort: 'مرتب‌سازی',
      search: 'جستجو'
    },
    settings: {
      title: 'تنظیمات',
      language: 'زبان',
      theme: 'تم',
      notifications: 'اعلان‌ها',
      security: 'امنیت',
      privacy: 'حریم خصوصی'
    }
  },
  en: {
    // General
    app: {
      name: 'IRNFT',
      description: 'Iranian NFT Platform'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      more: 'More',
      less: 'Less'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      forgotPassword: 'Forgot Password?',
      loginWithGoogle: 'Login with Google',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?'
    },
    dashboard: {
      title: 'Dashboard',
      totalBalance: 'Total Balance',
      totalNFTs: 'Total NFTs',
      totalValue: 'Total Value',
      recentActivity: 'Recent Activity',
      myNFTs: 'My NFTs',
      marketplace: 'Marketplace',
      settings: 'Settings'
    },
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      walletInfo: 'Wallet Information',
      activityHistory: 'Activity History',
      settings: 'Settings'
    },
    nft: {
      create: 'Create NFT',
      edit: 'Edit NFT',
      delete: 'Delete NFT',
      transfer: 'Transfer NFT',
      sell: 'Sell NFT',
      buy: 'Buy NFT',
      price: 'Price',
      description: 'Description',
      image: 'Image',
      status: 'Status',
      owner: 'Owner',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    },
    marketplace: {
      title: 'Marketplace',
      buyNFT: 'Buy NFT',
      sellNFT: 'Sell NFT',
      price: 'Price',
      filter: 'Filter',
      sort: 'Sort',
      search: 'Search'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      security: 'Security',
      privacy: 'Privacy'
    }
  }
}

export const i18n = {
  // دریافت زبان فعلی
  getCurrentLanguage: () => {
    return storage.get(LANGUAGE_KEY) || DEFAULT_LANGUAGE
  },

  // تنظیم زبان
  setLanguage: (language) => {
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
      console.error('زبان پشتیبانی نمی‌شود')
      return false
    }

    storage.set(LANGUAGE_KEY, language)
    document.documentElement.setAttribute('lang', language)
    return true
  },

  // تغییر زبان
  toggleLanguage: () => {
    const currentLanguage = i18n.getCurrentLanguage()
    const newLanguage = currentLanguage === 'fa' ? 'en' : 'fa'
    return i18n.setLanguage(newLanguage)
  },

  // دریافت ترجمه
  t: (key, params = {}) => {
    const language = i18n.getCurrentLanguage()
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        return key
      }
    }

    // جایگزینی پارامترها
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] || match
    })
  },

  // دریافت زبان‌های پشتیبانی شده
  getSupportedLanguages: () => {
    return SUPPORTED_LANGUAGES
  },

  // دریافت نام زبان
  getLanguageName: (code) => {
    return SUPPORTED_LANGUAGES[code] || code
  },

  // فرمت‌بندی اعداد بر اساس زبان
  formatNumber: (number) => {
    const language = i18n.getCurrentLanguage()
    return new Intl.NumberFormat(language).format(number)
  },

  // فرمت‌بندی تاریخ بر اساس زبان
  formatDate: (date) => {
    const language = i18n.getCurrentLanguage()
    return new Intl.DateTimeFormat(language).format(new Date(date))
  },

  // فرمت‌بندی پول بر اساس زبان
  formatCurrency: (amount, currency = 'IRR') => {
    const language = i18n.getCurrentLanguage()
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
} 