import { Z_INDEX } from './constants'

let notificationCount = 0

const createNotificationElement = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.style.zIndex = Z_INDEX.NOTIFICATION + notificationCount++
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
    <div class="notification-progress"></div>
  `
  return notification
}

const showNotification = (message, type = 'info', duration = 5000) => {
  const notification = createNotificationElement(message, type)
  document.body.appendChild(notification)

  const closeButton = notification.querySelector('.notification-close')
  const progressBar = notification.querySelector('.notification-progress')

  // تنظیم نوار پیشرفت
  progressBar.style.animation = `progress ${duration}ms linear`

  // حذف اعلان پس از اتمام زمان
  setTimeout(() => {
    notification.classList.add('notification-fade-out')
    setTimeout(() => {
      document.body.removeChild(notification)
      notificationCount--
    }, 300)
  }, duration)

  // حذف اعلان با کلیک روی دکمه بستن
  closeButton.addEventListener('click', () => {
    notification.classList.add('notification-fade-out')
    setTimeout(() => {
      document.body.removeChild(notification)
      notificationCount--
    }, 300)
  })
}

export const notification = {
  success: (message, duration) => {
    showNotification(message, 'success', duration)
  },

  error: (message, duration) => {
    showNotification(message, 'error', duration)
  },

  warning: (message, duration) => {
    showNotification(message, 'warning', duration)
  },

  info: (message, duration) => {
    showNotification(message, 'info', duration)
  },

  // اعلان‌های پیش‌فرض
  default: {
    success: {
      login: 'ورود موفقیت‌آمیز بود',
      register: 'ثبت نام موفقیت‌آمیز بود',
      logout: 'خروج موفقیت‌آمیز بود',
      profileUpdate: 'پروفایل با موفقیت بروزرسانی شد',
      nftCreate: 'NFT با موفقیت ایجاد شد',
      nftUpdate: 'NFT با موفقیت بروزرسانی شد',
      nftDelete: 'NFT با موفقیت حذف شد',
      walletConnect: 'کیف پول با موفقیت متصل شد',
      walletDisconnect: 'اتصال کیف پول قطع شد'
    },
    error: {
      login: 'خطا در ورود',
      register: 'خطا در ثبت نام',
      logout: 'خطا در خروج',
      profileUpdate: 'خطا در بروزرسانی پروفایل',
      nftCreate: 'خطا در ایجاد NFT',
      nftUpdate: 'خطا در بروزرسانی NFT',
      nftDelete: 'خطا در حذف NFT',
      walletConnect: 'خطا در اتصال به کیف پول',
      walletDisconnect: 'خطا در قطع اتصال کیف پول',
      network: 'خطا در اتصال به شبکه',
      server: 'خطای سرور'
    },
    warning: {
      sessionExpired: 'نشست شما منقضی شده است',
      insufficientFunds: 'موجودی کافی نیست',
      invalidInput: 'ورودی نامعتبر است',
      fileTooLarge: 'حجم فایل بیش از حد مجاز است',
      unsupportedFile: 'نوع فایل پشتیبانی نمی‌شود'
    },
    info: {
      loading: 'در حال بارگذاری...',
      processing: 'در حال پردازش...',
      updating: 'در حال بروزرسانی...',
      connecting: 'در حال اتصال...',
      disconnecting: 'در حال قطع اتصال...'
    }
  }
} 