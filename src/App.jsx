import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { About } from './components/About.jsx';
import { Rooms } from './components/Rooms.jsx';
import { Amenities } from './components/Amenities.jsx';
import { Testimonials } from './components/Testimonials.jsx';
import { FAQ } from './components/FAQ.jsx';
import { Footer } from './components/Footer.jsx';
import { PremiumLoader } from './components/PremiumLoader.jsx';
import { BookRoomPage } from './components/BookRoomPage.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { useBooking } from './hooks/useBooking.js';
import { useAuth } from './hooks/useAuth.js';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [prevUser, setPrevUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Custom states from booking and auth hooks
  const booking = useBooking();
  const auth = useAuth();

  const {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    guests, setGuests,
    roomType, setRoomType,
    activeFilters,
    handleSearchSubmit,
    rooms,
    loadingRooms,
    selectedRoom,
    setForm
  } = booking;

  // Check if we are on the focused booking page
  const isBookingPage = location.pathname.startsWith('/book');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isFullscreenPage = isBookingPage || isAdminPage;

  // Helper to trigger toast alerts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toast clearing timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Monitor auth sessions to display welcome toasts
  useEffect(() => {
    if (auth.user && !prevUser) {
      showToast(`Welcome back, ${auth.user.name}. Your VIP guest profile is active.`, 'success');
    }
    setPrevUser(auth.user);
  }, [auth.user, prevUser]);

  // Wrap logout to trigger secure toast
  const handleLogout = () => {
    auth.logout();
    showToast('You have securely signed out of your session.', 'info');
  };

  // Auto-fill checkout form details if the user is authenticated
  useEffect(() => {
    if (auth.user) {
      setForm((prev) => ({
        ...prev,
        name: auth.user.name,
        email: auth.user.email
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        name: '',
        email: ''
      }));
    }
  }, [auth.user, selectedRoom, setForm]);

  // Floating Navbar CTA click selection
  const handleNavBookClick = () => {
    navigate('/book/azure-ocean');
  };

  const handleSearch = () => {
    handleSearchSubmit();
    navigate('/suites');
  };

  // Home Page Component
  const Home = () => (
    <>
      <Hero
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        roomType={roomType}
        setRoomType={setRoomType}
        onSearch={handleSearch}
      />
      
      {/* Intro section */}
      <section style={{ padding: '100px 40px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span className="section-tag">Aurelia Sanctum</span>
        <h2 className="section-title">The Art of <span className="gold-text">Luxury Living</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginTop: '20px' }}>
          Tucked away on the Amalfi cliffs, Aurelia is a private paradise designed exclusively for those who appreciate the finer things. Explore our tailored suite list, fine dining, and cliffside infinity pools.
        </p>
        <button 
          className="gold-button" 
          onClick={() => navigate('/suites')}
          style={{ marginTop: '35px' }}
        >
          View Suites & Villas
        </button>
      </section>

      <Testimonials />
    </>
  );

  return (
    <>
      {/* Intro Luxury Entry Animation Loader */}
      <PremiumLoader onFinished={() => setLoading(false)} />
      
      {!loading && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Scroll reset utility */}
          <ScrollToTop />

          {/* Header Navigation (rendered globally, except on booking page) */}
          {!isFullscreenPage && (
            <Navbar 
              onBookClick={handleNavBookClick} 
              user={auth.user}
              onSignInClick={() => { auth.setAuthStep('login'); setAuthModalOpen(true); }}
              onLogout={handleLogout}
            />
          )}

          {/* Core Page Router Viewport */}
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />

              {/* About Page */}
              <Route path="/about" element={<About />} />

              {/* Suites Listing Page */}
              <Route path="/suites" element={
                <Rooms 
                  rooms={rooms}
                  loadingRooms={loadingRooms}
                  activeFilters={activeFilters} 
                />
              } />

              {/* Experiences Page */}
              <Route path="/experiences" element={<Amenities />} />

              {/* FAQ Page */}
              <Route path="/faq" element={<FAQ />} />
              
              {/* Dedicated Booking Page */}
              <Route path="/book/:roomId" element={<BookRoomPage user={auth.user} />} />

              {/* Admin Panel */}
              <Route path="/admin/*" element={<AdminPanel user={auth.user} auth={auth} />} />
            </Routes>
          </main>

          {/* Footer Grid (except on booking page) */}
          {!isFullscreenPage && <Footer />}

          {/* Authentication Modal (Sign In / Sign Up / Forgot Password) */}
          <AuthModal 
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            auth={auth}
          />

          {/* Gold Accented Toast Notification popup */}
          {toast && (
            <div 
              className="glass-panel"
              style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                padding: '16px 24px',
                borderRadius: '4px',
                border: '1px solid var(--gold-primary)',
                boxShadow: 'var(--shadow-dark), var(--shadow-gold)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                maxWidth: '380px',
                animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Pulsing indicator */}
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gold-primary)',
                  animation: 'pulse 1.5s infinite'
                }} 
              />
              <div style={{ textAlign: 'left' }}>
                <span 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.65rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.12em', 
                    color: 'var(--gold-primary)', 
                    fontWeight: 600, 
                    marginBottom: '2px' 
                  }}
                >
                  Aurelia Notification
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {toast.message}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
