# IRNFT - پلتفرم NFT ایرانی 🚀

<div align="center">
  <img src="public/images/Logo.png" alt="IRNFT Logo" width="200"/>
</div>

<div align="center">
  <p>پلتفرم پیشرو NFT ایرانی برای خرید، فروش و مدیریت توکن‌های غیرقابل تعویض</p>
</div>

<div align="center">
  
  ![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat-square&logo=vite)
  ![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28?style=flat-square&logo=firebase)
  ![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=flat-square&logo=supabase)
  ![Web3](https://img.shields.io/badge/Web3-1.x-F16822?style=flat-square&logo=ethereum)
  
</div>

## ✨ ویژگی‌ها

- **احراز هویت پیشرفته**: ورود با ایمیل/رمز عبور و گوگل
- **اتصال کیف پول‌های متعدد**: MetaMask، TrustWallet و WalletConnect
- **داشبورد کاربری**: مدیریت NFT ها و مشاهده فعالیت‌ها
- **بازارچه**: خرید و فروش NFT با امنیت بالا
- **پشتیبانی کامل از زبان فارسی**: رابط کاربری کاملاً فارسی
- **طراحی واکنش‌گرا**: تجربه کاربری عالی در تمام دستگاه‌ها
- **امنیت بالا**: اتصال امن به بلاکچین و مدیریت داده‌ها

## 🛠️ تکنولوژی‌ها

- **فرانت‌اند**: React.js، Vite، React Router، i18next
- **استایل**: CSS، SASS
- **بک‌اند**: Firebase، Supabase
- **بلاکچین**: Web3.js، Ethers.js
- **احراز هویت**: Firebase Auth، Supabase Auth، Web3 Wallets

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js نسخه 14.x یا بالاتر
- NPM نسخه ۶.x یا بالاتر
- حساب Firebase و Supabase

### مراحل نصب

1. **کلون کردن پروژه**:
```bash
git clone https://github.com/arman-shahhoseini/IRNFT-Platform.git
cd IRNFT-Platform
```

2. **نصب وابستگی‌ها**:
```bash
npm install
```

3. **تنظیم متغیرهای محیطی**:
   - فایل `.env.example` را به `.env` تغییر نام دهید
   - مقادیر متغیرها را با اطلاعات خود پر کنید

4. **اجرای پروژه در محیط توسعه**:
```bash
npm run dev
```

## 📁 ساختار پروژه

```
IRNFT-Platform/
├── public/             # فایل‌های استاتیک
├── src/                # کد اصلی پروژه
│   ├── api/            # سرویس‌های API
│   ├── assets/         # تصاویر و استایل‌ها
│   ├── components/     # کامپوننت‌های React
│   ├── contexts/       # Context های React
│   ├── firebase/       # پیکربندی Firebase
│   ├── pages/          # صفحات اصلی
│   ├── translations/   # فایل‌های ترجمه
│   ├── utils/          # توابع و ابزارهای کمکی
│   ├── App.jsx         # کامپوننت اصلی
│   └── main.jsx        # نقطه ورود برنامه
└── README.md           # مستندات
```

## 🔧 متغیرهای محیطی

```env
# API
VITE_APP_API_URL=http://localhost:5000/api

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# بلاکچین
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_NETWORK_CHAIN_ID=11155111
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر به فایل [LICENSE](LICENSE) مراجعه کنید.
