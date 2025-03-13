import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DropsSection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.colors.darker};
  position: relative;
  overflow: hidden;
`;

export const DropsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const DropsList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const DropCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

export const DropImage = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const DropInfo = styled.div`
  padding: 1.5rem;
`;

export const DropTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: 1rem;
`;

export const DropMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const TimeRemaining = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};

  svg {
    font-size: 1rem;
  }
`;

export const LikeCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;

  svg {
    font-size: 1rem;
  }
`;

export const DropArtist = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.light};
    opacity: 0.8;
  }
`;

export const ViewButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.neon};
  }
`; 