import React, { useState, useEffect } from 'react';
import { Calendar, Users, Shield } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=85', // Cliffside pool sunset
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=85', // Crystal overwater villa deck
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85'  // Resort facade at dusk
];

export const Hero = ({
  checkIn, setCheckIn,
  checkOut, setCheckOut,
  guests, setGuests,
  roomType, setRoomType,
  onSearch
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // cycle slides every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero-sec">
      {/* Background imagery carousel with Ken Burns zooming transitions */}
      <div className="hero-bg-slider">
        {HERO_IMAGES.map((image, idx) => (
          <div 
            key={idx}
            className={`hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      {/* Dark overlay */}
      <div className="hero-overlay" />

      {/* Main hero content container (centered vertically) */}
      <div className="hero-content">
        <span className="hero-subtitle animate-fade-in">Sanctuary of the Soul</span>
        <h1 className="hero-title animate-fade-in">
          Where Timeless Luxury <br />
          Meets <span className="gold-text">Pristine Nature</span>
        </h1>
        <p className="hero-desc animate-fade-in" style={{ marginBottom: 0 }}>
          Escape to an award-winning coastal haven of private villas, Michelin-starred gastronomy, and world-class sensory wellness treatments.
        </p>
      </div>

      {/* Floating Search Bar container aligned at the bottom of the Hero section */}
      <div className="search-bar-container animate-fade-in">
        <div className="glass-panel search-bar">
          {/* Check In Date */}
          <div className="search-field">
            <label>Check In</label>
            <div className="search-input-wrapper">
              <Calendar className="search-icon" />
              <input 
                type="date" 
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>

          {/* Check Out Date */}
          <div className="search-field">
            <label>Check Out</label>
            <div className="search-input-wrapper">
              <Calendar className="search-icon" />
              <input 
                type="date" 
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          {/* Guests dropdown */}
          <div className="search-field">
            <label>Guests</label>
            <div className="search-input-wrapper">
              <Users className="search-icon" />
              <select 
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5+ Guests</option>
              </select>
            </div>
          </div>

          {/* Suite types dropdown */}
          <div className="search-field">
            <label>Suite Type</label>
            <div className="search-input-wrapper">
              <Shield className="search-icon" />
              <select 
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="all">All Suites</option>
                <option value="ocean">Ocean View</option>
                <option value="pool">Private Pool</option>
                <option value="suite">Exclusive Penthouse</option>
              </select>
            </div>
          </div>

          {/* Search Trigger Button */}
          <button className="gold-button search-btn" onClick={onSearch}>
            <span>Search</span>
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
