import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { toast } from '../utils/toast.jsx';
import { useTranslation } from 'react-i18next';

const WalletContext = createContext();

// Ethereum شبکه‌های مختلف
const NETWORKS = {
  MAINNET: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  POLYGON: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  BSC: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com']
  }
};

export const WalletProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  
  const currentUser = useRef(null);

  // بررسی کاربر لاگین شده
  const checkLoggedInUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        currentUser.current = JSON.parse(userStr);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking logged in user:', error);
      return false;
    }
  };

  // تابع تغییر شبکه
  const switchNetwork = async (networkName) => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      
      const network = NETWORKS[networkName];
      if (!network) throw new Error('Network configuration not found');
      
      try {
        // ابتدا سعی می‌کنیم به شبکه سوئیچ کنیم
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
        return true;
      } catch (switchError) {
        // اگر شبکه وجود نداشته باشد، آن را اضافه می‌کنیم
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
          return true;
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error('Error switching network:', error);
      const errorMsg = i18n.language === 'fa' 
        ? `خطا در تغییر شبکه: ${error.message}` 
        : `Error switching network: ${error.message}`;
      
      toast.error(errorMsg);
      return false;
    }
  };

  // تابع اتصال به ولت
  const connectWallet = async (walletType = 'metamask') => {
    try {
      // اگر در حال پردازش درخواست قبلی هستیم، از درخواست جدید جلوگیری می‌کنیم
      if (isProcessingRequest) {
        const errorMsg = 'در حال پردازش درخواست قبلی. لطفا صبر کنید.';
        toast.warning(errorMsg);
        return { success: false, error: errorMsg };
      }

      // اگر قبلا متصل شده، نیازی به اتصال مجدد نیست
      if (isConnected && walletAddress) {
        const infoMsg = 'کیف پول شما قبلا متصل شده است.';
        toast.info(infoMsg);
        return { 
          success: true, 
          data: { 
            address: walletAddress, 
            balance: walletBalance, 
            chainId: chainId 
          } 
        };
      }

      setIsLoading(true);
      setIsProcessingRequest(true);
      setError(null);

      // بر اساس نوع ولت، روش اتصال متفاوت است
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          const errorMsg = 'لطفاً متامسک را نصب کنید';
          
          setError(errorMsg);
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          // درخواست اتصال به ولت
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();
          
          setWalletAddress(address);
          setWalletBalance(ethers.utils.formatEther(balance));
          setChainId(network.chainId);
          setIsConnected(true);
          
          // ذخیره اطلاعات در localStorage برای کاربر فعلی
          const walletInfo = {
            address,
            balance: ethers.utils.formatEther(balance),
            chainId: network.chainId,
            timestamp: Date.now(),
            type: walletType
          };
          
          localStorage.setItem('walletConnected', JSON.stringify(walletInfo));

          const successMsg = 'کیف پول شما با موفقیت متصل شد';
          toast.success(successMsg);
          
          return { 
            success: true,
            data: { 
              address, 
              balance: ethers.utils.formatEther(balance),
              chainId: network.chainId 
            } 
          };
        } catch (providerError) {
          // خطای "Already processing eth_requestAccounts" رو مدیریت می‌کنیم
          if (providerError.message.includes('already processing eth_requestAccounts')) {
            const warningMsg = 'در حال پردازش درخواست اتصال. لطفا به پنجره متامسک مراجعه کنید.';
            toast.warning(warningMsg);
            return { success: false, error: warningMsg };
          }
          throw providerError;
        }
      } 
      else if (walletType === 'walletconnect' || walletType === 'trustwallet') {
        // اینجا پیاده سازی اتصال به WalletConnect یا Trust Wallet
        // برای نمونه و ساده‌سازی، فعلا یک پیام نمایش می‌دهیم
        const msg = `اتصال به ${walletType} در حال حاضر پشتیبانی نمی‌شود`;
        
        toast.info(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
      else {
        const errorMsg = 'نوع کیف پول نامعتبر است';
        
        toast.error(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      const errorMsg = `خطا در اتصال به کیف پول: ${error.message}`;
      
      setError(errorMsg);
      toast.error(errorMsg);
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setIsProcessingRequest(false);
    }
  };

  // تابع قطع اتصال از ولت
  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletBalance('');
    setChainId(null);
    setIsConnected(false);
    setError(null);
    
    // حذف اطلاعات ولت از localStorage
    localStorage.removeItem('walletConnected');

    const successMsg = i18n.language === 'fa' 
      ? 'ولت با موفقیت قطع ارتباط شد' 
      : 'Wallet disconnected successfully';
    
    toast.info(successMsg);
    
    return { success: true };
  };

  // تابع بررسی اتصال ولت
  const checkWalletConnection = async () => {
    try {
      // بررسی اینکه کاربر لاگین است یا نه
      const isLoggedIn = checkLoggedInUser();
      if (!isLoggedIn) {
        return false;
      }
      
      if (!window.ethereum) {
        return false;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      // بررسی اطلاعات ذخیره شده در localStorage
      const savedWallet = JSON.parse(localStorage.getItem('walletConnected') || 'null');
      
      // اگر اکانتی وجود داشته باشد و اطلاعات در localStorage موجود باشد و متعلق به کاربر فعلی باشد
      if (accounts.length > 0 && savedWallet && 
          savedWallet.address === accounts[0] && 
          savedWallet.userId === currentUser.current?.uid) {
        
        const balance = await provider.getBalance(accounts[0]);
        const network = await provider.getNetwork();
        
        setWalletAddress(accounts[0]);
        setWalletBalance(ethers.utils.formatEther(balance));
        setChainId(network.chainId);
        setIsConnected(true);
        
        // بروزرسانی اطلاعات در localStorage
        localStorage.setItem('walletConnected', JSON.stringify({
          address: accounts[0],
          balance: ethers.utils.formatEther(balance),
          chainId: network.chainId,
          timestamp: Date.now(),
          userId: currentUser.current?.uid
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  };

  // تابع ارسال تراکنش
  const sendTransaction = async (to, amount) => {
    try {
      if (!isConnected) {
        const msg = i18n.language === 'fa' 
          ? 'لطفاً ابتدا ولت خود را متصل کنید' 
          : 'Please connect your wallet first';
        
        toast.warning(msg);
      }

      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // تبدیل مقدار به اتر
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // بررسی موجودی کافی
      const balance = await provider.getBalance(walletAddress);
      if (balance.lt(amountInWei)) {
        const errorMsg = i18n.language === 'fa' 
          ? 'موجودی ناکافی برای انجام تراکنش' 
          : 'Insufficient balance for this transaction';
        
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // ارسال تراکنش
      const tx = await signer.sendTransaction({
        to,
        value: amountInWei
      });
      
      // انتظار برای تایید تراکنش
      await tx.wait();
      
      // بروزرسانی موجودی
      const newBalance = await provider.getBalance(walletAddress);
      setWalletBalance(ethers.utils.formatEther(newBalance));
      
      const successMsg = i18n.language === 'fa' 
        ? 'تراکنش با موفقیت انجام شد' 
        : 'Transaction completed successfully';
      
      toast.success(successMsg);
      
      return { 
        success: true, 
        data: { 
          txHash: tx.hash,
          amount,
          to
        } 
      };
    } catch (error) {
      console.error('Transaction error:', error);
      
      let errorMsg = i18n.language === 'fa' 
        ? 'خطا در انجام تراکنش' 
        : 'Transaction error';
      
      if (error.code === 4001) {
        errorMsg = i18n.language === 'fa' 
          ? 'تراکنش توسط کاربر لغو شد' 
          : 'Transaction cancelled by user';
      }
      
      toast.error(errorMsg);
      
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // استفاده از useEffect برای بررسی اتصال ولت در هنگام بارگذاری صفحه
  useEffect(() => {
    const checkConnection = async () => {
      // بررسی اینکه کاربر لاگین است یا نه
      const isLoggedIn = checkLoggedInUser();
      if (!isLoggedIn) {
        return;
      }
      
      const isConnected = await checkWalletConnection();
      
      // اگر متامسک در دسترس باشد، به تغییرات اکانت و شبکه گوش دهید
      if (window.ethereum) {
        // گوش دادن به تغییر اکانت
        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
            const msg = i18n.language === 'fa' 
              ? 'ولت قطع ارتباط شد' 
              : 'Wallet disconnected';
            
            toast.info(msg);
          } else {
            await checkWalletConnection();
          }
        });
        
        // گوش دادن به تغییر شبکه
        window.ethereum.on('chainChanged', async () => {
          await checkWalletConnection();
        });
      }
    };

    checkConnection();
    
    // پاکسازی event listener ها
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [i18n]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletBalance,
        isConnected,
        isLoading,
        error,
        chainId,
        connectWallet,
        disconnectWallet,
        checkWalletConnection,
        sendTransaction,
        switchNetwork,
        isProcessingRequest,
        address: walletAddress
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 