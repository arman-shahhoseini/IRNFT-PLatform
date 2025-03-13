import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCompass, 
  faChartLine, 
  faFire, 
  faSearch, 
  faMoon, 
  faWallet 
} from '@fortawesome/free-solid-svg-icons';
import {
  HeaderContainer,
  NavContainer,
  LogoWrapper,
  Logo,
  NavContent,
  NavLinks,
  NavLink,
  NavActions,
  SearchBar,
  ThemeToggle,
  ConnectWallet,
  MenuToggle
} from './Header.styles';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer scrolled={scrolled}>
      <NavContainer>
        <LogoWrapper>
          <Logo src="assets/images/Logo.png" alt="IRNFT" />
        </LogoWrapper>

        <NavContent isOpen={isMenuOpen}>
          <NavLinks>
            <li>
              <NavLink href="#home" className="active">
                <FontAwesomeIcon icon={faHome} />
                <span>خانه</span>
              </NavLink>
            </li>
            <li>
              <NavLink href="#explore">
                <FontAwesomeIcon icon={faCompass} />
                <span>کاوش</span>
              </NavLink>
            </li>
            <li>
              <NavLink href="#stats">
                <FontAwesomeIcon icon={faChartLine} />
                <span>آمار</span>
              </NavLink>
            </li>
            <li>
              <NavLink href="#drops">
                <FontAwesomeIcon icon={faFire} />
                <span>دراپ‌ها</span>
              </NavLink>
            </li>
          </NavLinks>

          <NavActions>
            <SearchBar>
              <input type="text" placeholder="جستجو..." />
              <FontAwesomeIcon icon={faSearch} />
            </SearchBar>
            <ThemeToggle>
              <FontAwesomeIcon icon={faMoon} />
            </ThemeToggle>
            <ConnectWallet>
              <FontAwesomeIcon icon={faWallet} />
              <span>اتصال کیف پول</span>
            </ConnectWallet>
          </NavActions>
        </NavContent>

        <MenuToggle 
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </MenuToggle>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 