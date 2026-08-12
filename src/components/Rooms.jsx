import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Square, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="room-card animate-fade-in">
      {/* Room Image Slider */}
      <div className="room-card-media">
        <div className="room-image-container">
          <img 
            src={room.images[currentImageIndex]} 
            alt={room.name} 
            className="room-img" 
          />
        </div>
        
        {room.images.length > 1 && (
          <>
            <button className="room-nav-btn prev" onClick={handlePrevImage}>
              <ChevronLeft size={18} />
            </button>
            <button className="room-nav-btn next" onClick={handleNextImage}>
              <ChevronRight size={18} />
            </button>
          </>
        )}
        
        <span className="room-tag">{room.view}</span>
      </div>

      {/* Room Details */}
      <div className="room-info">
        <div className="room-meta">
          <div className="room-meta-item">
            <Square className="room-meta-icon" />
            <span>{room.size} SQ FT</span>
          </div>
          <div className="room-meta-item">
            <Users className="room-meta-icon" />
            <span>Up to {room.capacity} Guests</span>
          </div>
        </div>

        <h3 className="room-card-title">{room.name}</h3>
        <p className="room-description">{room.description}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px' }}>
          {room.amenities.slice(0, 3).map((amenity) => (
            <span 
              key={amenity} 
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '4px 10px',
                borderRadius: '4px'
              }}
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Card Footer */}
        <div className="room-footer">
          <div className="room-price-box">
            <span className="price-label">Price per night</span>
            <span className="price-value">
              ${room.price}
              <span> / night</span>
            </span>
          </div>
          <button className="gold-button" onClick={() => navigate('/book/' + room.id)}>
            Reserve Suite
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div 
    className="room-card" 
    style={{ 
      height: '520px', 
      animation: 'shimmer 2s infinite linear',
      background: 'linear-gradient(90deg, #18181b 25%, #242427 50%, #18181b 75%)',
      backgroundSize: '200% 100%',
      border: '1px solid rgba(255,255,255,0.02)'
    }}
  >
    <div style={{ height: '280px', backgroundColor: 'rgba(255,255,255,0.01)' }} />
    <div style={{ padding: '30px' }}>
      <div style={{ width: '40%', height: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', marginBottom: '15px' }} />
      <div style={{ width: '80%', height: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', marginBottom: '15px' }} />
      <div style={{ width: '95%', height: '14px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ width: '70%', height: '14px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', marginBottom: '30px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '32px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
        <div style={{ width: '120px', height: '40px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
      </div>
    </div>
  </div>
);

export const Rooms = ({ rooms, loadingRooms }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // Client-side category & query sub-filtering
  const filteredRooms = rooms.filter((room) => {
    const matchesCategory = filterType === 'all' || room.type === filterType;
    const matchesQuery = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.view.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Client-side sorting
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'popularity') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <section id="rooms" className="rooms-section">
      <div className="rooms-header animate-fade-in">
        <span className="section-tag">Elite Accommodation</span>
        <h2 className="section-title">Rooms & <span className="gold-text">Suites</span></h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>
          Explore our sanctuary. Each villa and penthouse features detailed high-end craftsmanship, bespoke Italian fittings, and dynamic ocean visuals.
        </p>
      </div>

      {/* Filter Categories */}
      <div className="room-filters animate-fade-in">
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Sanctuary
        </button>
        <button 
          className={`filter-btn ${filterType === 'ocean' ? 'active' : ''}`}
          onClick={() => setFilterType('ocean')}
        >
          Ocean Views
        </button>
        <button 
          className={`filter-btn ${filterType === 'pool' ? 'active' : ''}`}
          onClick={() => setFilterType('pool')}
        >
          Private Pools
        </button>
        <button 
          className={`filter-btn ${filterType === 'suite' ? 'active' : ''}`}
          onClick={() => setFilterType('suite')}
        >
          Exclusive Penthouses
        </button>
      </div>

      {/* Search & Sort Panel */}
      <div 
        className="glass-panel animate-fade-in"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          maxWidth: '1200px',
          margin: '30px auto',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid var(--gold-border)',
          boxShadow: 'var(--shadow-dark)'
        }}
      >
        {/* Search input field */}
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px', minWidth: '260px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--gold-primary)' 
            }} 
          />
          <input
            type="text"
            placeholder="Search suites (e.g. Overwater, Pool, Villa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 42px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--gold-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--gold-primary)';
              e.target.style.boxShadow = '0 0 0 4px rgba(97, 168, 193, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--gold-border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--gold-primary)' }} />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Sort By
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 24px 10px 14px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--gold-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="popularity" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>Best Rating</option>
            <option value="price-low" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>Price: Low to High</option>
            <option value="price-high" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid / Skeleton Loaders */}
      {loadingRooms ? (
        <div className="rooms-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : sortedRooms.length > 0 ? (
        <div className="rooms-grid">
          {sortedRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
            />
          ))}
        </div>
      ) : (
        <div 
          className="glass-panel" 
          style={{
            maxWidth: '600px',
            margin: '40px auto',
            padding: '40px',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center'
          }}
        >
          <h3 style={{ marginBottom: '15px', color: 'var(--gold-primary)' }}>No Suites Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            We could not find any available suites matching "{searchQuery}" under the selected category filters.
          </p>
          <button 
            className="gold-button"
            onClick={() => {
              setFilterType('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
export default Rooms;
