import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: ${({ scrolled }) => 
    scrolled ? 'rgba(10, 12, 10, 0.95)' : 'transparent'};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 255, 163, 0.1);
  transition: ${({ theme }) => theme.transitions.default};
`;

export const NavContainer = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    left: 0;
    width: 100%;
    background: ${({ theme }) => theme.colors.darker};
    padding: 1rem;
    flex-direction: column;
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    transition: ${({ theme }) => theme.transitions.default};
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
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

  svg {
    font-size: 1.2rem;
    transition: transform ${({ theme }) => theme.transitions.default};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 255, 163, 0.1);

    svg {
      transform: translateY(-2px);
    }
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 255, 163, 0.15);
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

// ... (ادامه استایل‌ها در پیام بعدی) 