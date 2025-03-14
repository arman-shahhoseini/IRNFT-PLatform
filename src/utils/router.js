import { ROUTES } from './constants'
import { storage } from './storage'

export const router = {
  // دریافت مسیر فعلی
  getCurrentPath: () => {
    return window.location.pathname
  },

  // بررسی مسیر فعلی
  isCurrentPath: (path) => {
    return router.getCurrentPath() === path
  },

  // هدایت به مسیر جدید
  navigate: (path, options = {}) => {
    const { replace = false, state = null } = options

    if (replace) {
      window.history.replaceState(state, '', path)
    } else {
      window.history.pushState(state, '', path)
    }

    window.dispatchEvent(new PopStateEvent('popstate'))
  },

  // هدایت به صفحه اصلی
  goToHome: () => {
    router.navigate(ROUTES.HOME)
  },

  // هدایت به داشبورد
  goToDashboard: () => {
    router.navigate(ROUTES.DASHBOARD)
  },

  // هدایت به پروفایل
  goToProfile: () => {
    router.navigate(ROUTES.PROFILE)
  },

  // هدایت به صفحه NFT
  goToNFT: (nftId) => {
    router.navigate(`${ROUTES.NFT}/${nftId}`)
  },

  // هدایت به بازار
  goToMarketplace: () => {
    router.navigate(ROUTES.MARKETPLACE)
  },

  // هدایت به فعالیت‌ها
  goToActivity: () => {
    router.navigate(ROUTES.ACTIVITY)
  },

  // هدایت به تنظیمات
  goToSettings: () => {
    router.navigate(ROUTES.SETTINGS)
  },

  // بررسی نیاز به احراز هویت
  requiresAuth: (path) => {
    const publicPaths = [ROUTES.HOME, ROUTES.MARKETPLACE]
    return !publicPaths.includes(path)
  },

  // بررسی دسترسی به مسیر
  checkAccess: (path) => {
    const user = storage.getUserData()
    const requiresAuth = router.requiresAuth(path)

    if (requiresAuth && !user) {
      router.navigate(ROUTES.HOME, { replace: true })
      return false
    }

    return true
  },

  // اضافه کردن لیسنر تغییر مسیر
  addRouteChangeListener: (callback) => {
    window.addEventListener('popstate', callback)
    return () => window.removeEventListener('popstate', callback)
  },

  // دریافت پارامترهای URL
  getQueryParams: () => {
    const params = new URLSearchParams(window.location.search)
    return Object.fromEntries(params.entries())
  },

  // اضافه کردن پارامتر به URL
  addQueryParam: (key, value) => {
    const params = new URLSearchParams(window.location.search)
    params.set(key, value)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
  },

  // حذف پارامتر از URL
  removeQueryParam: (key) => {
    const params = new URLSearchParams(window.location.search)
    params.delete(key)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
  },

  // دریافت بخش‌های مسیر
  getPathSegments: () => {
    return router.getCurrentPath().split('/').filter(Boolean)
  },

  // دریافت آخرین بخش مسیر
  getLastPathSegment: () => {
    const segments = router.getPathSegments()
    return segments[segments.length - 1]
  },

  // بررسی تطابق مسیر با الگو
  matchPath: (path, pattern) => {
    const pathSegments = path.split('/').filter(Boolean)
    const patternSegments = pattern.split('/').filter(Boolean)

    if (pathSegments.length !== patternSegments.length) {
      return false
    }

    return patternSegments.every((segment, index) => {
      return segment === '*' || segment === pathSegments[index]
    })
  },

  // دریافت پارامترهای مسیر
  getPathParams: (path, pattern) => {
    const pathSegments = path.split('/').filter(Boolean)
    const patternSegments = pattern.split('/').filter(Boolean)
    const params = {}

    patternSegments.forEach((segment, index) => {
      if (segment.startsWith(':')) {
        const key = segment.slice(1)
        params[key] = pathSegments[index]
      }
    })

    return params
  }
} 