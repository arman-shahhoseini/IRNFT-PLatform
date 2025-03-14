export const APP_NAME = 'IRNFT'
export const APP_DESCRIPTION = 'پلتفرم NFT ایرانی'
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
export const APP_API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000'

export const SUPPORTED_LANGUAGES = {
  fa: 'فارسی',
  en: 'English'
}

export const DEFAULT_LANGUAGE = 'fa'

export const NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet'
}

export const DEFAULT_NETWORK = import.meta.env.VITE_ETHEREUM_NETWORK || NETWORKS.TESTNET

export const NFT_STATUS = {
  AVAILABLE: 'موجود',
  SOLD: 'فروخته شده',
  RESERVED: 'رزرو شده',
  TRANSFERRED: 'انتقال یافته'
}

export const ACTIVITY_TYPES = {
  LOGIN: 'ورود',
  REGISTER: 'ثبت نام',
  CREATE_NFT: 'ایجاد NFT',
  TRANSFER_NFT: 'انتقال NFT',
  SELL_NFT: 'فروش NFT',
  BUY_NFT: 'خرید NFT',
  UPDATE_PROFILE: 'بروزرسانی پروفایل',
  CONNECT_WALLET: 'اتصال کیف پول',
  DISCONNECT_WALLET: 'قطع اتصال کیف پول'
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
export const MAX_IMAGE_DIMENSIONS = {
  width: 1920,
  height: 1080
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
}

export const CACHE = {
  USER_DATA: 'user_data',
  WALLET_DATA: 'wallet_data',
  NFT_DATA: 'nft_data',
  ACTIVITY_DATA: 'activity_data'
}

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  NFT: '/nft',
  MARKETPLACE: '/marketplace',
  ACTIVITY: '/activity',
  SETTINGS: '/settings'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete'
  },
  NFT: {
    LIST: '/nft/list',
    CREATE: '/nft/create',
    UPDATE: '/nft/update',
    DELETE: '/nft/delete',
    TRANSFER: '/nft/transfer'
  },
  MARKETPLACE: {
    LIST: '/marketplace/list',
    BUY: '/marketplace/buy',
    SELL: '/marketplace/sell'
  }
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  WALLET_DATA: 'wallet_data',
  LANGUAGE: 'language',
  THEME: 'theme'
}

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const DEFAULT_THEME = THEMES.LIGHT

export const BREAKPOINTS = {
  MOBILE: 576,
  TABLET: 768,
  LAPTOP: 992,
  DESKTOP: 1200
}

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 1100,
  TOOLTIP: 1200,
  NOTIFICATION: 1300
} 