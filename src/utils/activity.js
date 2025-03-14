import { db } from '../firebase'
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

export const addActivity = async (userId, type, details) => {
  try {
    const activityData = {
      userId,
      type,
      details,
      timestamp: new Date().toISOString()
    }

    await addDoc(collection(db, 'activities'), activityData)
  } catch (error) {
    console.error('Error adding activity:', error)
    throw error
  }
}

export const getRecentActivities = async (userId, limit = 10) => {
  try {
    const activitiesRef = collection(db, 'activities')
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    )

    const querySnapshot = await getDocs(q)
    const activities = []

    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return activities
  } catch (error) {
    console.error('Error getting recent activities:', error)
    throw error
  }
}

export const getActivityTypes = () => {
  return {
    LOGIN: 'ورود به حساب',
    REGISTER: 'ثبت نام',
    CONNECT_WALLET: 'اتصال کیف پول',
    DISCONNECT_WALLET: 'قطع اتصال کیف پول',
    BUY_NFT: 'خرید NFT',
    SELL_NFT: 'فروش NFT',
    TRANSFER_NFT: 'انتقال NFT',
    UPDATE_PROFILE: 'بروزرسانی پروفایل'
  }
}

export const formatActivityDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'همین الان'
  } else if (minutes < 60) {
    return `${minutes} دقیقه پیش`
  } else if (hours < 24) {
    return `${hours} ساعت پیش`
  } else if (days < 7) {
    return `${days} روز پیش`
  } else {
    return date.toLocaleDateString('fa-IR')
  }
} 