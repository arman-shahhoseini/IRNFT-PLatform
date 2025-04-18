/**
 * پیشنهادات پرامپت برای الهام گرفتن کاربران در ایجاد تصاویر NFT
 */
export const promptSuggestions = [
  "منظره کوهستانی با آبشار و جنگل سرسبز",
  "پرتره فانتزی شخصیت با چشمان درخشان و لباس جادویی",
  "شهر آینده با ساختمان‌های نئون و ماشین‌های پرنده", 
  "باغ گل‌های رنگارنگ در غروب آفتاب",
  "اقیانوس طوفانی با امواج بلند و آسمان ابری",
  "تمدن باستانی با معماری پیچیده و افراد در حال انجام آیین‌های مذهبی",
  "جنگل با درختان عظیم و موجودات جادویی",
  "شهر تاریخی ایرانی با معماری سنتی و بازار شلوغ",
  "فضانورد تنها روی سیاره‌ای دوردست با آسمان چند رنگ",
  "موجود افسانه‌ای با بال‌های درخشان در آسمان شب",
  "دنیای زیر آب با مرجان‌های رنگارنگ و موجودات عجیب",
  "منظره کویری با صخره‌های عظیم و آسمان پر ستاره",
  "مینیاتور ایرانی با طرح‌های پیچیده و رنگ‌های درخشان",
  "پل خیالی میان دو دنیای متفاوت"
];

/**
 * پرامپت‌های منفی پیش‌فرض برای اصلاح تصاویر
 */
export const defaultNegativePrompts = [
  "low quality, blurry, distorted",
  "deformed, disfigured, bad anatomy",
  "ugly, duplicate, morbid, poorly drawn",
  "mutation, extra limbs, poorly drawn face"
];

/**
 * سبک‌های مختلف تصویرسازی
 */
export const imageStyles = [
  { id: 'realistic', name: 'واقع‌گرایانه', prompt: 'ultra realistic, highly detailed, photorealistic' },
  { id: 'cartoon', name: 'کارتونی', prompt: 'cartoon style, colorful, stylized' },
  { id: 'anime', name: 'انیمه', prompt: 'anime style, japanese animation, vibrant colors' },
  { id: 'abstract', name: 'انتزاعی', prompt: 'abstract art, non-representational, geometric shapes' },
  { id: 'painting', name: 'نقاشی', prompt: 'digital painting, artistic, brushstrokes' },
  { id: 'cyberpunk', name: 'سایبرپانک', prompt: 'cyberpunk, neon, futuristic, sci-fi, high tech' },
  { id: 'fantasy', name: 'فانتزی', prompt: 'fantasy art, magical, mythical creatures, enchanted' },
  { id: 'persian', name: 'ایرانی', prompt: 'persian art, iranian miniature, traditional patterns' }
]; 