import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import {
  TrendingSection,
  SectionHeader,
  FilterTabs,
  FilterButton,
  NFTGrid,
  NFTCard,
  NFTImage,
  NFTDetails,
  ArtistInfo,
  PriceInfo,
  BidButton
} from './Trending.styles';

const categories = ['همه', 'هنری', 'موسیقی', 'ورزشی'];

const nftData = [
  {
    id: 1,
    title: "رویای دیجیتال",
    image: "assets/images/nft1.png",
    artist: {
      name: "سارا احمدی",
      avatar: "assets/images/artist1.png"
    },
    price: 2.5,
    category: "هنری"
  },
  // ... اضافه کردن NFT های بیشتر
];

const Trending = () => {
  const [activeCategory, setActiveCategory] = useState('همه');

  const filteredNFTs = nftData.filter(nft => 
    activeCategory === 'همه' || nft.category === activeCategory
  );

  return (
    <TrendingSection id="explore">
      <SectionHeader>
        <h2>کالکشن‌های برتر</h2>
        <FilterTabs>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterTabs>
      </SectionHeader>

      <NFTGrid>
        <AnimatePresence>
          {filteredNFTs.map(nft => (
            <motion.div
              key={nft.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <NFTCard>
                <NFTImage>
                  <img src={nft.image} alt={nft.title} />
                </NFTImage>
                <NFTDetails>
                  <h3>{nft.title}</h3>
                  <ArtistInfo>
                    <img src={nft.artist.avatar} alt={nft.artist.name} />
                    <span>{nft.artist.name}</span>
                  </ArtistInfo>
                  <PriceInfo>
                    <div className="current-price">
                      <FontAwesomeIcon icon={faEthereum} />
                      <span>{nft.price} ETH</span>
                    </div>
                    <BidButton>
                      پیشنهاد خرید
                    </BidButton>
                  </PriceInfo>
                </NFTDetails>
              </NFTCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </NFTGrid>
    </TrendingSection>
  );
};

export default Trending; 