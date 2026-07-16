import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TESTIMONIALS_DATA = [
  {
    name: 'Lady Beatrice Vance',
    role: 'VIP Member, London',
    rating: 5,
    text: 'A absolute masterpiece of hospitality. The private infinity pool villa was pristine, and the sommelier wine cellar tour was outstanding. I have never felt more pampered.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Sir Charles Sinclair',
    role: 'Travel Writer, New York',
    rating: 5,
    text: 'Carlo Rossi’s sea-to-table tasting menu was a religious culinary experience. Perched on the Amalfi Coast cliffs, Aurelia is the pinnacle of European luxury.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Duchess Helena Croft',
    role: 'Resident Guest, Monaco',
    rating: 5,
    text: 'The seaweed oil massages and hydrotherapy pool at the Sanctuary Spa restored my soul. Aurelia is a private paradise. I will be returning every summer.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const Testimonials = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const active = TESTIMONIALS_DATA[activeIdx];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="rooms-header animate-fade-in" style={{ marginBottom: '50px' }}>
        <span className="section-tag">Elite Guest Reviews</span>
        <h2 className="section-title">Whispers of <span className="gold-text">Aurelia</span></h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>
          Hear what our esteemed members and globetrotting connoisseurs say about their journeys at our Amalfi sanctuary.
        </p>
      </div>

      <div className="testimonial-carousel animate-fade-in">
        {/* Quote watermark icon */}
        <Quote className="quote-icon" />

        <div className="testimonial-card">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
            {[...Array(active.rating)].map((_, i) => (
              <Star key={i} size={16} fill="var(--gold-primary)" color="var(--gold-primary)" />
            ))}
          </div>

          <p className="testimonial-quote">"{active.text}"</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
            <img 
              src={active.avatar} 
              alt={active.name} 
              className="testimonial-avatar" 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--gold-border)'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <h4 className="testimonial-author">{active.name}</h4>
              <span className="testimonial-role" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {active.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="slider-nav-btn prev" 
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '10px',
            transition: 'color 0.3s'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="slider-nav-btn next" 
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '10px',
            transition: 'color 0.3s'
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="testimonial-dots">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button 
              key={idx} 
              className={`dot-btn ${idx === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
