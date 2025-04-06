import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Logo from '/images/logo/Logo.png';
import HeroVideo from '/images/hero/hero-bg.mp4';
import FatesFaces from '/images/collections/fates-faces.jpg';
import EclipseSyndicate from '/images/collections/eclipse-syndicate.jpg';
import NeonSovereigns from '/images/collections/neon-sovereigns.jpg';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const collectionsRef = useRef(null);

  const scrollToCollections = () => {
    collectionsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewCollection = () => {
    navigate('/fates-faces');
  };

  return (
    <div className="home-page">
      <section className="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src={HeroVideo} type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>{t('welcome_to_irnft')}</h1>
          <p>{t('discover_unique_nfts')}</p>
          <button className="cta-button" onClick={scrollToCollections}>{t('explore_collections')}</button>
          <div className="hero-features">
            <div className="hero-feature">
              <i className="fas fa-shield-alt"></i>
              <span>{t('high_security')}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-bolt"></i>
              <span>{t('fast_transactions')}</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-users"></i>
              <span>{t('active_community')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="collections" ref={collectionsRef}>
        <div className="collections-header">
          <h2>{t('featured_collections')}</h2>
          <div className="collections-line"></div>
        </div>
        
        <div className="collections-container">
          <div className="featured-collection">
            <div className="featured-content">
              <div className="featured-text">
                <div className="status-badge active">
                  <span className="status-dot"></span>
                  {t('active')}
                </div>
                <h3>{t('fates_and_faces')}</h3>
                <p>{t('a_unique_collection_of_20_nfts_with_stunning_designs_and_deep_concepts')}</p>
                <div className="collection-stats">
                  <div className="stat-item">
                    <i className="fas fa-cube"></i>
                    <span>20 NFT</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-star"></i>
                    <span>{t('level_1_20')}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-crown"></i>
                    <span>{t('10_legend')}</span>
                  </div>
                </div>
                <button className="view-collection" onClick={handleViewCollection}>
                  {t('view_collection')}
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
              <div className="featured-image">
                <img src={FatesFaces} alt="Fates & Faces" />
              </div>
            </div>
          </div>

          <div className="upcoming-collections">
            <div className="upcoming-card" data-coming-soon={t('coming_soon')}>
              <div className="card-image">
                <img src={EclipseSyndicate} alt="Eclipse Syndicate" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{t('eclipse_syndicate')}</h4>
                  <p>{t('a_mysterious_collection_of_shadow_nfts_with_unique_stories')}</p>
                </div>
              </div>
            </div>

            <div className="upcoming-card" data-coming-soon={t('coming_soon')}>
              <div className="card-image">
                <img src={NeonSovereigns} alt="Neon Sovereigns" />
              </div>
              <div className="card-overlay">
                <div className="card-content">
                  <h4>{t('neon_sovereigns')}</h4>
                  <p>{t('a_futuristic_collection_of_cyberpunk_nfts_with_neon_designs')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-about glass-box">
                <h3>{t('about_irnft')}</h3>
                <p>
                  {t('pioneering_digital_art_and_nft_in_iran_creating_a_bright_future_for_artists')}
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

            <div className="footer-column">
              <div className="footer-links glass-box">
                <h3>
                  <i className="fas fa-link link-icon"></i>
                  {t('quick_links')}
                </h3>
                <ul>
                  <li>
                    <a href="/">
                      <i className="fas fa-home"></i>
                      <span>{t('home')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/collections">
                      <i className="fas fa-images"></i>
                      <span>{t('collections')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/marketplace">
                      <i className="fas fa-store"></i>
                      <span>{t('marketplace')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/news">
                      <i className="fas fa-newspaper"></i>
                      <span>{t('news')}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-column">
              <div className="footer-support glass-box">
                <h3>
                  <i className="fas fa-headset support-icon"></i>
                  {t('support')}
                </h3>
                <ul>
                  <li>
                    <a href="/faq">
                      <i className="fas fa-question-circle"></i>
                      <span>{t('faq')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/terms">
                      <i className="fas fa-file-contract"></i>
                      <span>{t('terms_of_service')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/privacy">
                      <i className="fas fa-shield-alt"></i>
                      <span>{t('privacy_policy')}</span>
                    </a>
                  </li>
                  <li>
                    <a href="/contact">
                      <i className="fas fa-envelope"></i>
                      <span>{t('contact_us')}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-copyright glass-box">
            <p>{t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 