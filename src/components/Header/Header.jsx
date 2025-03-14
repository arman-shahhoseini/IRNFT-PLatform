import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCompass, 
  faChartLine, 
  faFire,
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
  MenuToggle,
  WalletButton
} from './Header.styles';
import WalletDialog from '../WalletDialog/WalletDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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

            {isMenuOpen && (
              <NavActions>
                <WalletButton onClick={() => setIsWalletDialogOpen(true)}>
                  <FontAwesomeIcon icon={faWallet} />
                  <span>اتصال کیف پول</span>
                </WalletButton>
              </NavActions>
            )}
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

      <WalletDialog 
        isOpen={isWalletDialogOpen}
        onClose={() => setIsWalletDialogOpen(false)}
      />
    </>
  );
};

export default Header; 