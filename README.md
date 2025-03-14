# IRNFT - پلتفرم NFT ایرانی

پلتفرم NFT ایرانی یک وب‌سایت برای خرید، فروش و مدیریت توکن‌های غیرقابل تعویض (NFT) است.

## ویژگی‌ها

- احراز هویت با ایمیل و گوگل
- اتصال کیف پول اتریوم
- نمایش موجودی و NFT های کاربر
- ثبت فعالیت‌های اخیر
- پشتیبانی از زبان‌های فارسی و انگلیسی
- رابط کاربری زیبا و واکنش‌گرا

## تکنولوژی‌ها

- React.js
- Vite
- Firebase
- i18next
- React Router
- Font Awesome
- Vazir Font

## نصب و اجرا

1. کلون کردن پروژه:
```bash
git clone https://github.com/yourusername/irnft.git
cd irnft
```

2. نصب وابستگی‌ها:
```bash
npm install
```

3. ایجاد فایل `.env` و تنظیم متغیرهای محیطی:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. اجرای پروژه در محیط توسعه:
```bash
npm run dev
```

5. ساخت نسخه تولید:
```bash
npm run build
```

## ساختار پروژه

```
irnft/
├── src/
│   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   ├── firebase/
│   │   ├── i18n/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## مشارکت

برای مشارکت در پروژه:

1. فورک کردن پروژه
2. ایجاد شاخه جدید (`git checkout -b feature/amazing-feature`)
3. کامیت تغییرات (`git commit -m 'Add some amazing feature'`)
4. پوش کردن به شاخه (`git push origin feature/amazing-feature`)
5. باز کردن یک Pull Request

## مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر به فایل [LICENSE](LICENSE) مراجعه کنید.

## تماس

- ایمیل: your.email@example.com
- وب‌سایت: https://your-website.com
- توییتر: [@yourusername](https://twitter.com/yourusername)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
