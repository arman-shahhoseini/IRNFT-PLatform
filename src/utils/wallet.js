import { ethers } from 'ethers';

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('لطفاً MetaMask را نصب کنید');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.utils.formatEther(balance);

    const walletData = {
      address,
      balance: formattedBalance,
      provider,
      signer
    };

    localStorage.setItem('wallet', JSON.stringify(walletData));
    return walletData;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  try {
    localStorage.removeItem('wallet');
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
    return accounts.length > 0;
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
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount)
    });
    return tx;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}; 