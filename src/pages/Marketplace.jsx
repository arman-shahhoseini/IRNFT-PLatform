import React from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';

const Marketplace = () => {
  const { t } = useTranslation();

  return (
    <div className="marketplace-page">
      <Navigation />
      <section className="marketplace">
        <h1>{t('marketplace')}</h1>
        <div className="marketplace-grid">
          {/* NFT items will be added here */}
        </div>
      </section>
    </div>
  );
};

export default Marketplace; 