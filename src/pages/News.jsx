import React from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';

const News = () => {
  const { t } = useTranslation();

  return (
    <div className="news-page">
      <Navigation />
      <section className="news">
        <h1>{t('news')}</h1>
        <div className="news-grid">
          {/* News items will be added here */}
        </div>
      </section>
    </div>
  );
};

export default News; 