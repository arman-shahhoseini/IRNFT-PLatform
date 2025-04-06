import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaTelegram, FaGem, FaStar, FaFilter, FaTimes, FaAngleLeft, FaBolt, FaMedal, FaFire, FaMagic, FaShieldAlt, FaInfoCircle, FaTrophy, FaHeart } from 'react-icons/fa';
import { IoIosFlash } from 'react-icons/io';
import './FatesFaces.css';

const FatesFaces = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // اسکرول به بالای صفحه هنگام لود شدن
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // بارگذاری لیست علاقه‌مندی‌ها از localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        
        // اطمینان از اینکه داده‌های بارگذاری شده یک آرایه است
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
          console.log("علاقه‌مندی‌ها با موفقیت بارگذاری شد:", parsedFavorites);
        } else {
          console.warn("داده‌های علاقه‌مندی‌ها در فرمت نامعتبر ذخیره شده‌اند. بازنشانی به آرایه خالی.");
          setFavorites([]);
          // بازنشانی localStorage
          localStorage.setItem('favorites', JSON.stringify([]));
        }
      } else {
        // اگر هیچ داده‌ای وجود نداشت، یک آرایه خالی ایجاد می‌کنیم
        localStorage.setItem('favorites', JSON.stringify([]));
      }
    } catch (error) {
      console.error("خطا در بارگذاری علاقه‌مندی‌ها:", error);
      // در صورت بروز خطا، آرایه خالی قرار می‌دهیم
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  }, []);

  // دیتای NFT ها
  const nfts = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const isLegend = id > 10;
    
    // امتیازات تصادفی برای هر NFT
    const power = isLegend ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 40;
    const speed = isLegend ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40) + 20;
    const magic = isLegend ? Math.floor(Math.random() * 25) + 75 : Math.floor(Math.random() * 25) + 30;
    const defense = isLegend ? Math.floor(Math.random() * 35) + 65 : Math.floor(Math.random() * 35) + 25;
    
    // رنگ‌های منحصر به فرد برای هر NFT
    const colors = [
      'آبی', 'قرمز', 'سبز', 'بنفش', 'طلایی', 
      'نقره‌ای', 'مشکی', 'سفید', 'نارنجی', 'صورتی'
    ];
    
    // عنصرهای مختلف برای هر NFT
    const elements = [
      'آتش', 'آب', 'باد', 'خاک', 'برق',
      'یخ', 'نور', 'تاریکی', 'طبیعت', 'فلز'
    ];
    
    return {
      id,
      name: `سرنوشت ${id}`,
      image: `/images/collections/NFT${id}.png`, 
      type: isLegend ? 'legend' : 'rare',
      description: isLegend 
        ? 'این یک NFT افسانه‌ای از مجموعه سرنوشت‌ها و چهره‌هاست که دارای ویژگی‌های منحصر به فردی است. این NFT به دلیل کمیاب بودن و طراحی خاص آن، از ارزش بالایی برخوردار است.'
        : 'این یک NFT کمیاب از مجموعه سرنوشت‌ها و چهره‌هاست که نشان‌دهنده یک شخصیت منحصر به فرد با ویژگی‌های خاص است. این NFT دارای المان‌های هنری برجسته‌ای است که آن را از سایر NFT‌ها متمایز می‌کند.',
      attributes: [
        { name: 'کمیابی', value: isLegend ? 'افسانه‌ای' : 'کمیاب' },
        { name: 'سطح', value: isLegend ? id - 5 : id },
        { name: 'قدرت', value: power },
        { name: 'سرعت', value: speed },
        { name: 'جادو', value: magic },
        { name: 'دفاع', value: defense },
        { name: 'رنگ', value: colors[id % colors.length] },
        { name: 'عنصر', value: elements[id % elements.length] },
      ]
    };
  });

  // فیلتر NFT ها بر اساس نوع انتخاب شده
  const filteredNFTs = activeTab === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.type === activeTab);

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedNFT(null), 300);
  };
  
  // تابع برای افزودن/حذف از علاقه‌مندی‌ها
  const toggleFavorite = (e, nftId) => {
    e.stopPropagation(); // از کلیک روی کارت و باز شدن مودال جلوگیری می‌کند
    
    try {
      // ابتدا آخرین مقدار علاقه‌مندی‌ها را از localStorage دریافت می‌کنیم
      const savedFavorites = localStorage.getItem('favorites');
      let currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      // اطمینان از اینکه currentFavorites یک آرایه است
      if (!Array.isArray(currentFavorites)) {
        currentFavorites = [];
      }
      
      // تبدیل nftId به رشته برای اطمینان از یکسان‌سازی نوع داده
      const stringId = String(nftId);
      
      let newFavorites;
      // بررسی وجود آیتم در علاقه‌مندی‌ها
      if (currentFavorites.includes(stringId) || currentFavorites.includes(nftId)) {
        // حذف از علاقه‌مندی‌ها - هر دو نوع عددی و رشته‌ای را حذف می‌کنیم
        newFavorites = currentFavorites.filter(id => id !== nftId && id !== stringId);
        console.log(`NFT با شناسه ${stringId} از علاقه‌مندی‌ها حذف شد`);
      } else {
        // افزودن به علاقه‌مندی‌ها - همیشه به صورت رشته ذخیره می‌کنیم
        newFavorites = [...currentFavorites, stringId];
        console.log(`NFT با شناسه ${stringId} به علاقه‌مندی‌ها اضافه شد`);
      }
      
      // ذخیره در localStorage و بروزرسانی استیت
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      
      // برای اشکال‌زدایی - نمایش داده در کنسول
      console.log("لیست جدید علاقه‌مندی‌ها:", newFavorites);
      // فراخوانی یک رویداد ساختگی برای اطلاع‌رسانی به سایر صفحات
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error("خطا در بروزرسانی علاقه‌مندی‌ها:", error);
    }
  };
  
  // بررسی می‌کند آیا NFT در لیست علاقه‌مندی‌ها است یا خیر
  const isFavorite = (nftId) => {
    try {
      // ابتدا از localStorage بررسی می‌کنیم
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        if (Array.isArray(favoriteIds)) {
          return favoriteIds.includes(nftId) || favoriteIds.includes(String(nftId));
        }
      }
      
      // اگر از localStorage نتوانستیم بخوانیم، از استیت استفاده می‌کنیم
      return favorites.includes(nftId) || favorites.includes(String(nftId));
    } catch (error) {
      console.error("خطا در بررسی وضعیت علاقه‌مندی:", error);
      return false;
    }
  };

  // اضافه کردن کلاس به بدنه برای حالت مدال
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // تابع برای نمایش درصد قدرت هر ویژگی
  const getAttributePercentage = (value) => {
    if (typeof value !== 'number') return null;
    return Math.min(100, value);
  };

  // تابع برای تعیین رنگ نوار پیشرفت بر اساس نوع NFT
  const getProgressColor = (nft, value) => {
    if (nft.type === 'legend') {
      return value > 70 ? 'var(--legend-high)' : 'var(--legend-medium)';
    } else {
      return value > 50 ? 'var(--rare-high)' : 'var(--rare-medium)';
    }
  };

  // تابع برای نمایش آیکون مناسب برای هر ویژگی
  const getAttributeIcon = (attributeName) => {
    switch(attributeName.toLowerCase()) {
      case 'قدرت':
        return <FaFire />;
      case 'سرعت':
        return <FaBolt />;
      case 'جادو':
        return <FaMagic />;
      case 'دفاع':
        return <FaShieldAlt />;
      case 'کمیابی':
        return <FaTrophy />;
      case 'جان':
        return <FaHeart />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className="fates-faces-container">
      {/* هدر */}
      <div className="collection-header">
        <h1>کالکشن سرنوشت‌ها و چهره‌ها</h1>
        <div className="header-actions">
          <button className="favorites-button" onClick={() => navigate('/favorites')}>
            <FaHeart /> علاقه‌مندی‌ها
          </button>
          <button className="back-button" onClick={() => navigate('/')}>
            بازگشت به خانه <FaArrowRight />
          </button>
        </div>
      </div>

      {/* بنر کالکشن */}
      <div className="collection-banner">
        <div className="banner-content">
          <div className="banner-info">
            <div className="banner-badge">
              <span className="status-dot"></span>
              فعال
            </div>
            <h2>سرنوشت‌ها و چهره‌ها</h2>
            <p>
              این کالکشن شامل ۲۰ NFT منحصر به فرد است که شخصیت‌های افسانه‌ای را با طراحی‌های خیره‌کننده به تصویر کشیده است. هر NFT دارای ویژگی‌های منحصر به فردی است که آن را از سایرین متمایز می‌کند.
            </p>
            <div className="collection-stats">
              <div className="stat-item">
                <span className="stat-value">20</span>
                <span className="stat-label">تعداد آیتم‌ها</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10</span>
                <span className="stat-label">کمیاب</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10</span>
                <span className="stat-label">افسانه‌ای</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">محدود</span>
                <span className="stat-label">دسترسی</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* پروموی تلگرام */}
      <div className="telegram-promo">
        <div className="promo-icon">
          <FaTelegram />
        </div>
        <div className="promo-content">
          <h3>کسب NFT از طریق ربات تلگرام</h3>
          <p>
            برای دریافت NFT‌های این کالکشن، با ربات تلگرامی IRNFT ارتباط برقرار کنید و با انجام فعالیت‌ها و ماموریت‌ها، سکه جمع‌آوری کرده و NFT‌های کمیاب و افسانه‌ای را دریافت کنید.
          </p>
          <a href="https://t.me/IRNFTMintBot" className="telegram-button" target="_blank" rel="noopener noreferrer">
            <FaTelegram /> پیوستن به ربات
          </a>
        </div>
      </div>

      {/* تب‌های فیلتر */}
      <div className="collection-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <FaFilter className="tab-icon" /> همه NFT‌ها
        </button>
        <button 
          className={`tab-button ${activeTab === 'rare' ? 'active' : ''}`}
          onClick={() => setActiveTab('rare')}
        >
          <FaStar className="tab-icon" /> NFT‌های کمیاب
        </button>
        <button 
          className={`tab-button ${activeTab === 'legend' ? 'active' : ''}`}
          onClick={() => setActiveTab('legend')}
        >
          <FaGem className="tab-icon" /> NFT‌های افسانه‌ای
        </button>
      </div>

      {/* بخش راهنمای کلیک */}
      <div className="collection-help">
        <FaInfoCircle className="help-icon" />
        <span>برای مشاهده جزئیات بیشتر درباره هر NFT، روی آن کلیک کنید</span>
      </div>

      {/* گرید NFT‌ها */}
      <div className="nft-grid">
        {filteredNFTs.map((nft) => (
          <div 
            key={nft.id} 
            className={`nft-card ${nft.type}`}
            onClick={() => handleNFTClick(nft)}
          >
            <div className={`nft-badge ${nft.type}`}>
              {nft.type === 'legend' ? (
                <>
                  <FaGem /> افسانه‌ای
                </>
              ) : (
                <>
                  <FaStar /> کمیاب
                </>
              )}
            </div>
            <button
              className={`favorite-btn ${isFavorite(nft.id) ? 'active' : ''}`}
              onClick={(e) => toggleFavorite(e, nft.id)}
              aria-label={isFavorite(nft.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            >
              <FaHeart />
            </button>
            <div className="nft-image-container">
              <img src={nft.image} alt={nft.name} className="nft-image" />
              <div className="nft-overlay">
                <div className="nft-view">مشاهده جزئیات</div>
              </div>
            </div>
            <div className="nft-info">
              <h3 className="nft-name">{nft.name}</h3>
              <div className="nft-main-stat">
                <span className="main-stat-icon">
                  {nft.type === 'legend' ? <FaGem /> : <FaStar />}
                </span>
                <span className="main-stat-value">سطح {nft.attributes[1].value}</span>
              </div>
              
              {/* نمایش ویژگی اصلی */}
              <div className="nft-primary-stat">
                <div className="stat-row">
                  <span className="stat-icon"><FaBolt /></span>
                  <div className="stat-bar-container">
                    <div className="stat-bar" style={{ 
                        width: `${getAttributePercentage(nft.attributes[2].value)}%`,
                        backgroundColor: getProgressColor(nft, nft.attributes[2].value)
                    }}></div>
                  </div>
                  <span className="stat-value-display">{nft.attributes[2].value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* بخش اطلاعات */}
      <div className="collection-info-section">
        <div className="info-card">
          <div className="info-icon">
            <IoIosFlash />
          </div>
          <div className="info-content">
            <h3>نحوه دریافت NFT‌های این کالکشن</h3>
            <p>
              برای دریافت NFT‌های کالکشن سرنوشت‌ها و چهره‌ها، باید از طریق ربات تلگرامی IRNFT اقدام کنید. در این ربات می‌توانید با انجام فعالیت‌ها و چالش‌های مختلف، سکه جمع‌آوری کرده و سپس آن‌ها را برای دریافت NFT‌های کمیاب و افسانه‌ای استفاده کنید.
            </p>
            <p>
              هر چه فعالیت بیشتری در ربات انجام دهید، شانس بیشتری برای دریافت NFT‌های باارزش‌تر خواهید داشت. همچنین، با دعوت از دوستان خود به ربات، می‌توانید سکه‌های بیشتری دریافت کرده و سریع‌تر به NFT‌های موردنظر خود دست یابید.
            </p>
          </div>
        </div>
      </div>

      {/* مدال */}
      {showModal && selectedNFT && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`nft-modal ${selectedNFT.type}`} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              <FaTimes />
            </button>
            <button
              className={`modal-favorite-btn ${isFavorite(selectedNFT.id) ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(e, selectedNFT.id);
              }}
              aria-label={isFavorite(selectedNFT.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            >
              <FaHeart />
            </button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedNFT.image} alt={selectedNFT.name} />
                <div className={`modal-badge ${selectedNFT.type}`}>
                  {selectedNFT.type === 'legend' ? (
                    <>
                      <FaGem /> افسانه‌ای
                    </>
                  ) : (
                    <>
                      <FaStar /> کمیاب
                    </>
                  )}
                </div>
              </div>
              <div className="modal-details">
                <h2>{selectedNFT.name}</h2>
                <div className="modal-description">{selectedNFT.description.split('.')[0]}.</div>
                
                <div className="modal-attributes">
                  <h3>ویژگی‌ها</h3>
                  <div className="attributes-grid">
                    {selectedNFT.attributes.slice(0, 2).map((attr, index) => (
                      <div className="attribute-item" key={index}>
                        <span className="attribute-item-name">
                          {getAttributeIcon(attr.name)}
                          {attr.name}
                        </span>
                        <span className="attribute-item-value">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FatesFaces; 