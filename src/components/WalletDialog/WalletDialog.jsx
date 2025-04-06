import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaEthereum } from 'react-icons/fa';
import { SiWalletconnect, SiTrustpilot } from 'react-icons/si';
import './WalletDialog.css';

const WalletDialog = ({ isOpen, onClose, onWalletSelect }) => {
  if (!isOpen) return null;

  const handleWalletSelect = (walletType) => {
    onWalletSelect(walletType);
    onClose();
  };

  return createPortal(
    <div className="wallet-dialog-overlay" onClick={onClose}>
      <div className="wallet-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-dialog-header">
          <h3>انتخاب کیف پول</h3>
          <button className="close-wallet-dialog" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="wallet-options">
          <button 
            className="wallet-option" 
            onClick={() => handleWalletSelect('metamask')}
          >
            <div className="wallet-icon metamask">
              <FaEthereum />
            </div>
            <span>MetaMask</span>
          </button>
          <button 
            className="wallet-option" 
            onClick={() => handleWalletSelect('walletconnect')}
          >
            <div className="wallet-icon walletconnect">
              <SiWalletconnect />
            </div>
            <span>WalletConnect</span>
          </button>
          <button 
            className="wallet-option" 
            onClick={() => handleWalletSelect('trustwallet')}
          >
            <div className="wallet-icon trustwallet">
              <SiTrustpilot />
            </div>
            <span>Trust Wallet</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WalletDialog; 