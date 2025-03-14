import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 255, 163, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export const NavContainer = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
`;

export const LogoWrapper = styled.div`
  flex-shrink: 0;
`;

export const Logo = styled.img`
  height: 40px;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    filter: drop-shadow(0 0 10px ${({ theme }) => theme.colors.primary});
  }
`;

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-grow: 1;
  margin-right: 3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: fixed;
    top: 70px;
    right: 0;
    width: 280px;
    height: calc(100vh - 70px);
    background: rgba(18, 18, 18, 0.98);
    backdrop-filter: blur(20px);
    padding: 2rem;
    flex-direction: column;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    transition: ${({ theme }) => theme.transitions.default};
    border-left: 1px solid rgba(0, 255, 163, 0.1);
    overflow-y: auto;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    margin-right: 0;
  }
`;

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: ${({ theme }) => theme.transitions.default};
  border: 1px solid transparent;

  svg {
    font-size: 1.2rem;
    transition: transform ${({ theme }) => theme.transitions.default};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 255, 163, 0.1);
    border-color: rgba(0, 255, 163, 0.2);

    svg {
      transform: translateY(-2px);
    }
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 255, 163, 0.15);
    border-color: rgba(0, 255, 163, 0.3);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0.8rem 1rem;
    
    &:hover {
      transform: translateX(-5px);
    }
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const SearchBar = styled.div`
  position: relative;
  
  input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    color: ${({ theme }) => theme.colors.light};
    width: 200px;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      width: 250px;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.light};
  }
`;

export const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ConnectWallet = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.dark};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.neon};
  }
`;

export const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
  }

  span {
    display: block;
    width: 25px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.light};
    margin: 5px 0;
    transition: ${({ theme }) => theme.transitions.default};

    &:nth-child(1) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    }

    &:nth-child(3) {
      transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
    }
  }
`;

export const WalletButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(0, 255, 163, 0.1);
  border: 1px solid rgba(0, 255, 163, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  svg {
    font-size: 1.2rem;
    color: #00ff9d;
  }

  &:hover {
    background: rgba(0, 255, 163, 0.15);
    border-color: rgba(0, 255, 163, 0.3);
    transform: translateX(-5px);
  }
`;

// ... (ادامه استایل‌ها در پیام بعدی) 