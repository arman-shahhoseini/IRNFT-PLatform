import { ethers } from 'ethers';

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
          throw new Error('خطا در اضافه کردن شبکه');
        }
      } else {
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
      throw new Error('لطفاً شبکه درست را انتخاب کنید');
    }

    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.utils.formatEther(balance);

    const walletData = {
      address,
      balance: formattedBalance,
      chainId,
      network: SUPPORTED_NETWORKS[chainId].chainName
    };

    localStorage.setItem('wallet', JSON.stringify(walletData));

    // اضافه کردن event listener برای تغییرات اکانت
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    // اضافه کردن event listener برای تغییرات شبکه
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // اضافه کردن event listener برای قطع اتصال
    window.ethereum.on('disconnect', () => {
      disconnectWallet();
    });

    return walletData;
  } catch (error) {
    console.error('Error connecting wallet:', error);
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
    
    return true;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
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
      throw new Error('لطفاً MetaMask را نصب کنید');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // بررسی موجودی کافی
    const balance = await signer.getBalance();
    const value = ethers.utils.parseEther(amount);
    
    if (balance.lt(value)) {
      throw new Error('موجودی ناکافی');
    }
    
    const tx = await signer.sendTransaction({
      to,
      value
    });
    
    return tx;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}; 