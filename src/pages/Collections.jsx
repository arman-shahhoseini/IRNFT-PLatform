import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaGem, FaStar, FaTelegram, FaInfoCircle } from 'react-icons/fa';
import './Collections.css';

const Collections = () => {
  const { t } = useTranslation();

  // مجموعه NFT های سرنوشت‌ها و چهره‌ها
  const fatesFaces = {
    id: 'fates-faces',
    title: 'سرنوشت‌ها و چهره‌ها',
    description: 'مجموعه‌ای منحصر به فرد از 20 NFT با طراحی‌های خیره‌کننده و مفاهیم عمیق',
    banner: '/images/collections/fates-faces.jpg',
    totalItems: 20,
    legendaryItems: 10,
    rareItems: 10,
    nfts: Array.from({ length: 20 }, (_, i) => {
      const id = i + 1;
      const isLegendary = id > 10;
      
      return {
        id,
        name: `سرنوشت ${id}`,
        image: `/images/collections/NFT${id}.png`,
        type: isLegendary ? 'legendary' : 'rare',
      };
    })
  };

  // نمایش 4 NFT نمونه از هر دسته (کمیاب و افسانه‌ای)
  const sampleRareNFTs = fatesFaces.nfts.filter(nft => nft.type === 'rare').slice(0, 4);
  const sampleLegendaryNFTs = fatesFaces.nfts.filter(nft => nft.type === 'legendary').slice(0, 4);

  return (
    <div className="collections-page">
      <div className="collections-hero">
        <h1>کالکشن‌های NFT</h1>
        <p>مجموعه‌های ارزشمند و منحصر به فرد NFT با طراحی‌های خیره‌کننده</p>
      </div>

      <div className="collection-showcase">
        <div className="collection-header">
          <div className="collection-info">
            <h2>{fatesFaces.title}</h2>
            <p>{fatesFaces.description}</p>
            <div className="collection-stats">
              <div className="stat">
                <span className="stat-value">{fatesFaces.totalItems}</span>
                <span className="stat-label">NFT</span>
              </div>
              <div className="stat">
                <span className="stat-value">سطح 1-20</span>
                <span className="stat-label">سطح</span>
              </div>
              <div className="stat">
                <span className="stat-value">{fatesFaces.legendaryItems}</span>
                <span className="stat-label">افسانه‌ای</span>
              </div>
            </div>
            <Link to="/fates-faces" className="view-collection-btn">مشاهده کالکشن</Link>
          </div>
          <div className="collection-image">
            <img src={fatesFaces.banner} alt={fatesFaces.title} />
          </div>
        </div>

        <div className="telegram-promo-banner">
          <div className="promo-icon">
            <FaTelegram />
          </div>
          <div className="promo-content">
            <h3>کسب NFT از طریق ربات تلگرام</h3>
            <p>
              برای بدست آوردن این کالکشن باید داخل ربات تلگرامی IRNFT بازی کنید و سکه بدست بیاورید تا 
              بتوانید کالکشن‌های منحصر به فرد را دریافت کنید.
            </p>
            <a href="https://t.me/IRNFTMintBot" className="telegram-button" target="_blank" rel="noopener noreferrer">
              پیوستن به ربات <FaTelegram />
            </a>
          </div>
        </div>

        <div className="nft-showcase-section">
          <div className="section-header">
            <h3><FaStar /> NFT‌های کمیاب</h3>
            <div className="section-line"></div>
          </div>
          <div className="nft-showcase-grid">
            {sampleRareNFTs.map(nft => (
              <div key={nft.id} className="nft-card rare">
                <div className="nft-badge">
                  <FaStar /> کمیاب
                </div>
                <div className="nft-image-container">
                  <img src={nft.image} alt={nft.name} />
                  <div className="nft-overlay">
                    <Link to="/fates-faces" className="view-details-btn">
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
                <div className="nft-info">
                  <h4>{nft.name}</h4>
                  <div className="nft-level">
                    <span>سطح {nft.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nft-showcase-section legendary-section">
          <div className="section-header">
            <h3><FaGem /> NFT‌های افسانه‌ای</h3>
            <div className="section-line"></div>
          </div>
          <div className="nft-showcase-grid">
            {sampleLegendaryNFTs.map(nft => (
              <div key={nft.id} className="nft-card legendary">
                <div className="nft-badge">
                  <FaGem /> افسانه‌ای
                </div>
                <div className="nft-image-container">
                  <img src={nft.image} alt={nft.name} />
                  <div className="nft-overlay">
                    <Link to="/fates-faces" className="view-details-btn">
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
                <div className="nft-info">
                  <h4>{nft.name}</h4>
                  <div className="nft-level">
                    <span>سطح {nft.id - 5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="how-to-get-section">
          <div className="info-icon">
            <FaInfoCircle />
          </div>
          <div className="info-content">
            <h3>نحوه دریافت NFT‌های این کالکشن</h3>
            <p>
              برای دریافت NFT‌های کالکشن سرنوشت‌ها و چهره‌ها، باید از طریق ربات تلگرامی 
              <a href="https://t.me/IRNFTMintBot" target="_blank" rel="noopener noreferrer"> @IRNFTMintBot </a>
              اقدام کنید. در این ربات می‌توانید با انجام فعالیت‌ها و چالش‌های مختلف، سکه جمع‌آوری کرده 
              و سپس آن‌ها را برای دریافت NFT‌های کمیاب و افسانه‌ای استفاده کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections; 