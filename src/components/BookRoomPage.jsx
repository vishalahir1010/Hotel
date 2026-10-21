import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { hotelApi, ROOMS_DATA, ADDONS_LIST } from '../api/hotelApi.js';
import { addDaysToDate, getDateOffset, getStayNights } from '../utils/bookingDates.js';
import { ArrowLeft, Sparkles, Check, CreditCard, Ticket, ChevronLeft, ArrowRight, CheckCircle2, Calendar, Users, Square, Compass } from 'lucide-react';

export const BookRoomPage = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Find the selected room
  const room = ROOMS_DATA.find((r) => r.id === roomId);

  // Fallback check if room is invalid
  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room, navigate]);

  // Hook-like local state for booking metrics
  const [checkIn, setCheckIn] = useState(() => location.state?.checkIn || getDateOffset(1));
  const [checkOut, setCheckOut] = useState(() => location.state?.checkOut || getDateOffset(4));
  const [guests, setGuests] = useState(() => {
    const requestedGuests = Number(location.state?.guests);
    return Number.isInteger(requestedGuests) && requestedGuests > 0 ? requestedGuests : 2;
  });
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [step, setStep] = useState(1);
  const [bookingRef, setBookingRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

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

  const nights = getStayNights(checkIn, checkOut);
  const validStay = nights > 0 && checkIn >= getDateOffset(0);
  const validGuestCount = Number.isInteger(guests) && guests > 0 && guests <= room.capacity;

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

  const isExpiryValid = () => {
    const match = /^(\d{2})\/(\d{2})$/.exec(form.cardExpiry);
    if (!match) return false;

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return false;

    const expiry = new Date(year, month, 0, 23, 59, 59);
    return expiry >= new Date();
  };

  const isFormValid = () => {
    return (
      validStay &&
      validGuestCount &&
      form.name.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.phone.replace(/\D/g, '').length >= 7 &&
      form.cardNumber.replace(/\s/g, '').length === 16 &&
      isExpiryValid() &&
      form.cardCvv.length >= 3 &&
      form.cardName.trim() !== ''
    );
  };

  const handleNextStep = async () => {
    if (step === 2) {
      if (!isFormValid() || submitting) return;

      setSubmitting(true);
      setBookingError('');
      try {
        const result = await hotelApi.createBooking({
          room_id: room.id,
          room_name: room.name,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          addons: selectedAddons,
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            requests: form.requests.trim()
          },
          total_price: totalPrice
        });

        if (!result.success || !result.booking_ref) {
          throw new Error(result.message || 'We could not confirm this reservation. Please try again.');
        }

        setBookingRef(result.booking_ref);
        setStep(3);
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : 'We could not confirm this reservation. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step === 1 && (!validStay || !validGuestCount)) return;
    setBookingError('');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
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
      {/* Premium Header - Light Theme */}
      <header className="booking-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/suites')} 
            className="outline-button"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back to Suites</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Compass size={22} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.08em', fontSize: '1.2rem', color: 'var(--text-primary)' }}>AURELIA</span>
          </div>
        </div>

        <div className="booking-steps-nav">
          <span className={step >= 1 ? 'gold-text' : ''} style={{ fontWeight: step === 1 ? 600 : 400 }}>1. Upgrade</span>
          <span style={{ color: 'var(--gold-border)' }}>&mdash;</span>
          <span className={step >= 2 ? 'gold-text' : ''} style={{ fontWeight: step === 2 ? 600 : 400 }}>2. Billing</span>
          <span style={{ color: 'var(--gold-border)' }}>&mdash;</span>
          <span className={step >= 3 ? 'gold-text' : ''} style={{ fontWeight: step === 3 ? 600 : 400 }}>3. Receipt</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="booking-split-container">
        {/* Left Side: Stay Summary and pricing details */}
        <aside className="booking-summary-sidebar">
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
                  min={getDateOffset(0)}
                  onChange={(e) => {
                    const nextCheckIn = e.target.value;
                    setCheckIn(nextCheckIn);
                    if (nextCheckIn && checkOut <= nextCheckIn) {
                      setCheckOut(addDaysToDate(nextCheckIn, 1));
                    }
                  }}
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
                  min={checkIn ? addDaysToDate(checkIn, 1) : getDateOffset(1)}
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
                  {Array.from({ length: Math.max(room.capacity, guests) }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count} style={{ backgroundColor: 'var(--bg-surface)' }}>
                      {count} Guest{count === 1 ? '' : 's'}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
              <Square size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>{room.size} SQ FT / {room.view}</span>
            </div>
          </div>

          {!validStay && (
            <p className="booking-inline-error" role="alert">
              Choose a check-out date after check-in and a date that is not in the past.
            </p>
          )}
          {!validGuestCount && (
            <p className="booking-inline-error" role="alert">
              This suite accommodates up to {room.capacity} guests. Change the guest count to continue.
            </p>
          )}

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

            <div className="summary-row total" style={{ borderTop: '1px solid var(--gold-border)', paddingTop: '15px', marginTop: '15px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Total Cost</span>
              <span className="gold-price" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-primary)' }}>${totalPrice}</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Animated Checkout Wizard forms */}
        <main className="booking-main-content">
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
                    <button
                      type="button"
                      key={addon.id}
                      className={`addon-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                      aria-pressed={isSelected}
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
                      </button>
                  );
                })}
              </div>

              {/* Step 1 Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                <button
                  className="gold-button"
                  onClick={() => void handleNextStep()}
                  disabled={!validStay || !validGuestCount}
                  style={{ padding: '14px 35px', opacity: validStay && validGuestCount ? 1 : 0.5 }}
                >
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
                Demo checkout only: no payment is processed. Use test details only; payment details are not sent with the reservation.
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
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="off"
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
                    inputMode="numeric"
                    autoComplete="off"
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
                    inputMode="numeric"
                    autoComplete="off"
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
                  onClick={() => void handleNextStep()}
                  disabled={!isFormValid() || submitting}
                  style={{ opacity: isFormValid() && !submitting ? 1 : 0.5, cursor: isFormValid() && !submitting ? 'pointer' : 'not-allowed' }}
                >
                  <CreditCard size={14} />
                  <span>{submitting ? 'Confirming Reservation...' : 'Confirm Suite Reservation'}</span>
                </button>
              </div>
              {bookingError && <p className="booking-inline-error" role="alert">{bookingError}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="ticket-wrapper">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '35px' }}>
                <CheckCircle2 size={56} style={{ color: 'var(--gold-primary)' }} className="animate-float" />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 300 }}>Sanctuary Secured</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Your reservation is confirmed in this demo. No payment was processed and no email was sent.
                </p>
              </div>

              {/* Demo booking receipt */}
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

                  <div className="ticket-note">
                    <span className="ticket-ref-val">Demo confirmation</span>
                    <span className="ticket-note-label">Not a valid travel document</span>
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
