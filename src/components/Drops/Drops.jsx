import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  DropsSection,
  DropsContainer,
  DropsList,
  DropCard,
  DropImage,
  DropInfo,
  DropTitle,
  DropMeta,
  TimeRemaining,
  LikeCount,
  DropArtist,
  ViewButton
} from './Drops.styles';

const upcomingDrops = [
  {
    id: 1,
    title: "کالکشن هنر دیجیتال ایران",
    image: "assets/images/drop1.png",
    artist: {
      name: "علی محمدی",
      avatar: "assets/images/artist1.png"
    },
    timeRemaining: "۲ روز",
    likes: 1234
  },
  // ... اضافه کردن دراپ‌های بیشتر
];

const Drops = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <DropsSection id="drops">
      <DropsContainer>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          دراپ‌های آینده
        </motion.h2>

        <DropsList
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {upcomingDrops.map(drop => (
            <motion.div
              key={drop.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <DropCard>
                <DropImage>
                  <img src={drop.image} alt={drop.title} />
                </DropImage>
                <DropInfo>
                  <DropTitle>{drop.title}</DropTitle>
                  <DropMeta>
                    <TimeRemaining>
                      <FontAwesomeIcon icon={faClock} />
                      <span>{drop.timeRemaining}</span>
                    </TimeRemaining>
                    <LikeCount>
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{drop.likes}</span>
                    </LikeCount>
                  </DropMeta>
                  <DropArtist>
                    <img src={drop.artist.avatar} alt={drop.artist.name} />
                    <span>{drop.artist.name}</span>
                  </DropArtist>
                  <ViewButton>مشاهده جزئیات</ViewButton>
                </DropInfo>
              </DropCard>
            </motion.div>
          ))}
        </DropsList>
      </DropsContainer>
    </DropsSection>
  );
};

export default Drops; 