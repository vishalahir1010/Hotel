import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROOMS_DATA, ADDONS_LIST } from '../api/hotelApi.js';
import { ArrowLeft, Sparkles, Check, CreditCard, Ticket, ChevronLeft, ArrowRight, CheckCircle2, Calendar, Users, Square, Compass } from 'lucide-react';

export const BookRoomPage = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Find the selected room
  const room = ROOMS_DATA.find((r) => r.id === roomId);

  // Fallback check if room is invalid
  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room, navigate]);

  // Hook-like local state for booking metrics
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  
  const [guests, setGuests] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [step, setStep] = useState(1);
  const [bookingRef, setBookingRef] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    requests: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name, email: user.email }));
    } else {
      setForm(prev => ({ ...prev, name: '', email: '' }));
    }
  }, [user]);

  if (!room) return null;

  // Nights calculation
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const nights = isNaN(calculatedNights) || calculatedNights <= 0 ? 1 : calculatedNights;

  // Recalculate invoice metrics
  const roomTotal = room.price * nights;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS_LIST.find(a => a.id === id);
    if (!addon) return sum;
    return sum + (addon.perNight ? addon.price * nights : addon.price);
  }, 0);
  const luxuryTax = Math.round((roomTotal + addonsTotal) * 0.12);
  const resortFee = 45 * nights;
  const totalPrice = roomTotal + addonsTotal + luxuryTax + resortFee;

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setForm(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setForm(prev => ({ ...prev, cardExpiry: value }));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setForm(prev => ({ ...prev, cardCvv: value }));
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== '' &&
      form.email.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.cardNumber.replace(/\s/g, '').length === 16 &&
      form.cardExpiry.length === 5 &&
      form.cardCvv.length >= 3 &&
      form.cardName.trim() !== ''
    );
  };

  const handleNextStep = () => {
    if (step === 2) {
      const ref = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderQRCode = () => {
    const dots = [];
    for (let i = 0; i < 36; i++) {
      const isBlack = (i % 3 === 0 && i % 2 === 0) || i === 0 || i === 5 || i === 30 || i === 35;
      dots.push(<div key={i} className={`qr-dot ${isBlack ? 'black' : ''}`} />);
    }
    return <div className="qr-placeholder">{dots}</div>;
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg-dark)', 
        color: 'var(--text-primary)', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Premium Header */}
      <header 
        style={{ 
          padding: '20px 40px', 
          borderBottom: '1px solid var(--gold-border)', 
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/')} 
            className="outline-button"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}
          >
            <ArrowLeft size={14} />
            <span>Suites</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Compass size={24} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.08em', fontSize: '1.2rem' }}>AURELIA</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span className={step >= 1 ? 'gold-text' : 'text-muted'} style={{ fontWeight: step === 1 ? 600 : 400 }}>1. Upgrade</span>
          <span style={{ color: 'var(--gold-border)' }}>&mdash;</span>
          <span className={step >= 2 ? 'gold-text' : 'text-muted'} style={{ fontWeight: step === 2 ? 600 : 400 }}>2. Billing</span>
          <span style={{ color: 'var(--gold-border)' }}>&mdash;</span>
          <span className={step >= 3 ? 'gold-text' : 'text-muted'} style={{ fontWeight: step === 3 ? 600 : 400 }}>3. Receipt</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div 
        style={{ 
          flexGrow: 1, 
          display: 'grid', 
          gridTemplateColumns: '45% 55%', 
          maxWidth: '1440px', 
          width: '100%',
          margin: '0 auto',
          position: 'relative'
        }}
        className="booking-split-container"
      >
        {/* Left Side: Stay Summary and pricing details */}
        <aside 
          style={{ 
            padding: '40px', 
            borderRight: '1px solid rgba(255,255,255,0.03)', 
            backgroundColor: 'rgba(255,255,255,0.01)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '30px',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}
          className="booking-summary-sidebar"
        >
          {/* Room visual card */}
          <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--gold-border)', position: 'relative', height: '220px' }}>
            <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', textAlign: 'left' }}>
              <span className="section-tag" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>Selected Suite</span>
              <h3 style={{ fontSize: '1.4rem' }}>{room.name}</h3>
            </div>
          </div>

          {/* Stay Customizer Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.65rem' }}>Check In</label>
              <div className="search-input-wrapper" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '8px 12px', background: 'var(--bg-card)' }}>
                <Calendar size={14} style={{ color: 'var(--gold-primary)' }} />
                <input 
                  type="date" 
                  value={checkIn}
                  disabled={step > 1}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.65rem' }}>Check Out</label>
              <div className="search-input-wrapper" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '8px 12px', background: 'var(--bg-card)' }}>
                <Calendar size={14} style={{ color: 'var(--gold-primary)' }} />
                <input 
                  type="date" 
                  value={checkOut}
                  disabled={step > 1}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Users size={16} style={{ color: 'var(--gold-primary)' }} />
              <span>
                Guests:{' '}
                <select 
                  value={guests} 
                  disabled={step > 1} 
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value={1} style={{ backgroundColor: 'var(--bg-surface)' }}>1 Guest</option>
                  <option value={2} style={{ backgroundColor: 'var(--bg-surface)' }}>2 Guests</option>
                  <option value={3} style={{ backgroundColor: 'var(--bg-surface)' }}>3 Guests</option>
                  <option value={4} style={{ backgroundColor: 'var(--bg-surface)' }}>4 Guests</option>
                  <option value={5} style={{ backgroundColor: 'var(--bg-surface)' }}>5+ Guests</option>
                </select>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
              <Square size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>{room.size} SQ FT / {room.view}</span>
            </div>
          </div>

          {/* Pricing Breakdown summary */}
          <div className="summary-card" style={{ margin: 0, border: '1px solid var(--gold-border)' }}>
            <h4 className="summary-title" style={{ color: 'var(--gold-primary)', fontSize: '0.8rem' }}>Stay Invoice Summary</h4>
            <div className="summary-row" style={{ fontSize: '0.8rem' }}>
              <span>Base Rate (${room.price} &times; {nights} nights)</span>
              <span>${roomTotal}</span>
            </div>
            
            {selectedAddons.length > 0 && (
              <div className="summary-row" style={{ fontSize: '0.8rem' }}>
                <span>Bespoke Luxury Addons</span>
                <span>+${addonsTotal}</span>
              </div>
            )}

            <div className="summary-row" style={{ fontSize: '0.8rem' }}>
              <span>Luxury Service Tax (12%)</span>
              <span>+${luxuryTax}</span>
            </div>

            <div className="summary-row" style={{ fontSize: '0.8rem' }}>
              <span>Resort Amenities Fee (${45} &times; {nights} nights)</span>
              <span>+${resortFee}</span>
            </div>

            <div className="summary-row total" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '15px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Total Cost</span>
              <span className="gold-price" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-primary)' }}>${totalPrice}</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Animated Checkout Wizard forms */}
        <main style={{ padding: '40px', overflowY: 'auto' }}>
          {step === 1 && (
            <div className="animate-fade-in" style={{ textAlign: 'left' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                Tailor Your <span className="gold-text">Experience</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
                Customize your stay with private helipad pickups, champagne on arrival, and bespoke wellness treatments designed for your absolute relaxation.
              </p>

              <div className="addon-list">
                {ADDONS_LIST.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <div 
                      key={addon.id}
                      className={`addon-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <div className="addon-info">
                        <div className="addon-icon-box">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h4 className="addon-title">{addon.name}</h4>
                          <p className="addon-desc">{addon.desc}</p>
                        </div>
                      </div>
                      <div className="addon-right">
                        <span className="addon-price">
                          +${addon.price}
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {addon.perNight ? ' / night' : ''}
                          </span>
                        </span>
                        <div className="addon-select-indicator">
                          {isSelected && <Check className="addon-select-icon" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                <button className="gold-button" onClick={handleNextStep} style={{ padding: '14px 35px' }}>
                  <span>Proceed to Billing</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in" style={{ textAlign: 'left' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                Billing & <span className="gold-text">Security</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
                Secure your suite. All payments are encrypted using bank-grade protocol security.
              </p>

              {/* Credit Card visual */}
              <div className="credit-card-wrapper" style={{ marginBottom: '40px' }}>
                <div className="credit-card">
                  <div className="card-top">
                    <div className="card-chip" />
                    <span className="card-type">AURELIA ELITE</span>
                  </div>
                  <div className="card-number">
                    {form.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-bottom">
                    <div className="card-meta-block">
                      <span className="card-meta-label">Card Holder</span>
                      <span className="card-meta-value">{form.cardName || 'YOUR NAME'}</span>
                    </div>
                    <div className="card-meta-block" style={{ alignItems: 'flex-end' }}>
                      <span className="card-meta-label">Expires</span>
                      <span className="card-meta-value">{form.cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Credentials Forms */}
              <div className="checkout-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Lord Alexander Mercer"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="alex@luxury.com"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+1 555 LUXURY"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Alexander Mercer"
                    value={form.cardName}
                    onChange={(e) => setForm(prev => ({ ...prev, cardName: e.target.value }))}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="4111 2222 3333 4444"
                    value={form.cardNumber}
                    onChange={handleCardNumberChange}
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="MM/YY"
                    value={form.cardExpiry}
                    onChange={handleExpiryChange}
                  />
                </div>
                <div className="form-group">
                  <label>Security Code (CVV)</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="•••"
                    value={form.cardCvv}
                    onChange={handleCvvChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Special Requests</label>
                  <textarea 
                    rows={3}
                    placeholder="Specify wine choices, room layout, dietary restrictions..."
                    value={form.requests}
                    onChange={(e) => setForm(prev => ({ ...prev, requests: e.target.value }))}
                  />
                </div>
              </div>

              {/* Step 2 Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="outline-button" onClick={handlePrevStep}>
                  <ChevronLeft size={14} />
                  <span>Addons</span>
                </button>
                <button 
                  className="gold-button" 
                  onClick={handleNextStep}
                  disabled={!isFormValid()}
                  style={{ opacity: isFormValid() ? 1 : 0.4, cursor: isFormValid() ? 'pointer' : 'not-allowed' }}
                >
                  <CreditCard size={14} />
                  <span>Confirm Suite Reservation</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ticket-wrapper">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '35px' }}>
                <CheckCircle2 size={56} style={{ color: 'var(--gold-primary)' }} className="animate-float" />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300 }}>Sanctuary Secured</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  A confirmation email has been dispatched. Present your VIP Boarding Pass at check-in.
                </p>
              </div>

              {/* Ticket Boarding Pass */}
              <div className="ticket">
                <div className="ticket-header">
                  <div className="ticket-brand">
                    <span className="ticket-brand-name">AURELIA</span>
                    <p className="ticket-brand-sub">Amalfi Coast Sanctuary</p>
                  </div>
                  <div className="ticket-ref">
                    <span className="ticket-ref-label">Booking Ref</span>
                    <p className="ticket-ref-val">{bookingRef}</p>
                  </div>
                </div>

                <div className="ticket-body">
                  <div className="ticket-details">
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Guest</span>
                      <span className="ticket-detail-val">{form.name}</span>
                    </div>
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Suite</span>
                      <span className="ticket-detail-val">{room.name}</span>
                    </div>
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Check In</span>
                      <span className="ticket-detail-val">{checkIn}</span>
                    </div>
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Check Out</span>
                      <span className="ticket-detail-val">{checkOut}</span>
                    </div>
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Nights</span>
                      <span className="ticket-detail-val">{nights} Night{nights > 1 ? 's' : ''}</span>
                    </div>
                    <div className="ticket-detail-group">
                      <span className="ticket-detail-label">Guests Count</span>
                      <span className="ticket-detail-val">{guests} Guest{guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="ticket-qr-section">
                    <div className="qr-code-box">
                      {renderQRCode()}
                    </div>
                    <span className="qr-label">VIP Boarding Pass</span>
                  </div>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <button className="gold-button" onClick={() => navigate('/')} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  <Ticket size={14} />
                  <span>Return to Home & Suites</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default BookRoomPage;
