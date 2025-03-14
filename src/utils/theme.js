import { THEMES, DEFAULT_THEME } from './constants'
import { storage } from './storage'

const THEME_KEY = 'theme'

export const theme = {
  // دریافت تم فعلی
  getCurrentTheme: () => {
    return storage.get(THEME_KEY) || DEFAULT_THEME
  },

  // تنظیم تم
  setTheme: (themeName) => {
    if (!Object.values(THEMES).includes(themeName)) {
      console.error('تم نامعتبر است')
      return false
    }

    storage.set(THEME_KEY, themeName)
    document.documentElement.setAttribute('data-theme', themeName)
    return true
  },

  // تغییر تم
  toggleTheme: () => {
    const currentTheme = theme.getCurrentTheme()
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    return theme.setTheme(newTheme)
  },

  // تنظیمات تم‌ها
  themes: {
    [THEMES.LIGHT]: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#333333',
      textSecondary: '#666666',
      border: '#E0E0E0',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      info: '#5856D6'
    },
    [THEMES.DARK]: {
      primary: '#0A84FF',
      secondary: '#64D2FF',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      error: '#FF453A',
      success: '#32D74B',
      warning: '#FFD60A',
      info: '#5E5CE6'
    }
  },

  // دریافت رنگ‌های تم فعلی
  getCurrentColors: () => {
    const currentTheme = theme.getCurrentTheme()
    return theme.themes[currentTheme]
  },

  // دریافت رنگ خاص
  getColor: (colorName) => {
    const colors = theme.getCurrentColors()
    return colors[colorName] || null
  },

  // تنظیم متغیرهای CSS
  applyTheme: () => {
    const colors = theme.getCurrentColors()
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  },

  // تنظیمات پیش‌فرض CSS
  defaultStyles: `
    :root {
      --primary: #4A90E2;
      --secondary: #50E3C2;
      --background: #FFFFFF;
      --surface: #F5F5F5;
      --text: #333333;
      --text-secondary: #666666;
      --border: #E0E0E0;
      --error: #FF3B30;
      --success: #34C759;
      --warning: #FF9500;
      --info: #5856D6;
    }

    [data-theme="dark"] {
      --primary: #0A84FF;
      --secondary: #64D2FF;
      --background: #000000;
      --surface: #1C1C1E;
      --text: #FFFFFF;
      --text-secondary: #8E8E93;
      --border: #38383A;
      --error: #FF453A;
      --success: #32D74B;
      --warning: #FFD60A;
      --info: #5E5CE6;
    }
  `,

  // اضافه کردن استایل‌های پیش‌فرض به صفحه
  initialize: () => {
    const style = document.createElement('style')
    style.textContent = theme.defaultStyles
    document.head.appendChild(style)
    theme.applyTheme()
  }
} 