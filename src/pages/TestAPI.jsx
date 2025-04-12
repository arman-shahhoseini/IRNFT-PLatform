import React, { useState } from 'react';
import { testBitqueryConnection, getLatestOpenSeaTrades } from '../services/bitqueryService';
import './Marketplace.css';

function TestAPI() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [trades, setTrades] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testBitqueryConnection();
      setConnectionStatus(result);
    } catch (err) {
      setError(`خطا در اتصال به API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLatestOpenSeaTrades(5);
      setTrades(result);
    } catch (err) {
      setError(`خطا در دریافت معاملات: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const manualTest = async () => {
    setLoading(true);
    setError('');
    setConnectionStatus(null);
    try {
      const response = await fetch('https://graphql.bitquery.io', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'ory_at_N1WbvFD_YDIiny34F_N_iqiBKx38mMfWJEBoAG9zfOc.19eLVbQu5aQAt4gs_x01mbS1gWY5LPhjicXScT3qo_M'
        },
        body: JSON.stringify({
          query: `
            {
              EVM(dataset: combined, network: eth) {
                DEXTrades(
                  limit: {count: 1}
                ) {
                  count
                }
              }
            }
          `
        })
      });
      
      if (!response.ok) {
        throw new Error(`خطای HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      setConnectionStatus({
        success: true,
        data: data,
        status: response.status,
        headers: Object.fromEntries([...response.headers])
      });
    } catch (err) {
      setError(`خطا در تست دستی: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-api-container">
      <h1>صفحه تست API بیت‌کوئری</h1>
      <p className="info-text">
        این صفحه برای تست اتصال به API بیت‌کوئری و بررسی عملکرد صحیح سرویس‌های مرتبط با NFT طراحی شده است. 
        توجه: اکنون از داده‌های نمونه استفاده می‌شود زیرا بیت‌کوئری خطای 401 می‌دهد.
      </p>

      <div className="button-group">
        <button onClick={testConnection} disabled={loading} className="test-button">
          تست اتصال به API بیت‌کوئری
        </button>
        <button onClick={testTrades} disabled={loading} className="test-button">
          دریافت معاملات اخیر NFT
        </button>
        <button onClick={manualTest} disabled={loading} className="test-button">
          تست دستی با fetch
        </button>
      </div>

      {loading && <div className="loading">در حال بارگذاری...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {connectionStatus && (
        <div className="result-section">
          <h2>نتیجه تست اتصال</h2>
          <div className={`status ${connectionStatus.success ? 'success' : 'error'}`}>
            {connectionStatus.success ? 'اتصال موفقیت‌آمیز بود' : 'اتصال با خطا مواجه شد'}
          </div>
          <div className="result-data">
            <pre>{JSON.stringify(connectionStatus, null, 2)}</pre>
          </div>
        </div>
      )}

      {trades && (
        <div className="result-section">
          <h2>معاملات اخیر NFT</h2>
          <div className="trades-list">
            {trades.map((trade, index) => (
              <div key={index} className="trade-card">
                <img src={trade.image} alt={trade.name} className="trade-image" />
                <div className="trade-details">
                  <h3>{trade.name}</h3>
                  <p><strong>کالکشن:</strong> {trade.collectionName}</p>
                  <p><strong>قیمت:</strong> {trade.price} {trade.priceSymbol}</p>
                  <p><strong>تاریخ:</strong> {trade.blockTimestamp.toLocaleString('fa-IR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestAPI; 