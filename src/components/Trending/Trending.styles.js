import styled from 'styled-components';

export const TrendingSection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.colors.darker};
`;

export const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 2.5rem;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;

    h2 {
      font-size: 2rem;
    }
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    overflow-x: auto;
    padding: 0.5rem;
    justify-content: start;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const FilterButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ active, theme }) => 
    active ? theme.colors.gradientPrimary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.dark : theme.colors.light};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;

  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.gradientPrimary : 'rgba(255, 255, 255, 0.1)'};
  }
`;

export const NFTGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

export const NFTCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

export const NFTImage = styled.div`
  position: relative;
  padding-top: 100%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NFTDetails = styled.div`
  padding: 1.5rem;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.light};
  }
`;

export const ArtistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.light};
    opacity: 0.8;
  }
`;

export const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .current-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export const BidButton = styled.button`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border: none;
  padding: 0.5rem 1rem;
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