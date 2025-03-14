import { storage } from './storage'
import { notification } from './notification'

export const security = {
  // بررسی امنیت رمز عبور
  validatePassword: (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return {
        isValid: false,
        message: `رمز عبور باید حداقل ${minLength} کاراکتر باشد`
      }
    }

    if (!hasUpperCase) {
      return {
        isValid: false,
        message: 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد'
      }
    }

    if (!hasLowerCase) {
      return {
        isValid: false,
        message: 'رمز عبور باید حداقل یک حرف کوچک داشته باشد'
      }
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'رمز عبور باید حداقل یک عدد داشته باشد'
      }
    }

    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'رمز عبور باید حداقل یک کاراکتر خاص داشته باشد'
      }
    }

    return {
      isValid: true,
      message: 'رمز عبور معتبر است'
    }
  },

  // رمزنگاری داده
  encrypt: (data) => {
    try {
      const jsonString = JSON.stringify(data)
      return btoa(jsonString)
    } catch (error) {
      console.error('خطا در رمزنگاری:', error)
      return null
    }
  },

  // رمزگشایی داده
  decrypt: (encryptedData) => {
    try {
      const jsonString = atob(encryptedData)
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('خطا در رمزگشایی:', error)
      return null
    }
  },

  // تولید توکن تصادفی
  generateToken: (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
  },

  // بررسی اعتبار توکن
  validateToken: (token) => {
    if (!token) return false
    const userData = storage.getUserData()
    return userData && userData.token === token
  },

  // بررسی امنیت نشست
  checkSession: () => {
    const userData = storage.getUserData()
    if (!userData) return false

    const sessionExpiry = new Date(userData.sessionExpiry)
    const now = new Date()

    if (now > sessionExpiry) {
      storage.removeUserData()
      notification.warning('نشست شما منقضی شده است')
      return false
    }

    return true
  },

  // بررسی امنیت درخواست
  validateRequest: (request) => {
    const requiredHeaders = ['Content-Type', 'Authorization']
    const hasRequiredHeaders = requiredHeaders.every(header => 
      request.headers && request.headers[header]
    )

    if (!hasRequiredHeaders) {
      return {
        isValid: false,
        message: 'درخواست نامعتبر است'
      }
    }

    return {
      isValid: true,
      message: 'درخواست معتبر است'
    }
  },

  // بررسی امنیت فایل
  validateFile: (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'حجم فایل بیش از حد مجاز است'
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'نوع فایل پشتیبانی نمی‌شود'
      }
    }

    return {
      isValid: true,
      message: 'فایل معتبر است'
    }
  },

  // بررسی امنیت URL
  validateUrl: (url) => {
    try {
      new URL(url)
      return {
        isValid: true,
        message: 'URL معتبر است'
      }
    } catch (error) {
      return {
        isValid: false,
        message: 'URL نامعتبر است'
      }
    }
  },

  // بررسی امنیت ایمیل
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? 'ایمیل معتبر است' : 'ایمیل نامعتبر است'
    }
  },

  // بررسی امنیت نام کاربری
  validateUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return {
      isValid: usernameRegex.test(username),
      message: usernameRegex.test(username) 
        ? 'نام کاربری معتبر است' 
        : 'نام کاربری باید بین ۳ تا ۲۰ کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد'
    }
  },

  // بررسی امنیت آدرس کیف پول
  validateWalletAddress: (address) => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    return {
      isValid: addressRegex.test(address),
      message: addressRegex.test(address) 
        ? 'آدرس کیف پول معتبر است' 
        : 'آدرس کیف پول نامعتبر است'
    }
  },

  // بررسی امنیت مقدار تراکنش
  validateTransactionAmount: (amount) => {
    if (isNaN(amount) || amount <= 0) {
      return {
        isValid: false,
        message: 'مقدار تراکنش نامعتبر است'
      }
    }

    return {
      isValid: true,
      message: 'مقدار تراکنش معتبر است'
    }
  }
} 