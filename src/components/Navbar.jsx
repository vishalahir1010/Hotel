import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, X, PhoneCall, User as UserIcon } from 'lucide-react';

export const Navbar = ({ 
  onBookClick, 
  user, 
  onSignInClick, 
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'always-solid' : ''}`}>
      <div className="navbar">
        <div className="logo-container" onClick={() => handleNavClick('/')}>
          <Compass className="logo-icon animate-float" />
          <span className="logo-text">AURELIA</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('/')}>Home</span></li>
            <li><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('/about')}>About</span></li>
            <li><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('/suites')}>Suites</span></li>
            <li><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('/experiences')}>Experiences</span></li>
            <li><span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('/faq')}>FAQ</span></li>
          </ul>
        </nav>

        <div className="nav-cta-container">
          <a href="tel:+1800AURELIA" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }} className="desktop-only">
            <PhoneCall size={14} />
            <span>+1 800 AURELIA</span>
          </a>

          {/* User Profile Info / Login actions */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="desktop-only">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                <UserIcon size={14} style={{ color: 'var(--gold-primary)' }} />
                <span>Welcome, <span className="gold-text">{user.name.split(' ')[0]}</span></span>
              </div>
              <button 
                className="outline-button" 
                onClick={onLogout}
                style={{ padding: '8px 16px', fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="outline-button desktop-only" 
              onClick={onSignInClick}
              style={{ padding: '8px 16px', fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
              Sign In
            </button>
          )}

          <button className="gold-button" onClick={onBookClick}>Book Now</button>
          
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <span className="mobile-drawer-link" onClick={() => handleNavClick('/')}>Home</span>
          <span className="mobile-drawer-link" onClick={() => handleNavClick('/about')}>About</span>
          <span className="mobile-drawer-link" onClick={() => handleNavClick('/suites')}>Suites</span>
          <span className="mobile-drawer-link" onClick={() => handleNavClick('/experiences')}>Experiences</span>
          <span className="mobile-drawer-link" onClick={() => handleNavClick('/faq')}>FAQ</span>
          
          {user ? (
            <div className="mobile-drawer-user-section">
              <div className="mobile-drawer-welcome">
                Welcome, <span className="gold-text">{user.name}</span>
              </div>
              <button 
                className="outline-button mobile-drawer-btn" 
                onClick={() => { setMobileMenuOpen(false); onLogout(); }} 
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="outline-button mobile-drawer-btn" 
              onClick={() => { setMobileMenuOpen(false); onSignInClick(); }} 
            >
              Sign In
            </button>
          )}

          <a href="tel:+1800AURELIA" className="mobile-drawer-phone">
            <PhoneCall size={16} />
            <span>+1 800 AURELIA</span>
          </a>
        </div>
      )}
    </header>
  );
};
export default Navbar;
