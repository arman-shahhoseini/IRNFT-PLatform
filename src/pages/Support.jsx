import React from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className="support-page">
      <Navigation />
      <section className="support">
        <h1>{t('support')}</h1>
        <div className="support-content">
          <div className="faq-section">
            <h2>{t('frequently_asked_questions')}</h2>
            {/* FAQ items will be added here */}
          </div>
          <div className="contact-section">
            <h2>{t('contact_us')}</h2>
            {/* Contact form will be added here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support; 