import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';
import axios from 'axios';
import { FaSearch, FaFilter, FaEthereum, FaRegClock, FaHeart, FaRegHeart, FaList, FaArrowLeft, FaArrowRight, FaTrophy, FaFire } from 'react-icons/fa';
import { BiGridAlt } from 'react-icons/bi';
import './Marketplace.css';
import { getLatestOpenSeaTrades, getMostTradedNFTs, getNFTsByCollection } from '../services/bitqueryService';
import { toast } from 'react-toastify';

const Marketplace = () => {
  const { t } = useTranslation();
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // grid or list
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSorting, setActiveSorting] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  // Collections for filter
  const collections = [
    { id: 'all', name: 'همه کالکشن‌ها' },
    { id: 'popular', name: 'محبوب‌ترین‌ها' },
    { id: 'cryptopunks', name: 'کریپتو پانکس', address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB' },
    { id: 'bayc', name: 'Bored Ape Yacht Club', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' },
    { id: 'azuki', name: 'Azuki', address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544' },
    { id: 'doodles', name: 'Doodles', address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e' },
    { id: 'orangez', name: 'The Orangez', address: '0xcd76d0cf64bf4a58d898905c5adad5e1e838e0d3' }
  ];

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let nftData = [];
        
        if (selectedCollection === 'all') {
          // دریافت معاملات اخیر اپن‌سی
          nftData = await getLatestOpenSeaTrades(20);
        } else if (selectedCollection === 'popular') {
          // دریافت محبوب‌ترین NFT‌ها
          nftData = await getMostTradedNFTs(20);
        } else {
          // دریافت NFT‌های یک کالکشن خاص
          const collection = collections.find(c => c.id === selectedCollection);
          if (collection && collection.address) {
            nftData = await getNFTsByCollection(collection.address, 20);
          }
        }

        if (nftData.length === 0) {
          // اگر داده‌ای دریافت نشد، از داده‌های نمونه استفاده کنیم
          throw new Error('هیچ NFT‌ای یافت نشد.');
        }

        setNfts(nftData);
        setFilteredNfts(nftData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError('خطا در دریافت اطلاعات NFT‌ها. لطفاً دوباره تلاش کنید.');
        setLoading(false);
        
        // استفاده از داده‌های نمونه برای توسعه
        const mockNfts = Array(12).fill().map((_, index) => ({
          id: `mock-${index}`,
          name: `NFT شماره ${index + 1}`,
          description: 'یک توضیح نمونه برای این NFT. این NFT دارای ویژگی‌های منحصر به فرد است.',
          image: `https://picsum.photos/500/500?random=${index}`,
          tokenId: `${1000 + index}`,
          tokenAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
          price: Math.random() * 10 + 0.1,
          priceSymbol: 'ETH',
          sellerAddress: '0xe7f35f06a80a6a2a5edc823379fa147d9f9948a8',
          buyerAddress: '0xd7c708080553068217a2fe6f44eccf9cac309915',
          marketplaceAddress: '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b',
          transactionHash: '0x5eba5d8d84c20a7f30b92d74afaee764d9476b62a1637b017319c721269245ed',
          blockTimestamp: new Date(),
          attributes: [
            { trait_type: 'Background', value: ['Blue', 'Red', 'Green', 'Yellow'][Math.floor(Math.random() * 4)] },
            { trait_type: 'Eyes', value: ['Big', 'Small', 'Alien', 'Robot'][Math.floor(Math.random() * 4)] },
            { trait_type: 'Mouth', value: ['Smile', 'Frown', 'Open', 'Closed'][Math.floor(Math.random() * 4)] }
          ],
          collectionName: ['کریپتو پانکس', 'Bored Ape', 'Azuki', 'Doodles'][Math.floor(Math.random() * 4)]
        }));
        
        setNfts(mockNfts);
        setFilteredNfts(mockNfts);
      }
    };

    fetchNFTs();
  }, [selectedCollection]);

  useEffect(() => {
    // Apply filters, sorting, and search
    let filtered = [...nfts];
    
    // Apply price filter
    filtered = filtered.filter(nft => {
      // تبدیل قیمت به عدد در صورتی که رشته باشد
      const nftPrice = typeof nft.price === 'string' ? parseFloat(nft.price) : nft.price;
      return nftPrice >= priceRange[0] && nftPrice <= priceRange[1];
    });
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(nft => {
        // تبدیل قیمت به عدد در صورتی که رشته باشد
        const nftPrice = typeof nft.price === 'string' ? parseFloat(nft.price) : nft.price;
        
        if (activeFilter === 'expensive') {
          return nftPrice > 5; // NFTs priced over 5 ETH
        } else if (activeFilter === 'affordable') {
          return nftPrice <= 5; // NFTs priced under 5 ETH
        } else if (activeFilter === 'favorites') {
          return favorites.includes(nft.id);
        }
        return true;
      });
    }
    
    // Apply sorting
    if (activeSorting === 'latest') {
      filtered.sort((a, b) => new Date(b.blockTimestamp) - new Date(a.blockTimestamp));
    } else if (activeSorting === 'oldest') {
      filtered.sort((a, b) => new Date(a.blockTimestamp) - new Date(b.blockTimestamp));
    } else if (activeSorting === 'price_high_to_low') {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceB - priceA;
      });
    } else if (activeSorting === 'price_low_to_high') {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceA - priceB;
      });
    }
    
    setFilteredNfts(filtered);
  }, [nfts, searchTerm, activeFilter, activeSorting, priceRange, favorites]);

  const handleToggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      toast.info('از علاقه‌مندی‌ها حذف شد');
    } else {
      setFavorites([...favorites, id]);
      toast.success('به علاقه‌مندی‌ها اضافه شد');
    }
  };

  const handleViewNFT = (nft) => {
    setSelectedNFT(nft);
    toast.info(`مشاهده NFT: ${nft.name}`);
    // در اینجا می‌توانید منطق نمایش جزئیات NFT را اضافه کنید
    // مثلاً باز کردن یک مودال یا هدایت کاربر به صفحه جزئیات
  };

  const handleBuyNFT = (nft) => {
    toast.success(`درخواست خرید ${nft.name} با موفقیت ثبت شد.`);
    // در اینجا می‌توانید منطق خرید NFT را اضافه کنید
  };

  const formatDate = (date) => {
    // بررسی معتبر بودن شیء تاریخ
    if (!date || isNaN(new Date(date).getTime())) {
      return 'تاریخ نامشخص';
    }
    
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const handleRangeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (e.target.name === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="marketplace-page">
      <section className="marketplace-hero">
        <div className="marketplace-hero-content">
          <h1>{t('marketplace')}</h1>
          <p>کشف، خرید و فروش NFT‌های منحصر به فرد در بازار IRNFT</p>
        </div>
      </section>
      
      <div className="marketplace-container">
        <div className="marketplace-controls">
          <div className="marketplace-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="جستجوی NFT، کالکشن یا کاربر..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="marketplace-actions">
            <div className="view-options">
              <button 
                className={`view-option ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                aria-label="نمایش شبکه‌ای"
              >
                <BiGridAlt />
              </button>
              <button 
                className={`view-option ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                aria-label="نمایش لیستی"
              >
                <FaList />
              </button>
            </div>
            
            <button 
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="فیلترها"
            >
              <FaFilter />
              <span>فیلترها</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="marketplace-filters">
            <div className="filter-section">
              <h3>کالکشن‌ها</h3>
              <div className="collection-options">
                {collections.map(collection => (
                  <button
                    key={collection.id}
                    className={`collection-option ${selectedCollection === collection.id ? 'active' : ''}`}
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    {collection.id === 'popular' ? <FaTrophy style={{marginLeft: '5px'}} /> : null}
                    {collection.id === 'all' ? <FaFire style={{marginLeft: '5px'}} /> : null}
                    {collection.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-section">
              <h3>قیمت (ETH)</h3>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="number"
                    name="min"
                    placeholder="حداقل"
                    value={priceRange[0]}
                    onChange={handleRangeChange}
                    min="0"
                    max="1000"
                  />
                  <span>تا</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="حداکثر"
                    value={priceRange[1]}
                    onChange={handleRangeChange}
                    min="0"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="marketplace-filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            همه
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'expensive' ? 'active' : ''}`}
            onClick={() => setActiveFilter('expensive')}
          >
            گران‌ترین‌ها
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'affordable' ? 'active' : ''}`}
            onClick={() => setActiveFilter('affordable')}
          >
            ارزان‌ترین‌ها
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            علاقه‌مندی‌ها
          </button>
        </div>
        
        <div className="marketplace-sorting">
          <label>مرتب‌سازی:</label>
          <select 
            value={activeSorting}
            onChange={(e) => setActiveSorting(e.target.value)}
          >
            <option value="latest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="price_high_to_low">قیمت (نزولی)</option>
            <option value="price_low_to_high">قیمت (صعودی)</option>
          </select>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>در حال بارگذاری NFT‌ها...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>تلاش مجدد</button>
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="no-results">
            <p>هیچ NFT‌ای با این معیارها یافت نشد.</p>
          </div>
        ) : (
          <div className={`marketplace-nfts ${view === 'grid' ? 'grid-view' : 'list-view'}`}>
            {filteredNfts.map(nft => (
              <div className="nft-card" key={nft.id}>
                <div className="nft-image-container">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="nft-image"
                  />
                  <button
                    className={`favorite-button ${favorites.includes(nft.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(nft.id);
                    }}
                    aria-label={favorites.includes(nft.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                  >
                    {favorites.includes(nft.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="nft-details">
                  <div className="nft-collection">{nft.collectionName}</div>
                  <h3 className="nft-name">{nft.name}</h3>
                  <div className="nft-price">
                    <FaEthereum /> {typeof nft.price === 'string' ? parseFloat(nft.price) : nft.price ? nft.price.toFixed(3) : '0.000'} {nft.priceSymbol || 'ETH'}
                  </div>
                  <div className="nft-date">
                    <FaRegClock /> {formatDate(nft.blockTimestamp)}
                  </div>
                  {view === 'list' && (
                    <p className="nft-description">{nft.description}</p>
                  )}
                  {view === 'list' && nft.attributes && (
                    <div className="nft-attributes">
                      {nft.attributes.map((attr, index) => (
                        <div className="nft-attribute" key={index}>
                          {attr.trait_type}: {attr.value}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="nft-actions">
                    <button className="view-button" onClick={() => handleViewNFT(nft)}>مشاهده</button>
                    <button className="buy-button" onClick={() => handleBuyNFT(nft)}>خرید</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="marketplace-pagination">
          <button className="pagination-button disabled">
            <FaArrowRight /> قبلی
          </button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <button className="pagination-number">4</button>
            <button className="pagination-number">5</button>
          </div>
          <button className="pagination-button">
            بعدی <FaArrowLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 