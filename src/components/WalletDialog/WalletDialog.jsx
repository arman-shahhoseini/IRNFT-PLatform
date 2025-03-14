import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faTimes, 
  faExternalLinkAlt 
} from '@fortawesome/free-solid-svg-icons';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const DialogContent = styled.div`
  background: rgba(18, 18, 18, 0.95);
  border: 1px solid rgba(0, 255, 163, 0.2);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '20px')});
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 255, 163, 0.1);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const DialogTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: #00ff9d;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const WalletList = styled.div`
  display: grid;
  gap: 1rem;
`;

const WalletButton = styled.button`
  width: 100%;
  background: rgba(0, 255, 163, 0.1);
  border: 1px solid rgba(0, 255, 163, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: rgba(0, 255, 163, 0.15);
    border-color: rgba(0, 255, 163, 0.3);
    transform: translateY(-2px);
  }

  .wallet-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .wallet-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .wallet-name {
    font-weight: 500;
  }

  .external-icon {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const WalletDialog = ({ isOpen, onClose }) => {
  const wallets = [
    {
      name: 'MetaMask',
      icon: '/assets/images/metamask.png'
    },
    {
      name: 'WalletConnect',
      icon: '/assets/images/walletconnect.png'
    },
    {
      name: 'Trust Wallet',
      icon: '/assets/images/trustwallet.png'
    }
  ];

  return (
    <DialogOverlay isOpen={isOpen} onClick={onClose}>
      <DialogContent 
        isOpen={isOpen} 
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>
            <FontAwesomeIcon icon={faWallet} />
            اتصال کیف پول
          </DialogTitle>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </DialogHeader>

        <WalletList>
          {wallets.map((wallet) => (
            <WalletButton key={wallet.name}>
              <div className="wallet-info">
                <img 
                  src={wallet.icon} 
                  alt={wallet.name} 
                  className="wallet-icon" 
                />
                <span className="wallet-name">{wallet.name}</span>
              </div>
              <FontAwesomeIcon 
                icon={faExternalLinkAlt} 
                className="external-icon" 
              />
            </WalletButton>
          ))}
        </WalletList>
      </DialogContent>
    </DialogOverlay>
  );
};

export default WalletDialog; 