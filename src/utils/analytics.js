import { storage } from './storage'

export const analytics = {
  // ذخیره رویداد
  trackEvent: (eventName, eventData = {}) => {
    try {
      const events = storage.get('analytics_events') || []
      events.push({
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      })
      storage.set('analytics_events', events)
    } catch (error) {
      console.error('خطا در ثبت رویداد:', error)
    }
  },

  // ذخیره صفحه‌بینی
  trackPageView: (pageData = {}) => {
    try {
      const pageViews = storage.get('analytics_pageviews') || []
      pageViews.push({
        ...pageData,
        timestamp: new Date().toISOString()
      })
      storage.set('analytics_pageviews', pageViews)
    } catch (error) {
      console.error('خطا در ثبت صفحه‌بینی:', error)
    }
  },

  // ذخیره خطا
  trackError: (error, errorData = {}) => {
    try {
      const errors = storage.get('analytics_errors') || []
      errors.push({
        message: error.message,
        stack: error.stack,
        ...errorData,
        timestamp: new Date().toISOString()
      })
      storage.set('analytics_errors', errors)
    } catch (error) {
      console.error('خطا در ثبت خطا:', error)
    }
  },

  // ذخیره عملکرد
  trackPerformance: (metricName, value, metadata = {}) => {
    try {
      const performance = storage.get('analytics_performance') || []
      performance.push({
        metric: metricName,
        value: value,
        ...metadata,
        timestamp: new Date().toISOString()
      })
      storage.set('analytics_performance', performance)
    } catch (error) {
      console.error('خطا در ثبت عملکرد:', error)
    }
  },

  // دریافت آمار رویدادها
  getEventStats: () => {
    try {
      const events = storage.get('analytics_events') || []
      const stats = {}

      events.forEach(event => {
        if (!stats[event.name]) {
          stats[event.name] = 0
        }
        stats[event.name]++
      })

      return stats
    } catch (error) {
      console.error('خطا در دریافت آمار رویدادها:', error)
      return {}
    }
  },

  // دریافت آمار صفحه‌بینی
  getPageViewStats: () => {
    try {
      const pageViews = storage.get('analytics_pageviews') || []
      const stats = {}

      pageViews.forEach(page => {
        if (!stats[page.path]) {
          stats[page.path] = 0
        }
        stats[page.path]++
      })

      return stats
    } catch (error) {
      console.error('خطا در دریافت آمار صفحه‌بینی:', error)
      return {}
    }
  },

  // دریافت آمار خطاها
  getErrorStats: () => {
    try {
      const errors = storage.get('analytics_errors') || []
      const stats = {
        total: errors.length,
        byType: {}
      }

      errors.forEach(error => {
        const type = error.type || 'unknown'
        if (!stats.byType[type]) {
          stats.byType[type] = 0
        }
        stats.byType[type]++
      })

      return stats
    } catch (error) {
      console.error('خطا در دریافت آمار خطاها:', error)
      return { total: 0, byType: {} }
    }
  },

  // دریافت آمار عملکرد
  getPerformanceStats: () => {
    try {
      const performance = storage.get('analytics_performance') || []
      const stats = {}

      performance.forEach(metric => {
        if (!stats[metric.metric]) {
          stats[metric.metric] = {
            count: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity
          }
        }

        const stat = stats[metric.metric]
        stat.count++
        stat.sum += metric.value
        stat.min = Math.min(stat.min, metric.value)
        stat.max = Math.max(stat.max, metric.value)
      })

      // محاسبه میانگین
      Object.keys(stats).forEach(metric => {
        stats[metric].average = stats[metric].sum / stats[metric].count
      })

      return stats
    } catch (error) {
      console.error('خطا در دریافت آمار عملکرد:', error)
      return {}
    }
  },

  // پاک کردن داده‌های قدیمی
  cleanupOldData: (maxAge = 30 * 24 * 60 * 60 * 1000) => { // 30 روز
    try {
      const now = new Date().getTime()
      const keys = [
        'analytics_events',
        'analytics_pageviews',
        'analytics_errors',
        'analytics_performance'
      ]

      keys.forEach(key => {
        const data = storage.get(key) || []
        const filteredData = data.filter(item => {
          const itemDate = new Date(item.timestamp).getTime()
          return now - itemDate <= maxAge
        })
        storage.set(key, filteredData)
      })
    } catch (error) {
      console.error('خطا در پاک کردن داده‌های قدیمی:', error)
    }
  },

  // دریافت گزارش کامل
  getFullReport: () => {
    return {
      events: analytics.getEventStats(),
      pageViews: analytics.getPageViewStats(),
      errors: analytics.getErrorStats(),
      performance: analytics.getPerformanceStats()
    }
  },

  // ارسال گزارش به سرور
  sendReport: async () => {
    try {
      const report = analytics.getFullReport()
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      })

      if (!response.ok) {
        throw new Error('خطا در ارسال گزارش')
      }

      return true
    } catch (error) {
      console.error('خطا در ارسال گزارش:', error)
      return false
    }
  }
} 