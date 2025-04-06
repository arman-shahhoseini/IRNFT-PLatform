import { ethers } from 'ethers';
import Swal from 'sweetalert2';

// تنظیم استایل سفارشی برای SweetAlert2 طبق تم سایت
const swalCustomStyle = {
  background: '#1a1a2e',
  color: '#ffffff',
  confirmButtonColor: '#00ff9d',
  cancelButtonColor: '#1a1a2e'
};

const SUPPORTED_NETWORKS = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR-PROJECT-ID'],
    blockExplorerUrls: ['https://etherscan.io/']
  },
  137: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  56: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/']
  }
};

export const connectWallet = async (targetChainId = 1) => {
  try {
    if (!window.ethereum) {
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'لطفاً MetaMask را نصب کنید',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
      throw new Error('لطفاً MetaMask را نصب کنید');
    }

    // درخواست تغییر شبکه به شبکه مورد نظر
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError) {
      // اگر شبکه وجود نداشت، آن را اضافه می‌کنیم
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SUPPORTED_NETWORKS[targetChainId]]
          });
        } catch (addError) {
          Swal.fire({
            icon: 'error',
            title: 'خطا!',
            text: 'خطا در اضافه کردن شبکه',
            confirmButtonText: 'تایید',
            rtl: true,
            ...swalCustomStyle
          });
          throw new Error('خطا در اضافه کردن شبکه');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطا!',
          text: 'خطا در تغییر شبکه',
          confirmButtonText: 'تایید',
          rtl: true,
          ...swalCustomStyle
        });
        throw new Error('خطا در تغییر شبکه');
      }
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send("eth_requestAccounts", []);
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    
    // بررسی تطابق شبکه
    if (chainId !== targetChainId) {
      Swal.fire({
        icon: 'warning',
        title: 'هشدار!',
        text: 'لطفاً شبکه درست را انتخاب کنید',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
      throw new Error('لطفاً شبکه درست را انتخاب کنید');
    }

    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.utils.formatEther(balance);

    const walletData = {
      address,
      balance: formattedBalance,
      chainId,
      network: SUPPORTED_NETWORKS[chainId]?.chainName || 'نامشخص',
      timestamp: Date.now()
    };

    localStorage.setItem('wallet', JSON.stringify(walletData));

    // قابلیت های دسترسی به داده‌ها و اتصال به والت
    window.walletInfo = walletData;

    // جایگزین event listener های قبلی با روش های بهتر بدون ریلود صفحه
    // ابتدا event listener های قبلی را حذف می‌کنیم
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
    window.ethereum.removeAllListeners('disconnect');

    // اضافه کردن event listener برای تغییرات اکانت بدون ریلود صفحه
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        // اگر کاربر همه اکانت‌ها را قطع کرد
        await disconnectWallet();
        // یک ایونت سفارشی ایجاد می‌کنیم که کامپوننت‌ها بتوانند آن را گوش کنند
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
        
        Swal.fire({
          icon: 'info',
          title: 'اطلاع',
          text: 'کیف پول قطع شد',
          confirmButtonText: 'تایید',
          rtl: true,
          ...swalCustomStyle
        });
      } else {
        // اکانت جدید را بررسی و اطلاعات را بروزرسانی می‌کنیم
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const network = await provider.getNetwork();
        
        const updatedWalletData = {
          address: accounts[0],
          balance: ethers.utils.formatEther(balance),
          chainId: network.chainId,
          network: SUPPORTED_NETWORKS[network.chainId]?.chainName || 'نامشخص',
          timestamp: Date.now()
        };
        
        localStorage.setItem('wallet', JSON.stringify(updatedWalletData));
        window.walletInfo = updatedWalletData;
        
        // یک ایونت سفارشی ایجاد می‌کنیم که کامپوننت‌ها بتوانند آن را گوش کنند
        window.dispatchEvent(new CustomEvent('walletAccountChanged', { 
          detail: updatedWalletData 
        }));
        
        Swal.fire({
          icon: 'success',
          title: 'موفق!',
          text: 'حساب کیف پول تغییر کرد',
          confirmButtonText: 'تایید',
          rtl: true,
          ...swalCustomStyle
        });
      }
    });

    // اضافه کردن event listener برای تغییرات شبکه بدون ریلود صفحه
    window.ethereum.on('chainChanged', async (chainIdHex) => {
      const chainIdDec = parseInt(chainIdHex, 16);
      
      // اطلاعات کیف پول را با توجه به شبکه جدید بروزرسانی می‌کنیم
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      
      const updatedWalletData = {
        address,
        balance: ethers.utils.formatEther(balance),
        chainId: chainIdDec,
        network: SUPPORTED_NETWORKS[chainIdDec]?.chainName || 'نامشخص',
        timestamp: Date.now()
      };
      
      localStorage.setItem('wallet', JSON.stringify(updatedWalletData));
      window.walletInfo = updatedWalletData;
      
      // یک ایونت سفارشی ایجاد می‌کنیم که کامپوننت‌ها بتوانند آن را گوش کنند
      window.dispatchEvent(new CustomEvent('walletChainChanged', { 
        detail: updatedWalletData 
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'موفق!',
        text: 'شبکه تغییر کرد',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
    });

    // اضافه کردن event listener برای قطع اتصال
    window.ethereum.on('disconnect', async (error) => {
      await disconnectWallet();
      // یک ایونت سفارشی ایجاد می‌کنیم که کامپوننت‌ها بتوانند آن را گوش کنند
      window.dispatchEvent(new CustomEvent('walletDisconnected', { 
        detail: error 
      }));
      
      Swal.fire({
        icon: 'info',
        title: 'اطلاع',
        text: 'اتصال کیف پول قطع شد',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
    });
    
    // نمایش پیام موفقیت‌آمیز اتصال کیف پول
    Swal.fire({
      icon: 'success',
      title: 'موفق!',
      text: 'کیف پول شما با موفقیت متصل شد',
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });

    return walletData;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    Swal.fire({
      icon: 'error',
      title: 'خطا!',
      text: `خطا در اتصال به کیف پول: ${error.message}`,
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });
    throw error;
  }
};

export const disconnectWallet = async () => {
  try {
    localStorage.removeItem('wallet');
    
    // حذف event listener ها
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
      window.ethereum.removeAllListeners('disconnect');
    }
    
    Swal.fire({
      icon: 'success',
      title: 'موفق!',
      text: 'اتصال کیف پول با موفقیت قطع شد',
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });
    
    return true;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    Swal.fire({
      icon: 'error',
      title: 'خطا!',
      text: `خطا در قطع اتصال کیف پول: ${error.message}`,
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });
    throw error;
  }
};

export const checkWalletConnection = async () => {
  try {
    if (!window.ethereum) {
      return false;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    
    if (accounts.length > 0) {
      const network = await provider.getNetwork();
      const savedWallet = JSON.parse(localStorage.getItem('wallet') || '{}');
      
      // بررسی تطابق آدرس و شبکه
      return savedWallet.address === accounts[0] && savedWallet.chainId === network.chainId;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

export const getWalletBalance = async (address) => {
  try {
    if (!window.ethereum) {
      throw new Error('لطفاً MetaMask را نصب کنید');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

export const sendTransaction = async (to, amount) => {
  try {
    if (!window.ethereum) {
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'لطفاً MetaMask را نصب کنید',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
      throw new Error('لطفاً MetaMask را نصب کنید');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // بررسی موجودی کافی
    const balance = await signer.getBalance();
    const value = ethers.utils.parseEther(amount);
    
    if (balance.lt(value)) {
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'موجودی کافی نیست',
        confirmButtonText: 'تایید',
        rtl: true,
        ...swalCustomStyle
      });
      throw new Error('موجودی ناکافی');
    }
    
    // نمایش دیالوگ در حال پردازش
    Swal.fire({
      title: 'در حال پردازش تراکنش...',
      text: 'لطفاً MetaMask خود را باز کنید و تراکنش را تأیید کنید',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1a1a2e',
      color: '#ffffff',
      rtl: true
    });
    
    const tx = await signer.sendTransaction({
      to,
      value
    });
    
    // منتظر تأیید تراکنش می‌مانیم
    const receipt = await tx.wait();
    
    // بستن دیالوگ لودینگ
    Swal.close();
    
    // نمایش دیالوگ موفقیت
    Swal.fire({
      icon: 'success',
      title: 'تراکنش موفق!',
      text: `تراکنش با موفقیت انجام شد. هش تراکنش: ${tx.hash}`,
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });
    
    return receipt;
  } catch (error) {
    console.error('Error sending transaction:', error);
    
    // بستن دیالوگ لودینگ در صورت وجود
    Swal.close();
    
    let errorMsg = 'خطا در انجام تراکنش';
    
    if (error.code === 4001) {
      errorMsg = 'تراکنش توسط کاربر لغو شد';
    } else if (error.message) {
      errorMsg = `خطا در انجام تراکنش: ${error.message}`;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'خطا!',
      text: errorMsg,
      confirmButtonText: 'تایید',
      rtl: true,
      ...swalCustomStyle
    });
    
    throw error;
  }
}; 