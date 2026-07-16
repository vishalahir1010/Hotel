import React from 'react';

export const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-text animate-fade-in">
        <span className="section-tag">Our Legacy</span>
        <h2 className="section-title">
          A Sanctuary Crafted <br />
          For the <span className="gold-text">Discerning Few</span>
        </h2>
        <p className="about-desc">
          Perched gracefully on the pristine cliffs overlooking the Mediterranean, Aurelia Resort & Spa offers a rare blend of secluded raw nature and unmatched architectural opulence. 
        </p>
        <p className="about-desc" style={{ marginBottom: '35px' }}>
          Every corner of Aurelia is designed to inspire tranquility. From our tailored in-suite guest experiences to our private yacht charters, we curate every detail of your stay to achieve absolute bliss.
        </p>

        {/* Highlights Counter Grid */}
        <div className="about-highlights">
          <div className="highlight-item">
            <span className="highlight-num">140+</span>
            <span className="highlight-label">Private Pool Suites</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-num">3</span>
            <span className="highlight-label">Michelin Star Dinings</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-num">12,000</span>
            <span className="highlight-label">Sq Ft Luxury Spa</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-num">4</span>
            <span className="highlight-label">Secluded Sandy Beaches</span>
          </div>
        </div>

        <button className="outline-button" onClick={() => {
          const element = document.getElementById('rooms');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }}>
          Explore Our Suites
        </button>
      </div>

      <div className="about-images">
        {/* Large back image */}
        <img 
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" 
          alt="Luxury Resort Architecture" 
          className="about-img-large" 
        />
        {/* Small front overlapping image */}
        <img 
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80" 
          alt="Luxury Spa Treatment" 
          className="about-img-small" 
        />
      </div>
    </section>
  );
};
export default About;
