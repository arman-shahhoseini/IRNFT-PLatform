import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaHeartBroken, FaSearch, FaTimes, FaTh, FaStar, FaCrown, FaArrowRight, FaTrash, FaGem } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // استیت‌ها
  const [favorites, setFavorites] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // تابع بارگذاری علاقه‌مندی‌ها - اینجا به صورت یک تابع جدا تعریف می‌شود تا بتوانیم آن را مجدداً فراخوانی کنیم
  const loadFavorites = async () => {
    setLoading(true);
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites);
        console.log("علاقه‌مندی‌های خوانده شده از localStorage:", favoriteIds);
        setFavorites(favoriteIds);
        
        // اطمینان از سازگاری با داده‌های صفحه FatesFaces.jsx
        const mockNFTsData = Array.from({ length: 20 }, (_, i) => {
          const id = i + 1;
          const isLegend = id > 10;
          
          return {
            id: String(id), // همیشه به صورت رشته ذخیره می‌کنیم
            name: `سرنوشت ${id}`,
            image: `/images/collections/NFT${id}.png`, // مسیر باید با FatesFaces.jsx یکسان باشد
            rarity: isLegend ? 'Legend' : 'Rare',
            type: isLegend ? 'legend' : 'rare', // افزودن فیلد type برای سازگاری
            power: isLegend ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 40,
            speed: isLegend ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 40) + 20,
            magic: isLegend ? Math.floor(Math.random() * 25) + 75 : Math.floor(Math.random() * 25) + 30,
            defense: isLegend ? Math.floor(Math.random() * 35) + 65 : Math.floor(Math.random() * 35) + 25,
            description: isLegend 
              ? 'این یک NFT افسانه‌ای از مجموعه سرنوشت‌ها و چهره‌هاست که دارای ویژگی‌های منحصر به فردی است.'
              : 'این یک NFT کمیاب از مجموعه سرنوشت‌ها و چهره‌هاست که نشان‌دهنده یک شخصیت منحصر به فرد با ویژگی‌های خاص است.'
          };
        });
        
        // فیلتر کردن NFTهای موجود در علاقه‌مندی‌ها
        const userFavorites = mockNFTsData.filter(nft => {
          // همیشه مقایسه رشته‌ای انجام می‌دهیم
          return favoriteIds.some(id => String(id) === String(nft.id));
        });
        
        console.log("علاقه‌مندی‌ها بارگذاری شدند:", favoriteIds);
        console.log("NFTهای پیدا شده:", userFavorites.length, userFavorites);
        
        setNfts(userFavorites);
        setFilteredNfts(userFavorites);
      } catch (error) {
        console.error("خطا در بارگذاری علاقه‌مندی‌ها:", error);
        localStorage.removeItem('favorites'); // پاک کردن داده‌های ناسازگار
        setNfts([]);
        setFilteredNfts([]);
        // بازنشانی localStorage با آرایه خالی
        localStorage.setItem('favorites', JSON.stringify([]));
      }
    } else {
      console.log("هیچ علاقه‌مندی یافت نشد، در حال بازنشانی...");
      localStorage.setItem('favorites', JSON.stringify([]));
      setNfts([]);
      setFilteredNfts([]);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 800); // شبیه‌سازی زمان بارگذاری
  };
  
  // افزودن یک useEffect جدید برای بررسی تغییرات در localStorage
  useEffect(() => {
    // تابع برای بررسی تغییرات در localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'favorites') {
        console.log("تغییر در علاقه‌مندی‌ها تشخیص داده شد، در حال بروزرسانی...");
        loadFavorites();
      }
    };

    // تابع برای گوش دادن به رویداد سفارشی بروزرسانی علاقه‌مندی‌ها
    const handleFavoritesUpdated = () => {
      console.log("رویداد بروزرسانی علاقه‌مندی‌ها دریافت شد، در حال بارگذاری مجدد...");
      loadFavorites();
    };

    // اضافه کردن event listener برای تغییرات storage
    window.addEventListener('storage', handleStorageChange);
    // اضافه کردن event listener برای رویداد سفارشی
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    
    // همچنین هر 5 ثانیه یک بار علاقه‌مندی‌ها را بررسی می‌کنیم
    const checkInterval = setInterval(() => {
      const currentFavorites = localStorage.getItem('favorites');
      if (currentFavorites) {
        const currentIds = JSON.parse(currentFavorites);
        // فقط در صورتی که تغییری وجود داشته باشد، بارگذاری مجدد انجام می‌شود
        if (JSON.stringify(currentIds) !== JSON.stringify(favorites)) {
          console.log("تغییر در علاقه‌مندی‌ها تشخیص داده شد (بررسی دوره‌ای)، در حال بروزرسانی...");
          loadFavorites();
        }
      }
    }, 5000);
    
    // پاک کردن event listener ها و interval هنگام unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      clearInterval(checkInterval);
    };
  }, [favorites]); // وابستگی به favorites برای مقایسه صحیح
  
  // بارگذاری اولیه علاقه‌مندی‌ها
  useEffect(() => {
    loadFavorites();
  }, []);
  
  // فیلتر کردن بر اساس جستجو و تب فعال
  useEffect(() => {
    let filtered = [...nfts];
    
    // فیلتر بر اساس جستجو
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // فیلتر بر اساس تب انتخاب شده
    if (activeTab !== 'all') {
      const rarityFilter = activeTab === 'rare' ? 'Rare' : 'Legend';
      filtered = filtered.filter(nft => nft.rarity === rarityFilter);
    }
    
    setFilteredNfts(filtered);
  }, [searchTerm, activeTab, nfts]);
  
  // حذف از علاقه‌مندی‌ها
  const handleRemoveFavorite = (e, nftId) => {
    e.stopPropagation(); // جلوگیری از باز شدن مودال
    
    try {
      // تبدیل به رشته برای اطمینان از مقایسه صحیح
      const stringId = String(nftId);
      
      console.log(`تلاش برای حذف NFT با شناسه ${stringId}`);
      
      // حذف از استیت‌های محلی
      const updatedFavorites = favorites.filter(id => String(id) !== stringId);
      setFavorites(updatedFavorites);
      setNfts(nfts.filter(nft => String(nft.id) !== stringId));
      
      // ذخیره در localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      console.log("علاقه‌مندی‌های جدید پس از حذف:", updatedFavorites);
      
      // به‌روزرسانی NFTهای فیلتر شده
      setFilteredNfts(prevFiltered => prevFiltered.filter(nft => String(nft.id) !== stringId));
      
      // فراخوانی رویداد بروزرسانی علاقه‌مندی‌ها
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error("خطا در حذف از علاقه‌مندی‌ها:", error);
    }
  };
  
  // بازگشت به صفحه قبل
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="favorites-container">
      {/* هدر */}
      <div className="favorites-header">
        <div className="favorites-title">
          <button className="back-button" onClick={goBack}>
            <FaArrowRight />
          </button>
          <FaHeart className="favorites-icon" />
          <h1>علاقه‌مندی‌های من</h1>
        </div>
        <div className="favorites-stats">
          <span><FaGem className="nft-count-icon" /> {filteredNfts.length} NFT</span>
        </div>
      </div>
      
      {/* کنترل‌ها */}
      <div className="favorites-controls">
        {/* بخش جستجو */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="جستجو در علاقه‌مندی‌ها..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <FaTimes />
            </button>
          )}
        </div>
        <div className="favorites-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FaTh /> همه
          </button>
          <button 
            className={`tab-button ${activeTab === 'rare' ? 'active' : ''}`}
            onClick={() => setActiveTab('rare')}
          >
            <FaStar /> کمیاب
          </button>
          <button 
            className={`tab-button ${activeTab === 'legend' ? 'active' : ''}`}
            onClick={() => setActiveTab('legend')}
          >
            <FaCrown /> افسانه‌ای
          </button>
        </div>
      </div>
      
      {/* بخش اصلی محتوا */}
      <div className="favorites-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner-border"></div>
            <p>در حال بارگذاری...</p>
          </div>
        ) : filteredNfts.length > 0 ? (
          <div className="favorites-grid">
            {filteredNfts.map(nft => (
              <div 
                key={nft.id} 
                className={`favorite-card ${nft.rarity.toLowerCase()}`}
              >
                <button 
                  className="remove-favorite" 
                  onClick={(e) => handleRemoveFavorite(e, nft.id)}
                  aria-label="حذف از علاقه‌مندی‌ها"
                >
                  <FaHeartBroken />
                </button>
                <div className="favorite-image-container">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="favorite-image" 
                  />
                  <div className="favorite-badge">
                    {nft.rarity === 'Rare' ? 'کمیاب' : 'افسانه‌ای'}
                  </div>
                </div>
                <div className="favorite-info">
                  <h3 className="favorite-name">{nft.name}</h3>
                  <div className="nft-main-stat">
                    <span className="main-stat-icon">
                      {nft.rarity === 'Legend' ? <FaGem /> : <FaStar />}
                    </span>
                    <span className="main-stat-value">سطح {nft.rarity === 'Legend' ? nft.id - 5 : nft.id}</span>
                  </div>
                  
                  {/* نمایش ویژگی اصلی */}
                  <div className="favorite-attributes">
                    <div className="favorite-attribute">
                      <span className="attribute-label">قدرت</span>
                      <div className="attribute-bar">
                        <div 
                          className="attribute-fill" 
                          style={{width: `${nft.power}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <FaHeartBroken className="empty-icon" />
            <h2>هنوز NFT‌ای به علاقه‌مندی‌ها اضافه نکرده‌اید</h2>
            <p>برای اضافه کردن NFT به لیست علاقه‌مندی‌ها، از صفحه کالکشن‌ها بازدید کنید و روی آیکون قلب کلیک کنید.</p>
            <Link to="/fates-faces" className="browse-button">
              مشاهده کالکشن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 