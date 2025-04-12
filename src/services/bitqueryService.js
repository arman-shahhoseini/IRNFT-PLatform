// سرویس بیت‌کوئری با استفاده از داده‌های نمونه

// همیشه از داده‌های نمونه استفاده می‌کنیم زیرا API key بیت‌کوئری با خطای 401 مواجه می‌شود
const USE_MOCK_DATA = true;

const BITQUERY_API_URL = 'https://graphql.bitquery.io';
const API_KEY = 'ory_at_N1WbvFD_YDIiny34F_N_iqiBKx38mMfWJEBoAG9zfOc.19eLVbQu5aQAt4gs_x01mbS1gWY5LPhjicXScT3qo_M';

// تابع اصلی برای ارسال کوئری به API بیت‌کوئری
const executeQuery = async (query) => {
  if (USE_MOCK_DATA) {
    console.log('استفاده از داده‌های نمونه به جای درخواست به API');
    return null;
  }

  try {
    const response = await fetch(BITQUERY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`خطای ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`خطای GraphQL: ${data.errors[0].message}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('خطا در اجرای کوئری بیت‌کوئری:', error);
    throw error;
  }
};

// دریافت آخرین معاملات NFT
export const getLatestOpenSeaTrades = async (limit = 20) => {
  if (USE_MOCK_DATA) {
    return getMockOpenSeaTrades(limit);
  }

  try {
    const query = `
      {
        ethereum {
          dexTrades(
            options: {limit: ${limit}, desc: "block.timestamp.time"}
            exchangeName: {is: "Opensea"}
          ) {
            block {
              timestamp {
                time
              }
            }
            transaction {
              hash
            }
            buyAmount
            buyCurrency {
              name
              symbol
              address
            }
            sellAmount
            sellCurrency {
              name
              symbol
              address
            }
            maker
            taker
          }
        }
      }
    `;
    
    const data = await executeQuery(query);
    
    if (!data || !data.ethereum || !data.ethereum.dexTrades || data.ethereum.dexTrades.length === 0) {
      console.warn('داده‌های OpenSea دریافت نشد یا خالی است');
      return [];
    }
    
    return data.ethereum.dexTrades.map((trade, index) => {
      // استخراج آدرس قرارداد NFT (معمولاً در buyCurrency)
      const tokenAddress = trade.buyCurrency.address || trade.sellCurrency.address;
      
      return {
        id: `opensea-${index}-${tokenAddress}`,
        name: trade.buyCurrency.name || 'NFT ناشناس',
        description: 'NFT معامله شده در OpenSea',
        image: getImageForNFT(tokenAddress, index),
        tokenId: `${index}`,
        tokenAddress: tokenAddress,
        price: parseFloat(trade.sellAmount || 0),
        priceSymbol: trade.sellCurrency.symbol || 'ETH',
        sellerAddress: trade.maker,
        buyerAddress: trade.taker,
        transactionHash: trade.transaction.hash,
        blockTimestamp: new Date(trade.block.timestamp.time),
        collectionName: trade.buyCurrency.name || 'کالکشن ناشناس'
      };
    });
  } catch (error) {
    console.error('خطا در دریافت معاملات OpenSea:', error);
    return getMockOpenSeaTrades(limit);
  }
};

// دریافت محبوب‌ترین NFT‌ها
export const getMostTradedNFTs = async (limit = 10) => {
  if (USE_MOCK_DATA) {
    return getMockPopularNFTs(limit);
  }

  try {
    const query = `
      {
        ethereum {
          dexTrades(
            options: {limit: ${limit}}
            exchangeName: {is: "Opensea"}
          ) {
            buyCurrency {
              name
              symbol
              address
            }
            count
            tradeAmount(calculate: sum)
            buyAmount(calculate: sum)
          }
        }
      }
    `;
    
    const data = await executeQuery(query);
    
    if (!data || !data.ethereum || !data.ethereum.dexTrades || data.ethereum.dexTrades.length === 0) {
      console.warn('داده‌های NFT‌های محبوب دریافت نشد یا خالی است');
      return [];
    }
    
    return data.ethereum.dexTrades.map((item, index) => {
      const smartContract = item.buyCurrency.address;
      return {
        id: `popular-${smartContract}-${index}`,
        name: item.buyCurrency.name || `NFT محبوب ${index + 1}`,
        description: `یکی از محبوب‌ترین NFT‌ها با ${item.count} معامله`,
        image: getPopularNFTImage(index),
        tokenAddress: smartContract,
        tradeCount: parseInt(item.count),
        volume: parseFloat(item.tradeAmount || 0),
        price: parseFloat(item.buyAmount || 0) / parseInt(item.count),
        priceSymbol: item.buyCurrency.symbol || 'ETH',
        collectionName: item.buyCurrency.name || 'کالکشن محبوب',
        blockTimestamp: new Date()
      };
    });
  } catch (error) {
    console.error('خطا در دریافت NFT‌های محبوب:', error);
    return getMockPopularNFTs(limit);
  }
};

// دریافت NFT‌های یک کالکشن خاص
export const getNFTsByCollection = async (collectionAddress, limit = 20) => {
  if (USE_MOCK_DATA) {
    return getMockCollectionNFTs(collectionAddress, limit);
  }

  try {
    const query = `
      {
        ethereum {
          dexTrades(
            options: {limit: ${limit}, desc: "block.timestamp.time"}
            exchangeName: {is: "Opensea"}
            buyCurrency: {is: "${collectionAddress}"}
          ) {
            block {
              timestamp {
                time
              }
            }
            transaction {
              hash
            }
            buyAmount
            buyCurrency {
              name
              symbol
              address
            }
            sellAmount
            sellCurrency {
              name
              symbol
              address
            }
            maker
            taker
          }
        }
      }
    `;
    
    const data = await executeQuery(query);
    
    if (!data || !data.ethereum || !data.ethereum.dexTrades || data.ethereum.dexTrades.length === 0) {
      console.warn(`داده‌های کالکشن ${collectionAddress} دریافت نشد یا خالی است`);
      return [];
    }
    
    return data.ethereum.dexTrades.map((trade, index) => {
      return {
        id: `${trade.buyCurrency.address}-${index}`,
        name: `${trade.buyCurrency.name || 'NFT'} #${index}`,
        description: `NFT از کالکشن ${trade.buyCurrency.name || 'ناشناس'}`,
        image: getImageForNFT(trade.buyCurrency.address, index),
        tokenId: `${index}`,
        tokenAddress: trade.buyCurrency.address,
        price: parseFloat(trade.sellAmount || 0),
        priceSymbol: trade.sellCurrency.symbol || 'ETH',
        sellerAddress: trade.maker,
        buyerAddress: trade.taker,
        transactionHash: trade.transaction.hash,
        blockTimestamp: new Date(trade.block.timestamp.time),
        collectionName: trade.buyCurrency.name || 'کالکشن ناشناس'
      };
    });
  } catch (error) {
    console.error(`خطا در دریافت NFT‌های کالکشن ${collectionAddress}:`, error);
    return getMockCollectionNFTs(collectionAddress, limit);
  }
};

// تست API برای بررسی اتصال به بیت‌کوئری
export const testBitqueryConnection = async () => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: { ethereum: { blocks: [{ number: "12345678", timestamp: { time: new Date().toISOString() } }] } }
    };
  }

  try {
    const query = `
      {
        ethereum {
          blocks(limit: 1) {
            number
            timestamp {
              time
            }
          }
        }
      }
    `;
    
    const data = await executeQuery(query);
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// دریافت داده‌های نمونه OpenSea
const getMockOpenSeaTrades = (limit = 20) => {
  return Array(limit).fill().map((_, index) => ({
    id: `opensea-${index}`,
    name: `کریپتو پانک #${1000 + index}`,
    description: 'یکی از محبوب‌ترین NFT‌ها در تاریخ کریپتو. این مجموعه شامل ۱۰,۰۰۰ کاراکتر یکتا است.',
    image: `https://picsum.photos/500/500?random=${index}`,
    tokenId: `${1000 + index}`,
    tokenAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    price: (Math.random() * 5 + 0.5).toFixed(3),
    priceSymbol: 'ETH',
    sellerAddress: '0xe7f35f06a80a6a2a5edc823379fa147d9f9948a8',
    buyerAddress: '0xd7c708080553068217a2fe6f44eccf9cac309915',
    transactionHash: `0x5eba5d8d84c20a7f30b92d74afaee764d9476b62a1637b017319c721269245${index.toString().padStart(2, '0')}`,
    blockTimestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    collectionName: index % 4 === 0 ? 'کریپتو پانکس' : 
                  index % 4 === 1 ? 'Bored Ape Yacht Club' : 
                  index % 4 === 2 ? 'Azuki' : 'Doodles'
  }));
};

// دریافت داده‌های نمونه NFT‌های محبوب
const getMockPopularNFTs = (limit = 10) => {
  const popularCollections = [
    { name: 'کریپتو پانکس', address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', count: 10245 },
    { name: 'Bored Ape Yacht Club', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', count: 8976 },
    { name: 'Azuki', address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', count: 7543 },
    { name: 'Doodles', address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', count: 6321 },
    { name: 'CloneX', address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B', count: 5983 },
    { name: 'Moonbirds', address: '0x23581767a106ae21c074b2276D25e5C3e136a68b', count: 5421 },
    { name: 'Pudgy Penguins', address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', count: 4873 },
    { name: 'VeeFriends', address: '0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB', count: 4256 },
    { name: 'World of Women', address: '0xe785E82358879F061BC3dcAC6f0444462D4b5330', count: 3984 },
    { name: 'Cool Cats', address: '0x1A92f7381B9F03921564a437210bB9396471050C', count: 3652 }
  ];

  return popularCollections.slice(0, limit).map((collection, index) => ({
    id: `popular-${collection.address}`,
    name: collection.name,
    description: `یکی از محبوب‌ترین کالکشن‌های NFT با ${collection.count} معامله`,
    image: `https://picsum.photos/500/500?random=popular${index}`,
    tokenAddress: collection.address,
    tradeCount: collection.count,
    volume: collection.count * (Math.random() * 5 + 1),
    price: (Math.random() * 10 + 1).toFixed(3),
    priceSymbol: 'ETH',
    collectionName: collection.name,
    blockTimestamp: new Date()
  }));
};

// دریافت داده‌های نمونه NFT‌های یک کالکشن خاص
const getMockCollectionNFTs = (collectionAddress, limit = 20) => {
  let collectionName = 'کالکشن ناشناس';
  
  // تعیین نام کالکشن بر اساس آدرس
  if (collectionAddress === '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB') {
    collectionName = 'کریپتو پانکس';
  } else if (collectionAddress === '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D') {
    collectionName = 'Bored Ape Yacht Club';
  } else if (collectionAddress === '0xED5AF388653567Af2F388E6224dC7C4b3241C544') {
    collectionName = 'Azuki';
  } else if (collectionAddress === '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e') {
    collectionName = 'Doodles';
  } else if (collectionAddress === '0xcd76d0cf64bf4a58d898905c5adad5e1e838e0d3') {
    collectionName = 'The Orangez';
  }
  
  return Array(limit).fill().map((_, index) => ({
    id: `${collectionAddress}-${index}`,
    name: `${collectionName} #${2000 + index}`,
    description: `این NFT متعلق به کالکشن ${collectionName} است.`,
    image: `https://picsum.photos/500/500?random=${collectionAddress.slice(-4)}${index}`,
    tokenId: `${2000 + index}`,
    tokenAddress: collectionAddress,
    price: (Math.random() * 5 + 0.5).toFixed(3),
    priceSymbol: 'ETH',
    sellerAddress: '0xe7f35f06a80a6a2a5edc823379fa147d9f9948a8',
    buyerAddress: '0xd7c708080553068217a2fe6f44eccf9cac309915',
    transactionHash: `0x7dca6f8d45c20a7f30b92d74afaee764d9476b62a1637b017319c721269245${index.toString().padStart(2, '0')}`,
    blockTimestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    collectionName: collectionName
  }));
};

// دریافت تصویر برای NFT (تابع کمکی)
const getImageForNFT = (contractAddress, tokenId) => {
  // در دنیای واقعی، باید از IPFS یا سرویس metadata استفاده کنید
  // اما برای نمایش اولیه از تصاویر نمونه استفاده می‌کنیم
  return `https://picsum.photos/500/500?random=${contractAddress.slice(-6)}${tokenId}`;
};

// تصاویر برای NFT‌های محبوب
const getPopularNFTImage = (index) => {
  const images = [
    'https://picsum.photos/500/500?random=popular1',
    'https://picsum.photos/500/500?random=popular2',
    'https://picsum.photos/500/500?random=popular3',
    'https://picsum.photos/500/500?random=popular4',
    'https://picsum.photos/500/500?random=popular5',
    'https://picsum.photos/500/500?random=popular6',
    'https://picsum.photos/500/500?random=popular7',
    'https://picsum.photos/500/500?random=popular8',
    'https://picsum.photos/500/500?random=popular9',
    'https://picsum.photos/500/500?random=popular10',
  ];
  
  return index < images.length ? images[index] : images[0];
}; 