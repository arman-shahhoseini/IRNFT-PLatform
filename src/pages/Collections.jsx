import React from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';

const Collections = () => {
  const { t } = useTranslation();

  return (
    <div className="collections-page">
      <Navigation />
      <section className="collections">
        <h1>{t('collections')}</h1>
        <div className="collections-grid">
          {/* Collection items will be added here */}
        </div>
      </section>
    </div>
  );
};

export default Collections; 