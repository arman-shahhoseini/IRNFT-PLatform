import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  HeroSection,
  HeroContent,
  GlowingTitle,
  HeroDescription,
  HeroButtons,
  PrimaryButton,
  SecondaryButton,
  HeroStats,
  StatItem,
  HeroShowcase,
  NFTPreview,
  NFTInfo,
  Artist,
  Price
} from './Hero.styles';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <HeroSection id="home">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroContent>
          <motion.div variants={itemVariants}>
            <GlowingTitle>آینده هنر دیجیتال</GlowingTitle>
            <HeroDescription>
              بزرگترین پلتفرم NFT ایران با کالکشن‌های منحصر به فرد
            </HeroDescription>
          </motion.div>

          <HeroButtons>
            <motion.div variants={itemVariants}>
              <PrimaryButton>
                <span>کاوش کنید</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </PrimaryButton>
            </motion.div>
            <motion.div variants={itemVariants}>
              <SecondaryButton>
                <span>ساخت NFT</span>
                <FontAwesomeIcon icon={faPlus} />
              </SecondaryButton>
            </motion.div>
          </HeroButtons>

          <HeroStats>
            <motion.div variants={itemVariants}>
              <StatItem>
                <span className="stat-value">۱۲K+</span>
                <span className="stat-label">هنرمند</span>
              </StatItem>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatItem>
                <span className="stat-value">۵۰K+</span>
                <span className="stat-label">آثار</span>
              </StatItem>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatItem>
                <span className="stat-value">۱۰۰K+</span>
                <span className="stat-label">کاربر</span>
              </StatItem>
            </motion.div>
          </HeroStats>
        </HeroContent>

        <HeroShowcase>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NFTPreview>
              <img src="/assets/images/featured-nft.png" alt="NFT برتر" />
              <NFTInfo>
                <Artist>
                  <img src="/assets/images/artist-avatar.png" alt="هنرمند" />
                  <span>@هنرمند_برتر</span>
                </Artist>
                <Price>
                  <i className="fab fa-ethereum"></i>
                  <span>2.5 ETH</span>
                </Price>
              </NFTInfo>
            </NFTPreview>
          </motion.div>
        </HeroShowcase>
      </motion.div>
    </HeroSection>
  );
};

export default Hero; 