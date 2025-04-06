import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { FaArrowLeft, FaWallet, FaExchangeAlt, FaHistory, FaQrcode, FaCopy, FaEthereum } from 'react-icons/fa';
import { toast } from '../utils/toast';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    note: ''
  });
  
  // نمونه داده تراکنش‌ها (در پروژه واقعی از API دریافت می‌شوند)
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: '0.5 ETH',
      from: '0xa1b2...c3d4',
      to: address,
      date: '۱۴۰۳/۰۱/۱۰',
      time: '۱۵:۲۰',
      status: 'completed',
      hash: '0x1a2b3c4d5e6f...'
    },
    {
      id: 2,
      type: 'withdraw',
      amount: '0.25 ETH',
      from: address,
      to: '0xe5f6...g7h8',
      date: '۱۴۰۳/۰۱/۰۵',
      time: '۱۱:۳۰',
      status: 'completed',
      hash: '0x9a8b7c6d5e4f...'
    },
    {
      id: 3,
      type: 'deposit',
      amount: '0.75 ETH',
      from: '0xi9j8...k7l6',
      to: address,
      date: '۱۴۰۲/۱۲/۲۸',
      time: '۱۸:۴۵',
      status: 'completed',
      hash: '0x3m2n1o0p9q8r...'
    }
  ];
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  const handleConnect = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };
  
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('آدرس کیف پول کپی شد');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSendForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSendSubmit = (e) => {
    e.preventDefault();
    
    // در پروژه واقعی این بخش به API متصل می‌شود
    toast.info('در حال حاضر امکان ارسال تراکنش در محیط آزمایشی وجود ندارد');
    setShowSendForm(false);
    setSendForm({
      recipient: '',
      amount: '',
      note: ''
    });
  };
  
  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
          <span>بازگشت به داشبورد</span>
        </button>
        <h1>کیف پول</h1>
      </div>
      
      {isConnected && address ? (
        <div className="wallet-content">
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-icon">
                <FaWallet />
              </div>
              <div className="wallet-actions">
                <button className="action-button disconnect" onClick={handleConnect}>
                  قطع اتصال کیف پول
                </button>
              </div>
            </div>
            
            <div className="wallet-balance">
              <div className="balance-label">موجودی کیف پول</div>
              <div className="balance-amount">
                <FaEthereum />
                <span>{balance || '0'} ETH</span>
              </div>
              <div className="balance-usd">~ $0.00 USD</div>
            </div>
            
            <div className="wallet-address">
              <div className="address-label">آدرس کیف پول</div>
              <div className="address-value">
                {address}
                <button className="copy-button" onClick={handleCopyAddress}>
                  <FaCopy />
                </button>
              </div>
            </div>
            
            <div className="wallet-actions-row">
              <button 
                className="wallet-action-button send"
                onClick={() => setShowSendForm(!showSendForm)}
              >
                <FaExchangeAlt />
                <span>ارسال</span>
              </button>
              <button className="wallet-action-button receive">
                <FaQrcode />
                <span>دریافت</span>
              </button>
              <button 
                className="wallet-action-button history"
                onClick={() => navigate('/activity')}
              >
                <FaHistory />
                <span>تاریخچه</span>
              </button>
            </div>
            
            {showSendForm && (
              <form className="send-form" onSubmit={handleSendSubmit}>
                <h3>ارسال تراکنش</h3>
                
                <div className="form-group">
                  <label>آدرس گیرنده</label>
                  <input
                    type="text"
                    name="recipient"
                    value={sendForm.recipient}
                    onChange={handleInputChange}
                    placeholder="آدرس کیف پول گیرنده را وارد کنید"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>مقدار (ETH)</label>
                  <input
                    type="number"
                    name="amount"
                    value={sendForm.amount}
                    onChange={handleInputChange}
                    placeholder="مقدار را وارد کنید"
                    min="0.00001"
                    step="0.00001"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>یادداشت (اختیاری)</label>
                  <input
                    type="text"
                    name="note"
                    value={sendForm.note}
                    onChange={handleInputChange}
                    placeholder="یادداشت خود را وارد کنید (اختیاری)"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">ارسال تراکنش</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowSendForm(false)}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="transactions-section">
            <h2>تراکنش‌های اخیر</h2>
            <div className="transactions-list">
              {transactions.length > 0 ? (
                transactions.map(tx => (
                  <div key={tx.id} className={`transaction-item ${tx.type}`}>
                    <div className="transaction-icon">
                      <FaExchangeAlt />
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-main">
                        <h3 className="transaction-type">
                          {tx.type === 'deposit' ? 'دریافت' : 'ارسال'}
                        </h3>
                        <div className="transaction-amount">
                          {tx.type === 'deposit' ? '+' : '-'} {tx.amount}
                        </div>
                      </div>
                      <div className="transaction-addresses">
                        <div className="transaction-address">
                          <span className="address-label">از:</span>
                          <span className="address-value">{tx.from}</span>
                        </div>
                        <div className="transaction-address">
                          <span className="address-label">به:</span>
                          <span className="address-value">{tx.to}</span>
                        </div>
                      </div>
                      <div className="transaction-meta">
                        <span className="transaction-date">{tx.date} - {tx.time}</span>
                        <span className="transaction-hash">#{tx.hash.substring(0, 15)}...</span>
                      </div>
                    </div>
                    <div className="transaction-status">
                      <div className={`status-badge ${tx.status}`}>
                        {tx.status === 'completed' ? 'تکمیل شده' : 'در حال پردازش'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-transactions">
                  <div className="empty-icon">
                    <FaHistory />
                  </div>
                  <p>هیچ تراکنشی یافت نشد.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="wallet-connect">
          <div className="wallet-connect-card">
            <div className="wallet-connect-icon">
              <FaWallet />
            </div>
            <h2>کیف پول متصل نشده است</h2>
            <p>برای مشاهده موجودی و انجام تراکنش، کیف پول خود را متصل کنید.</p>
            <button className="connect-button" onClick={handleConnect}>
              اتصال کیف پول
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet; 