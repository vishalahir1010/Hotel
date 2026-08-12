import React from 'react';

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    caption: 'Cliffside Infinity Pool'
  },
  {
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    caption: 'Sanctuary Spa'
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    caption: 'Michelin Dining'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'Private Beach'
  },
  {
    src: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
    caption: 'Yacht Charters'
  }
];

export const GalleryStrip = () => {
  return (
    <section id="gallery" className="gallery-section">
      <div className="rooms-header animate-fade-in" style={{ marginBottom: '50px' }}>
        <span className="section-tag">Visual Journey</span>
        <h2 className="section-title">Life at <span className="gold-text">Aurelia</span></h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>
          A glimpse into the extraordinary world of Aurelia — where every corner is a frame-worthy moment.
        </p>
      </div>

      <div className="gallery-strip">
        {GALLERY_IMAGES.map((img, idx) => (
          <div key={idx} className="gallery-item">
            <img src={img.src} alt={img.caption} className="gallery-img" />
            <div className="gallery-overlay">
              <span className="gallery-caption">{img.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default GalleryStrip;
