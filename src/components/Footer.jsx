import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Send } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer animate-fade-in">
      <div className="footer-grid">
        {/* Brand Bio */}
        <div className="footer-col">
          <div className="logo-container" onClick={() => handleLinkClick('/')} style={{ cursor: 'pointer', marginBottom: '10px' }}>
            <Compass className="logo-icon" />
            <span className="logo-text">AURELIA</span>
          </div>
          <p className="footer-about">
            A premium sanctuary perched on the cliffs, crafted for the few who appreciate absolute tranquility, gourmet dining, and sensory healing.
          </p>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('/')}>Home</span></li>
            <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('/about')}>About Legacy</span></li>
            <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('/suites')}>Rooms & Suites</span></li>
            <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('/experiences')}>Experiences</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact-item">
            <MapPin className="footer-contact-icon" />
            <span>Via Regina 12, Amalfi Coast, Italy</span>
          </div>
          <div className="footer-contact-item">
            <Phone className="footer-contact-icon" />
            <span>+1 800 AURELIA</span>
          </div>
          <div className="footer-contact-item">
            <Mail className="footer-contact-icon" />
            <span>concierge@aureliaresort.com</span>
          </div>
        </div>

        {/* Newsletter Club Signup */}
        <div className="footer-col">
          <h4 className="footer-col-title">The Aurelia Club</h4>
          <p className="footer-about" style={{ fontSize: '0.85rem' }}>
            Subscribe to receive exclusive invitations, seasonal culinary menus, and priority suite allocations.
          </p>
          
          {subscribed ? (
            <div style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', fontWeight: 500, padding: '10px 0' }}>
              Welcome to the elite circle. Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                className="gold-button"
                style={{ padding: '14px 20px', minWidth: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
