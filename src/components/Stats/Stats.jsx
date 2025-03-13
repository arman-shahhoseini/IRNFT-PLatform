import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faPaintBrush, faCoins } from '@fortawesome/free-solid-svg-icons';
import {
  StatsSection,
  StatsContainer,
  StatsGrid,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  ChartContainer
} from './Stats.styles';

const Stats = () => {
  const stats = [
    {
      icon: faUsers,
      value: "۱۰۰K+",
      label: "کاربر فعال",
      color: "#00ffa3"
    },
    {
      icon: faPaintBrush,
      value: "۵۰K+",
      label: "هنرمند",
      color: "#ff6b6b"
    },
    {
      icon: faCoins,
      value: "۲۰۰K+",
      label: "معاملات",
      color: "#ffd93d"
    },
    {
      icon: faChartLine,
      value: "۵۰۰+",
      label: "کالکشن",
      color: "#4dabf7"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <StatsSection id="stats">
      <StatsContainer>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          آمار و ارقام پلتفرم
        </motion.h2>

        <StatsGrid>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <StatCard>
                <StatIcon color={stat.color}>
                  <FontAwesomeIcon icon={stat.icon} />
                </StatIcon>
                <StatContent>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatContent>
              </StatCard>
            </motion.div>
          ))}
        </StatsGrid>

        <ChartContainer>
          {/* اینجا می‌توانید از کتابخانه‌های نمودار مثل Chart.js یا Recharts استفاده کنید */}
        </ChartContainer>
      </StatsContainer>
    </StatsSection>
  );
};

export default Stats; 