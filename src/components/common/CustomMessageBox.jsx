import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './CustomMessageBox.css';

const MessageType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

const CustomMessageBox = ({ message, type = MessageType.SUCCESS, onClose, autoClose = 5000, isVisible }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let closeTimer;
    let animationTimer;
    
    if (isVisible && autoClose) {
      closeTimer = setTimeout(() => {
        setIsClosing(true);
        
        animationTimer = setTimeout(() => {
          if (onClose && typeof onClose === 'function') {
            onClose();
          }
          setIsClosing(false);
        }, 300);
      }, autoClose);
    }
    
    return () => {
      if (closeTimer) clearTimeout(closeTimer);
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [isVisible, autoClose, onClose]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    
    setTimeout(() => {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      setIsClosing(false);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case MessageType.SUCCESS:
        return <FaCheckCircle className="message-icon success" />;
      case MessageType.ERROR:
        return <FaTimesCircle className="message-icon error" />;
      case MessageType.WARNING:
        return <FaExclamationTriangle className="message-icon warning" />;
      default:
        return <FaCheckCircle className="message-icon success" />;
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <div className={`message-overlay ${isClosing ? 'closing' : ''}`}>
      <div 
        className={`message-box ${type} ${isClosing ? 'closing' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="message-content">
          {getIcon()}
          <p>{message}</p>
        </div>
        <button 
          className="close-button" 
          onClick={handleClose} 
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </div>,
    document.body
  );
};

// صادر کردن کامپوننت و نوع پیام‌ها
export { MessageType };
export default CustomMessageBox; 