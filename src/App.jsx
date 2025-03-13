import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [language, setLanguage] = useState('fa')
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const translations = {
    en: {
      nav: {
        home: 'Home',
        collections: 'Collections',
        marketplace: 'Marketplace',
        news: 'News',
        dashboard: 'Dashboard',
        login: 'Login',
        register: 'Register',
        search: 'Search...',
        connectWallet: 'Connect Wallet'
      },
      hero: {
        title: 'Welcome to IRNFT',
        subtitle: 'Discover Unique Digital Art Collections',
        cta: 'Explore Collections'
      },
      collections: {
        title: 'Featured Collections',
        comingSoon: 'Coming Soon',
        fatesAndFaces: 'Fates & Faces',
        eclipseSyndicate: 'Eclipse Syndicate',
        neonSovereigns: 'Neon Sovereigns: Reign of the Cyber Queens'
      },
      footer: {
        about: {
          title: 'About IRNFT',
          description: 'IRNFT is a unique platform for digital art collections, where each piece tells its own story through the lens of poker and fate.'
        },
        quickLinks: {
          title: 'Quick Links',
          home: 'Home',
          collections: 'Collections',
          marketplace: 'Marketplace',
          news: 'News',
          dashboard: 'Dashboard'
        },
        support: {
          title: 'Support',
          faq: 'FAQ',
          terms: 'Terms of Service',
          privacy: 'Privacy Policy',
          contact: 'Contact Us'
        },
        newsletter: {
          title: 'Newsletter',
          description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
          placeholder: 'Enter your email',
          subscribe: 'Subscribe'
        },
        copyright: '© 2024 IRNFT. All rights reserved.'
      }
    },
    fa: {
      nav: {
        home: 'خانه',
        collections: 'کالکشن‌ها',
        marketplace: 'بازار',
        news: 'اخبار',
        dashboard: 'داشبورد',
        login: 'ورود',
        register: 'ثبت نام',
        search: 'جستجو...',
        connectWallet: 'اتصال کیف پول'
      },
      hero: {
        title: 'به IRNFT خوش آمدید',
        subtitle: 'مجموعه‌های هنر دیجیتال منحصر به فرد را کشف کنید',
        cta: 'مشاهده کالکشن‌ها'
      },
      collections: {
        title: 'کالکشن‌های ویژه',
        comingSoon: 'به زودی',
        fatesAndFaces: 'سرنوشت‌ها و چهره‌ها',
        eclipseSyndicate: 'سندیکا خسوف',
        neonSovereigns: 'سلاطین نئون: فرمانروایی ملکه‌های سایبر'
      },
      footer: {
        about: {
          title: 'درباره IRNFT',
          description: 'IRNFT یک پلتفرم منحصر به فرد برای مجموعه‌های هنر دیجیتال است، جایی که هر اثر ، داستان خود را روایت می‌کند.'
        },
        quickLinks: {
          title: 'دسترسی سریع',
          home: 'خانه',
          collections: 'کالکشن‌ها',
          marketplace: 'بازار',
          news: 'اخبار',
          dashboard: 'داشبورد'
        },
        support: {
          title: 'پشتیبانی',
          faq: 'سوالات متداول',
          terms: 'قوانین و مقررات',
          privacy: 'حریم خصوصی',
          contact: 'تماس با ما'
        },
        newsletter: {
          title: 'خبرنامه',
          description: 'برای دریافت آخرین اخبار و پیشنهادات ویژه، در خبرنامه ما عضو شوید.',
          placeholder: 'ایمیل خود را وارد کنید',
          subscribe: 'عضویت'
        },
        copyright: '© ۱۴۰۳ IRNFT. تمامی حقوق محفوظ است.'
      }
    }
  }

  const t = translations[language]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          <a href="/" className="nav-logo">
            <img src="/src/assets/images/logo/Logo.png" alt="IRNFT Logo" />
          </a>
          <div className="nav-links">
            <a href="/" className="nav-link">{t.nav.home}</a>
            <a href="/collections" className="nav-link">{t.nav.collections}</a>
            <a href="/marketplace" className="nav-link">{t.nav.marketplace}</a>
            <a href="/news" className="nav-link">{t.nav.news}</a>
            <a href="/dashboard" className="nav-link">{t.nav.dashboard}</a>
          </div>
        </div>
        
        <div className="nav-right">
          <div className="search-box">
            <input type="text" placeholder={t.nav.search} />
          </div>
          <div className="auth-buttons">
            <button className="connect-wallet-btn">{t.nav.connectWallet}</button>
            <button className="register-btn">{t.nav.register}</button>
          </div>
          <div className="language-switcher">
            <button 
              className={`language-btn ${language === 'fa' ? 'active' : ''}`}
              onClick={() => setLanguage('fa')}
            >
              FA
            </button>
            <button 
              className={`language-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-links">
          <a href="/" className="nav-link">{t.nav.home}</a>
          <a href="/collections" className="nav-link">{t.nav.collections}</a>
          <a href="/marketplace" className="nav-link">{t.nav.marketplace}</a>
          <a href="/news" className="nav-link">{t.nav.news}</a>
          <a href="/dashboard" className="nav-link">{t.nav.dashboard}</a>
        </div>
        <div className="auth-buttons">
          <button className="connect-wallet-btn">{t.nav.connectWallet}</button>
          <button className="register-btn">{t.nav.register}</button>
        </div>
        <div className="language-switcher">
          <button 
            className={`language-btn ${language === 'fa' ? 'active' : ''}`}
            onClick={() => setLanguage('fa')}
          >
            FA
          </button>
          <button 
            className={`language-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>

      {/* Hero Section */}
      <section className="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/src/assets/images/hero/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
          <button className="cta-button">{t.hero.cta}</button>
          <div className="hero-features">
            <div className="hero-feature">
              <i className="fas fa-shield-alt"></i>
              <span>{language === 'fa' ? 'امنیت بالا' : 'High Security'}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-bolt"></i>
              <span>{language === 'fa' ? 'سرعت معاملات' : 'Fast Transactions'}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-users"></i>
              <span>{language === 'fa' ? 'جامعه فعال' : 'Active Community'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="collections">
        <div className="collections-header">
          <h2>{t.collections.title}</h2>
          <div className="collections-line"></div>
        </div>
        
        <div className="collections-container">
          {/* Active Collection */}
          <div className="featured-collection">
            <div className="featured-content">
              <div className="featured-text">
                <div className="status-badge active">
                  <span className="status-dot"></span>
                  {language === 'fa' ? 'فعال' : 'Active'}
                </div>
                <h3>{t.collections.fatesAndFaces}</h3>
                <p>{language === 'fa' ? 'مجموعه‌ای منحصر به فرد از 20 NFT با طراحی‌های خیره‌کننده و مفاهیم عمیق' : 'A unique collection of 20 NFTs with stunning designs and deep concepts'}</p>
                <div className="collection-stats">
                  <div className="stat-item">
                    <i className="fas fa-cube"></i>
                    <span>20 NFT</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{language === 'fa' ? 'سطح 1-20' : 'Level 1-20'}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-crown"></i>
                    <span>{language === 'fa' ? '10 افسانه‌ای' : '10 Legend'}</span>
                  </div>
                </div>
                <button className="view-collection">
                  {language === 'fa' ? 'مشاهده کالکشن' : 'View Collection'}
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
              <div className="featured-image">
                <img src="/src/assets/images/collections/fates-faces.jpg" alt="Fates & Faces" />
              </div>
            </div>
          </div>

          {/* Upcoming Collections */}
          <div className="upcoming-collections">
            <div className="upcoming-card" data-coming-soon={t.collections.comingSoon}>
              <div className="card-image">
                <img src="/src/assets/images/collections/eclipse-syndicate.jpg" alt="Eclipse Syndicate" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{t.collections.eclipseSyndicate}</h4>
                  <p>{language === 'fa' ? 'مجموعه‌ای مرموز از NFT‌های سایه‌ای با داستان‌های منحصر به فرد' : 'A mysterious collection of shadow NFTs with unique stories'}</p>
                </div>
              </div>
            </div>

            <div className="upcoming-card" data-coming-soon={t.collections.comingSoon}>
              <div className="card-image">
                <img src="/src/assets/images/collections/neon-sovereigns.jpg" alt="Neon Sovereigns" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{t.collections.neonSovereigns}</h4>
                  <p>{language === 'fa' ? 'مجموعه‌ای آینده‌نگرانه از NFT‌های سایبرپانک با طراحی‌های نئون' : 'A futuristic collection of cyberpunk NFTs with neon designs'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Column 1 */}
            <div className="footer-column">
              <div className="footer-about glass-box">
                <h3>{t.footer.about.title}</h3>
                <p>
                  {language === 'fa' 
                    ? 'پیشگام در عرصه هنر دیجیتال و NFT در ایران، با هدف خلق آینده‌ای درخشان برای هنرمندان.' 
                    : 'Pioneering Digital Art and NFT in Iran, creating a bright future for artists.'}
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-discord"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-telegram"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="footer-column">
              <div className="footer-links glass-box">
                <h3>
                  <i className="fas fa-link link-icon"></i>
                  {t.footer.quickLinks.title}
                </h3>
                <ul>
                  <li>
                    <a href="/">
                      <i className="fas fa-home"></i>
                      <span>{t.footer.quickLinks.home}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/collections">
                      <i className="fas fa-images"></i>
                      <span>{t.footer.quickLinks.collections}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/marketplace">
                      <i className="fas fa-store"></i>
                      <span>{t.footer.quickLinks.marketplace}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/news">
                      <i className="fas fa-newspaper"></i>
                      <span>{t.footer.quickLinks.news}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div className="footer-column">
              <div className="footer-support glass-box">
                <h3>
                  <i className="fas fa-headset support-icon"></i>
                  {t.footer.support.title}
                </h3>
                <ul>
                  <li>
                    <a href="/faq">
                      <i className="fas fa-question-circle"></i>
                      <span>{t.footer.support.faq}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/terms">
                      <i className="fas fa-file-contract"></i>
                      <span>{t.footer.support.terms}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/privacy">
                      <i className="fas fa-shield-alt"></i>
                      <span>{t.footer.support.privacy}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/contact">
                      <i className="fas fa-envelope"></i>
                      <span>{t.footer.support.contact}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-copyright glass-box">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
