import styled from 'styled-components';

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 2rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gradientDark};
    z-index: -1;
  }
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const GlowingTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(0, 255, 163, 0.3));

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

export const HeroDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: 2rem;
  opacity: 0.9;
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
`;

export const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border: none;
  color: ${({ theme }) => theme.colors.dark};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.neon};
  }
`;

export const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: rgba(0, 255, 163, 0.1);
    transform: translateY(-2px);
  }
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
    gap: 2rem;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  .stat-label {
    color: ${({ theme }) => theme.colors.light};
    opacity: 0.8;
  }
`;

export const HeroShowcase = styled.div`
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 2rem;
  }
`;

export const NFTPreview = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const NFTInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Artist = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.light};
    font-size: 0.9rem;
  }
`;

export const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  i {
    font-size: 1.2rem;
  }
`;

// ... ادامه استایل‌ها در پیام بعدی 