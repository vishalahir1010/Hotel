import React, { useState } from 'react';
import { Sparkles, GlassWater, Flame, Ship, Compass, Shield } from 'lucide-react';

const AMENITIES_DATA = [
  {
    id: 'spa',
    name: 'Spa & Wellness',
    title: 'The Aurelia Sanctuary Spa',
    desc: 'Restore harmony to mind and body in our cliffside sanctuary. We combine ancient healing traditions with modern science to create personalized therapeutic rituals.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      { icon: Sparkles, label: 'Hydrotherapy pools & herbal steam room' },
      { icon: Shield, label: 'Bespoke seaweed oil massage therapy' },
      { icon: Flame, label: 'Himalayan salt stone sauna rooms' },
      { icon: Compass, label: 'Sunset beachfront yoga & meditation decks' }
    ]
  },
  {
    id: 'dining',
    name: 'Fine Dining',
    title: 'Astral Michelin Gastronomy',
    desc: 'Embark on a culinary odyssey. Led by three-Michelin-starred Executive Chef Carlo Rossi, our signature restaurant serves custom sea-to-table tasting menus.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      { icon: Sparkles, label: '3-Michelin star tasting menu options' },
      { icon: GlassWater, label: 'Sommelier curated private wine vault' },
      { icon: Compass, label: 'Over-water private dining cabanas' },
      { icon: Flame, label: 'Live open-flame seafood charcoal grille' }
    ]
  },
  {
    id: 'yachts',
    name: 'Leisure & Yachting',
    title: 'Custom Coastal Expeditions',
    desc: 'Discover hidden coves, azure lagoons, and historic coastlines. Aurelia hosts an elite fleet of private yachts and sea vessels exclusively for guest charter.',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      { icon: Ship, label: 'Bespoke yachts with private skipper' },
      { icon: Compass, label: 'Snorkeling trips to private reef zones' },
      { icon: Shield, label: 'Deep sea fishing and scuba guidance' },
      { icon: Sparkles, label: 'Sunset champagne cruises' }
    ]
  }
];

export const Amenities = () => {
  const [activeTabId, setActiveTabId] = useState('spa');

  const activeTab = AMENITIES_DATA.find(tab => tab.id === activeTabId) || AMENITIES_DATA[0];

  return (
    <section id="experiences" className="amenities-section">
      <div className="rooms-header animate-fade-in" style={{ marginBottom: '20px' }}>
        <span className="section-tag">Curated Journeys</span>
        <h2 className="section-title">The Aurelia <span className="gold-text">Experiences</span></h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>
          Immerse yourself in luxury. Beyond our suites, Aurelia offers tailored wellness, culinary arts, and ocean exploration.
        </p>
      </div>

      {/* Tabs Header Navigation */}
      <div className="amenities-tabs-header animate-fade-in">
        {AMENITIES_DATA.map((tab) => (
          <button
            key={tab.id}
            className={`amenities-tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Body Content */}
      <div key={activeTab.id} className="amenity-content">
        <div className="amenity-text-box">
          <h3 className="amenity-title">{activeTab.title}</h3>
          <p className="amenity-desc">{activeTab.desc}</p>
          
          <div className="amenity-details-grid">
            {activeTab.highlights.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="amenity-detail-item">
                  <IconComp className="amenity-detail-icon" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <button className="gold-button" onClick={() => {
            const element = document.getElementById('rooms');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}>
            Experience Now
          </button>
        </div>

        <div>
          <img 
            src={activeTab.image} 
            alt={activeTab.title} 
            className="amenity-img" 
          />
        </div>
      </div>
    </section>
  );
};
export default Amenities;
