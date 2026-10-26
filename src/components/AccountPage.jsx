import { useEffect, useState } from 'react';
import { CalendarDays, Star, XCircle } from 'lucide-react';
import { hotelApi, ROOMS_DATA } from '../api/hotelApi.js';

export const AccountPage = ({ user }) => {
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [searchEmail, setSearchEmail] = useState(user?.email || '');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    setEmailInput(user.email);
    setSearchEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!searchEmail) return;

    let isCurrentRequest = true;
    setLoading(true);
    setError('');
    Promise.all([hotelApi.getBookings(searchEmail), hotelApi.getReviews()])
      .then(([storedBookings, storedReviews]) => {
        if (!isCurrentRequest) return;
        setBookings(storedBookings);
        setReviews(storedReviews);
      })
      .catch((loadError) => {
        console.error('Failed to load account reservations.', loadError);
        if (isCurrentRequest) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load your reservations.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [searchEmail]);

  const handleSearch = (event) => {
    event.preventDefault();
    const email = emailInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email to find reservations saved in this browser.');
      return;
    }
    setError('');
    setNotice('');
    setSearchEmail(email);
  };

  const handleCancel = async (booking) => {
    if (!window.confirm(`Cancel reservation ${booking.booking_ref}? This demo cancellation cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      await hotelApi.cancelBooking(booking.booking_ref, searchEmail);
      setBookings(await hotelApi.getBookings(searchEmail));
      setNotice(`Reservation ${booking.booking_ref} has been cancelled.`);
    } catch (cancelError) {
      console.error('Failed to cancel reservation.', cancelError);
      setError(cancelError instanceof Error ? cancelError.message : 'Could not cancel this reservation.');
    }
  };

  const handleReview = async (event, booking) => {
    event.preventDefault();
    const draft = drafts[booking.booking_ref] || { rating: 5, comment: '' };
    setError('');
    setNotice('');
    try {
      await hotelApi.createReview({
        bookingRef: booking.booking_ref,
        email: searchEmail,
        rating: Number(draft.rating),
        comment: draft.comment
      });
      setReviews(await hotelApi.getReviews());
      setNotice('Thank you. Your guest review has been added.');
    } catch (reviewError) {
      console.error('Failed to submit guest review.', reviewError);
      setError(reviewError instanceof Error ? reviewError.message : 'Could not submit your review.');
    }
  };

  const reviewedBookings = new Set(reviews.map(review => review.booking_ref));

  return (
    <section className="account-page">
      <header className="account-heading">
        <span className="section-tag">Your Aurelia Stay</span>
        <h1 className="section-title">{user ? `Welcome, ${user.name.split(' ')[0]}` : 'My Bookings'}</h1>
        <p>View, manage, and review reservations saved on this device.</p>
      </header>

      {!user && (
        <form className="booking-lookup glass-panel" onSubmit={handleSearch}>
          <label htmlFor="booking-email">Guest email used for your reservation</label>
          <div>
            <input
              id="booking-email"
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button className="gold-button" type="submit">Find bookings</button>
          </div>
        </form>
      )}

      {user && (
        <div className="account-profile glass-panel">
          <span className="account-avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div><strong>{user.name}</strong><span>{user.email}</span></div>
          <span className="account-profile-label">Guest profile</span>
        </div>
      )}

      {error && <p className="account-message error" role="alert">{error}</p>}
      {notice && <p className="account-message success" role="status">{notice}</p>}
      {loading && <p className="account-empty">Loading your reservations…</p>}
      {!loading && searchEmail && !error && bookings.length === 0 && (
        <div className="account-empty glass-panel">
          <CalendarDays size={28} />
          <h2>No bookings found</h2>
          <p>Reservations created in this browser with this email will appear here.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="account-booking-list">
          {bookings.map(booking => {
            const room = ROOMS_DATA.find(item => item.id === booking.room_id);
            const canCancel = booking.status === 'confirmed' &&
              booking.check_in > new Date().toISOString().slice(0, 10);
            const canReview = booking.status === 'confirmed' && !reviewedBookings.has(booking.booking_ref);
            const draft = drafts[booking.booking_ref] || { rating: 5, comment: '' };

            return (
              <article className="account-booking-card glass-panel" key={booking.booking_ref}>
                <img src={room?.images[0]} alt={booking.room_name} />
                <div className="account-booking-content">
                  <div className="account-booking-topline">
                    <div>
                      <span className="ticket-ref-label">Booking {booking.booking_ref}</span>
                      <h2>{booking.room_name}</h2>
                    </div>
                    <span className={`account-status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <p className="account-booking-dates">
                    {booking.check_in} — {booking.check_out} · {booking.guests} guest{booking.guests === 1 ? '' : 's'}
                  </p>
                  <p className="account-booking-payment">
                    ${booking.total_price} · Demo payment — no charge processed
                  </p>

                  {canCancel && (
                    <button className="outline-button account-cancel" onClick={() => void handleCancel(booking)}>
                      <XCircle size={16} /> Cancel reservation
                    </button>
                  )}
                  {booking.status === 'cancelled' && (
                    <p className="account-muted">This reservation was cancelled.</p>
                  )}

                  {canReview && (
                    <form className="account-review-form" onSubmit={(event) => void handleReview(event, booking)}>
                      <label htmlFor={`rating-${booking.booking_ref}`}>Rate this stay</label>
                      <div className="account-review-controls">
                        <select
                          id={`rating-${booking.booking_ref}`}
                          value={draft.rating}
                          onChange={(event) => setDrafts(current => ({
                            ...current,
                            [booking.booking_ref]: { ...draft, rating: event.target.value }
                          }))}
                        >
                          {[5, 4, 3, 2, 1].map(rating => (
                            <option value={rating} key={rating}>{rating} star{rating === 1 ? '' : 's'}</option>
                          ))}
                        </select>
                        <Star size={17} fill="var(--gold-primary)" color="var(--gold-primary)" />
                        <textarea
                          value={draft.comment}
                          onChange={(event) => setDrafts(current => ({
                            ...current,
                            [booking.booking_ref]: { ...draft, comment: event.target.value }
                          }))}
                          maxLength={500}
                          placeholder="Share a few words about your stay"
                          required
                        />
                        <button className="gold-button" type="submit">Post review</button>
                      </div>
                    </form>
                  )}
                  {reviewedBookings.has(booking.booking_ref) && (
                    <p className="account-muted">Review submitted — thank you for sharing your stay.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="account-demo-note">
        Demo mode: bookings and reviews are stored only in this browser and are not available to the hotel or other devices.
      </p>
    </section>
  );
};

export default AccountPage;
