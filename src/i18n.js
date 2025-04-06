import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: {
        translation: {
          welcome_to_irnft: 'به IRNFT خوش آمدید',
          discover_unique_nfts: 'مجموعه‌های هنر دیجیتال منحصر به فرد را کشف کنید',
          explore_collections: 'مشاهده کالکشن‌ها',
          high_security: 'امنیت بالا',
          fast_transactions: 'سرعت معاملات',
          active_community: 'جامعه فعال',
          featured_collections: 'کالکشن‌های ویژه',
          active: 'فعال',
          fates_and_faces: 'سرنوشت‌ها و چهره‌ها',
          a_unique_collection_of_20_nfts_with_stunning_designs_and_deep_concepts: 'مجموعه‌ای منحصر به فرد از 20 NFT با طراحی‌های خیره‌کننده و مفاهیم عمیق',
          level_1_20: 'سطح 1-20',
          '10_legend': '10 افسانه‌ای',
          view_collection: 'مشاهده کالکشن',
          coming_soon: 'به زودی',
          eclipse_syndicate: 'سندیکا خسوف',
          a_mysterious_collection_of_shadow_nfts_with_unique_stories: 'مجموعه‌ای مرموز از NFT‌های سایه‌ای با داستان‌های منحصر به فرد',
          neon_sovereigns: 'سلاطین نئون: فرمانروایی ملکه‌های سایبر',
          a_futuristic_collection_of_cyberpunk_nfts_with_neon_designs: 'مجموعه‌ای آینده‌نگرانه از NFT‌های سایبرپانک با طراحی‌های نئون',
          about_irnft: 'درباره IRNFT',
          pioneering_digital_art_and_nft_in_iran_creating_a_bright_future_for_artists: 'پیشگام در عرصه هنر دیجیتال و NFT در ایران، با هدف خلق آینده‌ای درخشان برای هنرمندان',
          quick_links: 'دسترسی سریع',
          home: 'خانه',
          collections: 'کالکشن‌ها',
          marketplace: 'بازار',
          news: 'اخبار',
          support: 'پشتیبانی',
          faq: 'سوالات متداول',
          terms_of_service: 'قوانین و مقررات',
          privacy_policy: 'حریم خصوصی',
          contact_us: 'تماس با ما',
          copyright: '© ۱۴۰۳ IRNFT. تمامی حقوق محفوظ است.',
          connect_wallet: 'اتصال کیف پول',
          disconnect: 'قطع اتصال',
          login: 'ورود',
          dashboard: 'داشبورد',
          menu: 'منو',
          wallet: {
            connect: 'اتصال کیف پول',
            disconnect: 'قطع اتصال'
          },
          auth: {
            login: 'ورود',
            register: 'ثبت نام',
            logout: 'خروج',
            loginSubtitle: 'به حساب کاربری خود وارد شوید',
            registerSubtitle: 'ایجاد حساب کاربری جدید',
            email: 'ایمیل',
            emailPlaceholder: 'ایمیل خود را وارد کنید',
            password: 'رمز عبور',
            passwordPlaceholder: 'رمز عبور خود را وارد کنید',
            confirmPassword: 'تأیید رمز عبور',
            confirmPasswordPlaceholder: 'رمز عبور را مجدداً وارد کنید',
            username: 'نام کاربری',
            usernamePlaceholder: 'نام کاربری خود را وارد کنید',
            forgotPassword: 'فراموشی رمز عبور؟',
            orContinueWith: 'یا ادامه با',
            continueWithGoogle: 'ادامه با گوگل',
            dontHaveAccount: 'حساب کاربری ندارید؟',
            alreadyHaveAccount: 'قبلاً ثبت نام کرده‌اید؟',
            loginButton: 'ورود به حساب',
            registerButton: 'ثبت نام کاربر',
            errors: {
              invalidCredentials: 'ایمیل یا رمز عبور اشتباه است',
              googleSignIn: 'خطا در ورود با گوگل',
              default: 'خطایی رخ داده است. لطفاً دوباره تلاش کنید',
              passwordMismatch: 'رمز عبور و تأیید آن مطابقت ندارند',
              passwordLength: 'رمز عبور باید حداقل ۸ کاراکتر باشد'
            }
          },
          common: {
            back: 'بازگشت',
            loading: 'در حال بارگذاری...'
          }
        }
      },
      en: {
        translation: {
          welcome_to_irnft: 'Welcome to IRNFT',
          discover_unique_nfts: 'Discover Unique Digital Art Collections',
          explore_collections: 'Explore Collections',
          high_security: 'High Security',
          fast_transactions: 'Fast Transactions',
          active_community: 'Active Community',
          featured_collections: 'Featured Collections',
          active: 'Active',
          fates_and_faces: 'Fates & Faces',
          a_unique_collection_of_20_nfts_with_stunning_designs_and_deep_concepts: 'A unique collection of 20 NFTs with stunning designs and deep concepts',
          level_1_20: 'Level 1-20',
          '10_legend': '10 Legend',
          view_collection: 'View Collection',
          coming_soon: 'Coming Soon',
          eclipse_syndicate: 'Eclipse Syndicate',
          a_mysterious_collection_of_shadow_nfts_with_unique_stories: 'A mysterious collection of shadow NFTs with unique stories',
          neon_sovereigns: 'Neon Sovereigns: Reign of the Cyber Queens',
          a_futuristic_collection_of_cyberpunk_nfts_with_neon_designs: 'A futuristic collection of cyberpunk NFTs with neon designs',
          about_irnft: 'About IRNFT',
          pioneering_digital_art_and_nft_in_iran_creating_a_bright_future_for_artists: 'Pioneering Digital Art and NFT in Iran, creating a bright future for artists',
          quick_links: 'Quick Links',
          home: 'Home',
          collections: 'Collections',
          marketplace: 'Marketplace',
          news: 'News',
          support: 'Support',
          faq: 'FAQ',
          terms_of_service: 'Terms of Service',
          privacy_policy: 'Privacy Policy',
          contact_us: 'Contact Us',
          copyright: '© 2024 IRNFT. All rights reserved.',
          connect_wallet: 'Connect Wallet',
          disconnect: 'Disconnect',
          login: 'Login',
          dashboard: 'Dashboard',
          menu: 'Menu',
          wallet: {
            connect: 'Connect Wallet',
            disconnect: 'Disconnect'
          },
          auth: {
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            loginSubtitle: 'Sign in to your account',
            registerSubtitle: 'Create a new account',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Confirm your password',
            username: 'Username',
            usernamePlaceholder: 'Enter your username',
            forgotPassword: 'Forgot Password?',
            orContinueWith: 'Or continue with',
            continueWithGoogle: 'Continue with Google',
            dontHaveAccount: "Don't have an account?",
            alreadyHaveAccount: 'Already have an account?',
            loginButton: 'Sign In',
            registerButton: 'Register Account',
            errors: {
              invalidCredentials: 'Invalid email or password',
              googleSignIn: 'Error signing in with Google',
              default: 'An error occurred. Please try again',
              passwordMismatch: 'Passwords do not match',
              passwordLength: 'Password must be at least 8 characters'
            }
          },
          common: {
            back: 'Back',
            loading: 'Loading...'
          }
        }
      }
    },
    lng: 'fa',
    fallbackLng: 'fa',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 