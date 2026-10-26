import { formatLocalDate, getDateOffset, getStayNights } from '../utils/bookingDates.js';

export const ROOMS_DATA = [
  {
    id: 'azure-ocean',
    name: 'Azure Ocean Suite',
    type: 'ocean',
    price: 650,
    rating: 4.9,
    size: 850,
    capacity: 2,
    view: 'Unobstructed Ocean View',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unwind in absolute luxury with floor-to-ceiling glass doors opening onto a private white marble terrace overlooking the sparkling Mediterranean waves.',
    amenities: ['Private Balcony', 'Marble Bath', 'King Bed', 'Espresso Bar', 'Sommelier Selection'],
    badge: null
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon Pavillion',
    type: 'ocean',
    price: 780,
    rating: 4.88,
    size: 980,
    capacity: 3,
    view: 'West-Facing Sunset View',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bask in golden hour views from your personal outdoor jacuzzi. Features integrated luxury automation and bespoke teak wood furniture.',
    amenities: ['Outdoor Jacuzzi', 'Teak Terrace', 'Automated Blinds', 'King Bed', 'Rain Shower'],
    badge: null
  },
  {
    id: 'panoramic-vista',
    name: 'Panoramic Vista Suite',
    type: 'ocean',
    price: 590,
    rating: 4.82,
    size: 780,
    capacity: 2,
    view: 'High-Altitude Bay View',
    badge: 'Best Value',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Perched high on the resort cliffs, this suite offers a dramatic birds-eye view of the entire coastline and historic cliffside villages.',
    amenities: ['Glass Fireplace', 'Premium Binoculars', 'Walk-in Wardrobe', 'Mini Library', 'Plush Linens']
  },
  {
    id: 'infinity-pool-villa',
    name: 'Infinity Pool Villa',
    type: 'pool',
    price: 950,
    rating: 4.95,
    size: 1250,
    capacity: 3,
    view: 'Panoramic Cliff & Ocean View',
    badge: 'Most Popular',
    images: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enjoy a premium sanctuary featuring a private gold-tiled heated infinity pool, outdoor sunken fire pit lounge, and 24/7 personal butler service.',
    amenities: ['Private Infinity Pool', 'Butler Service', 'Sunken Fire Pit', 'Outdoor Shower', 'iPad Controls']
  },
  {
    id: 'royal-sanctuary',
    name: 'Royal Sanctuary Villa',
    type: 'pool',
    price: 2400,
    rating: 5.0,
    size: 3100,
    capacity: 6,
    view: 'Private Cove & Beach View',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tucked away in a private cove, featuring a private white sand beach strip, private cinema room, personal chef, and independent spa treatment salon.',
    amenities: ['Private Beach Strip', 'Cinema Room', 'In-Villa Spa Room', 'Personal Chef', 'Secured Compound'],
    badge: null
  },
  {
    id: 'overwater-palace',
    name: 'Presidential Overwater Palace',
    type: 'pool',
    price: 3200,
    rating: 5.0,
    size: 4200,
    capacity: 8,
    view: 'Full Marine Lagoon Access',
    badge: 'Signature',
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Constructed directly over our emerald lagoon. Features glass floor viewports, a massive overwater split-level deck, water slide, and private boat dock.',
    amenities: ['Glass Floor Viewport', 'Water Slide', 'Private Boat Dock', 'Gym & Sauna', '24/7 Concierge']
  },
  {
    id: 'aurelia-penthouse',
    name: 'The Aurelia Penthouse',
    type: 'suite',
    price: 1850,
    rating: 5.0,
    size: 2200,
    capacity: 4,
    view: '360° Coastal & Sky View',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The absolute pinnacle of luxury. A magnificent duplex penthouse featuring a private rooftop jacuzzi, executive dining salon, and baby grand piano.',
    amenities: ['Rooftop Jacuzzi', 'Baby Grand Piano', 'Helicopter Transfer', 'Duplex Design', 'VIP Club Access'],
    badge: null
  },
  {
    id: 'serene-garden-suite',
    name: 'Serene Garden Suite',
    type: 'suite',
    price: 520,
    rating: 4.79,
    size: 810,
    capacity: 2,
    view: 'Botanical Sanctuary View',
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Nestled deep within the resort\'s private botanical gardens, surrounded by fragrant jasmine and waterfalls. Ideal for ultimate privacy and peace.',
    amenities: ['Private Hammock Garden', 'Outdoor Bathtub', 'Fresh Flowers Daily', 'King Bed', 'Herbal Teabar']
  },
  {
    id: 'moonlit-cove-residence',
    name: 'Moonlit Cove Residence',
    type: 'ocean',
    price: 1180,
    rating: 4.96,
    size: 1520,
    capacity: 4,
    view: 'Crystal Cove & Twilight Horizon',
    badge: 'Limited Release',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed for moonlit escapes, this residence pairs panoramic sea views with a stone plunge bath, fire lounge, and private sunrise breakfast deck.',
    amenities: ['Stone Plunge Bath', 'Sunrise Deck', 'Fire Lounge', 'Private Butler', 'Curated Mini Bar']
  },
  {
    id: 'azure-terrace-villa',
    name: 'Azure Terrace Villa',
    type: 'pool',
    price: 1650,
    rating: 4.98,
    size: 2100,
    capacity: 5,
    view: 'Infinity Pool & Coastal Terrace',
    badge: 'Family Favorite',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A spacious villa with a sculpted courtyard, hidden plunge pool, and an alfresco dining terrace for long, elegant evenings under the stars.',
    amenities: ['Private Courtyard', 'Plunge Pool', 'Outdoor Dining', 'Family Lounge', 'Wellness Room']
  },
  {
    id: 'skyline-duplex-penthouse',
    name: 'Skyline Duplex Penthouse',
    type: 'suite',
    price: 2100,
    rating: 5.0,
    size: 2600,
    capacity: 6,
    view: '360° Sunset & Marina View',
    badge: 'Ultra Luxe',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The ultimate sky-high stay with a grand staircase, rooftop lounge, glass-railed terrace, and private concierge for personalised island experiences.',
    amenities: ['Rooftop Lounge', 'Private Concierge', 'Glass Terrace', 'Grand Staircase', 'Lock-off Suite']
  }
];

export const MAX_ROOM_CAPACITY = Math.max(...ROOMS_DATA.map(room => room.capacity));

export const ADDONS_LIST = [
  { id: 'champagne', name: 'Champagne on Arrival', price: 95, desc: 'A chilled bottle of Dom Pérignon waiting in your suite.', perNight: false },
  { id: 'spa', name: 'Unlimited Spa Access', price: 150, desc: 'Full therapeutic massage treatments and sensory wellness therapy.', perNight: true },
  { id: 'yacht', name: 'Private Yacht Charter (4 hrs)', price: 1200, desc: 'Sunset cruise along the pristine coastline with private skipper.', perNight: false },
  { id: 'transfer', name: 'Helicopter Airport Transfer', price: 650, desc: 'Luxury aerial transport straight to the resort private helipad.', perNight: false },
  { id: 'chef', name: 'In-Suite Private Chef (Dinner)', price: 350, desc: 'Personal Michelin-star chef cooking a customized multi-course meal.', perNight: false }
];

const BOOKINGS_KEY = 'aurelia_bookings';
const REVIEWS_KEY = 'aurelia_reviews';
const SAVED_ROOMS_KEY = 'aurelia_saved_rooms';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAYMENT_METHODS = new Set(['demo-card', 'pay-at-property']);

const readStoredList = (key, label) => {
  try {
    const raw = globalThis.localStorage.getItem(key);
    if (!raw) return [];

    const value = JSON.parse(raw);
    if (!Array.isArray(value)) throw new Error(`Stored ${label} data is invalid.`);
    return value;
  } catch (error) {
    console.error(`Failed to read ${label} from local storage.`, error);
    throw new Error(`Unable to access saved ${label}. Please check browser storage and try again.`);
  }
};

const saveStoredList = (key, value, label) => {
  try {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${label} to local storage.`, error);
    throw new Error(`Unable to save ${label}. Please check available browser storage and try again.`);
  }
};

const notifyChange = (key) => {
  if (typeof globalThis.window === 'undefined') return;

  globalThis.window.dispatchEvent(new CustomEvent('aurelia-api-change', { detail: { key } }));
  if (key === BOOKINGS_KEY) globalThis.window.dispatchEvent(new Event('aurelia-bookings-changed'));
};

const datesOverlap = (firstStart, firstEnd, secondStart, secondEnd) =>
  firstStart < secondEnd && secondStart < firstEnd;

const normalizeEmail = (email) => {
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    throw new Error('Enter a valid guest email address.');
  }
  return email.trim().toLowerCase();
};

const validateStay = (checkIn, checkOut) => {
  if (
    typeof checkIn !== 'string' ||
    typeof checkOut !== 'string' ||
    getStayNights(checkIn, checkOut) < 1 ||
    checkIn < getDateOffset(0)
  ) {
    throw new Error('Choose a future check-in date and a check-out date at least one night later.');
  }
};

const getRoomBookingTotal = (room, nights, addonIds) => {
  const addons = addonIds.map(id => ADDONS_LIST.find(addon => addon.id === id));
  if (addons.some(addon => !addon)) {
    throw new Error('One or more selected extras are not available. Please update your selection.');
  }

  const roomTotal = room.price * nights;
  const addonsTotal = addons.reduce(
    (total, addon) => total + addon.price * (addon.perNight ? nights : 1),
    0
  );
  const luxuryTax = Math.round((roomTotal + addonsTotal) * 0.12);
  const resortFee = 45 * nights;
  return {
    roomTotal,
    addonsTotal,
    luxuryTax,
    resortFee,
    totalPrice: roomTotal + addonsTotal + luxuryTax + resortFee
  };
};

const cloneRoom = (room) => ({
  ...room,
  images: [...room.images],
  amenities: [...room.amenities]
});

const createBookingReference = (bookings) => {
  let reference;
  do {
    const bytes = new Uint32Array(1);
    globalThis.crypto?.getRandomValues?.(bytes);
    const random = bytes[0] ? bytes[0] / 2 ** 32 : Math.random();
    reference = `AUR-${Math.floor(100000 + random * 900000)}`;
  } while (bookings.some(booking => booking.booking_ref === reference));
  return reference;
};

const getSavedRoomIds = () => {
  const ids = readStoredList(SAVED_ROOMS_KEY, 'saved suites');
  return [...new Set(ids.filter(id => ROOMS_DATA.some(room => room.id === id)))];
};

export const hotelApi = {
  getRooms: async (filters) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const { guests, roomType, checkIn, checkOut } = filters || {};
    if (guests !== undefined && (!Number.isInteger(guests) || guests < 1 || guests > MAX_ROOM_CAPACITY)) {
      throw new Error(`Choose a guest count between 1 and ${MAX_ROOM_CAPACITY}.`);
    }
    if (roomType !== undefined && roomType !== 'all' && !['ocean', 'pool', 'suite'].includes(roomType)) {
      throw new Error('Choose a valid suite type.');
    }
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      throw new Error('Provide both check-in and check-out dates to check availability.');
    }
    if (checkIn && checkOut) validateStay(checkIn, checkOut);

    const bookings = readStoredList(BOOKINGS_KEY, 'bookings');
    return ROOMS_DATA
      .filter(room => guests === undefined || room.capacity >= guests)
      .filter(room => !roomType || roomType === 'all' || room.type === roomType)
      .filter(room => !checkIn || !bookings.some(booking =>
        booking.room_id === room.id &&
        booking.status === 'confirmed' &&
        datesOverlap(checkIn, checkOut, booking.check_in, booking.check_out)
      ))
      .map(cloneRoom);
  },

  getAvailability: async (filters) => {
    if (!filters?.checkIn || !filters?.checkOut) {
      throw new Error('Select check-in and check-out dates to check suite availability.');
    }
    const rooms = await hotelApi.getRooms(filters);
    return {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests ?? 1,
      availableRooms: rooms,
      availableCount: rooms.length
    };
  },

  getRoom: (roomId) => {
    const room = ROOMS_DATA.find(item => item.id === roomId);
    return room ? cloneRoom(room) : null;
  },

  getAllRooms: () => ROOMS_DATA.map(cloneRoom),

  getAddons: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return ADDONS_LIST.map(addon => ({ ...addon }));
  },

  getSavedRoomIds,

  toggleSavedRoom: (roomId) => {
    if (!ROOMS_DATA.some(room => room.id === roomId)) {
      throw new Error('That suite could not be found.');
    }
    const currentIds = getSavedRoomIds();
    const nextIds = currentIds.includes(roomId)
      ? currentIds.filter(id => id !== roomId)
      : [...currentIds, roomId];
    saveStoredList(SAVED_ROOMS_KEY, nextIds, 'saved suites');
    notifyChange(SAVED_ROOMS_KEY);
    return nextIds;
  },

  subscribe: (listener) => {
    if (typeof globalThis.window === 'undefined') return () => {};

    const handleCustomChange = (event) => listener(event.detail?.key);
    const handleStorageChange = (event) => {
      if ([BOOKINGS_KEY, REVIEWS_KEY, SAVED_ROOMS_KEY].includes(event.key)) listener(event.key);
    };
    globalThis.window.addEventListener('aurelia-api-change', handleCustomChange);
    globalThis.window.addEventListener('storage', handleStorageChange);

    return () => {
      globalThis.window.removeEventListener('aurelia-api-change', handleCustomChange);
      globalThis.window.removeEventListener('storage', handleStorageChange);
    };
  },

  createBooking: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!bookingData || typeof bookingData !== 'object') {
      throw new Error('Booking details are missing.');
    }
    const bookings = readStoredList(BOOKINGS_KEY, 'bookings');
    const room = ROOMS_DATA.find(item => item.id === bookingData.room_id);
    const nights = getStayNights(bookingData.check_in, bookingData.check_out);
    const customer = bookingData.customer;
    const guestEmail = typeof customer?.email === 'string' ? customer.email.trim() : '';
    if (
      !room ||
      getStayNights(bookingData.check_in, bookingData.check_out) < 1 ||
      typeof bookingData.check_in !== 'string' ||
      typeof bookingData.check_out !== 'string' ||
      bookingData.check_in < getDateOffset(0) ||
      typeof customer?.name !== 'string' ||
      !customer.name.trim() ||
      !EMAIL_PATTERN.test(guestEmail) ||
      typeof customer.phone !== 'string' ||
      customer.phone.replace(/\D/g, '').length < 7
    ) {
      throw new Error('Booking details are incomplete. Please review your stay and guest information.');
    }

    if (!Number.isInteger(bookingData.guests) || bookingData.guests < 1 || bookingData.guests > room.capacity) {
      throw new Error(`This suite accommodates up to ${room.capacity} guests.`);
    }
    if (!PAYMENT_METHODS.has(bookingData.payment_method)) {
      throw new Error('Select a supported demo payment option to continue.');
    }
    validateStay(bookingData.check_in, bookingData.check_out);
    if (bookingData.addons !== undefined && !Array.isArray(bookingData.addons)) {
      throw new Error('Selected extras are invalid. Please update your selection.');
    }
    const addonIds = [...new Set(bookingData.addons || [])];
    const billing = getRoomBookingTotal(room, nights, addonIds);
    if (bookingData.total_price !== billing.totalPrice) {
      throw new Error('The booking total has changed. Review the price summary and try again.');
    }

    if (bookings.some(booking =>
      booking.room_id === room.id &&
      booking.status === 'confirmed' &&
      datesOverlap(bookingData.check_in, bookingData.check_out, booking.check_in, booking.check_out)
    )) {
      throw new Error('This suite is no longer available for those dates. Please choose another stay.');
    }

    const ref = createBookingReference(bookings);
    const booking = {
      room_id: room.id,
      room_name: room.name,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      guests: bookingData.guests,
      addons: addonIds,
      billing,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        requests: typeof customer.requests === 'string' ? customer.requests.trim().slice(0, 1000) : ''
      },
      payment_method: bookingData.payment_method,
      total_price: billing.totalPrice,
      booking_ref: ref,
      status: 'confirmed',
      payment_status: 'demo_not_processed',
      created_at: new Date().toISOString()
    };
    saveStoredList(BOOKINGS_KEY, [...bookings, booking], 'booking');
    notifyChange(BOOKINGS_KEY);
    return {
      success: true,
      booking_ref: ref,
      total_price: billing.totalPrice,
      message: 'Demo reservation saved. No payment was processed.'
    };
  },

  getBookings: async (email = '') => {
    const bookings = readStoredList(BOOKINGS_KEY, 'bookings');
    const normalizedEmail = normalizeEmail(email);
    return bookings
      .filter(booking => booking.customer?.email?.toLowerCase() === normalizedEmail)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getBooking: async (ref, email) => {
    if (typeof ref !== 'string' || !ref.trim()) throw new Error('A booking reference is required.');
    const normalizedEmail = normalizeEmail(email);
    const booking = readStoredList(BOOKINGS_KEY, 'bookings').find(item =>
      item.booking_ref === ref.trim() &&
      item.customer?.email?.toLowerCase() === normalizedEmail
    );
    return booking || null;
  },

  cancelBooking: async (ref, email) => {
    if (typeof ref !== 'string' || !ref.trim()) throw new Error('A booking reference is required.');
    const normalizedEmail = normalizeEmail(email);
    const bookings = readStoredList(BOOKINGS_KEY, 'bookings');
    const bookingIndex = bookings.findIndex(booking =>
      booking.booking_ref === ref.trim() &&
      booking.customer?.email?.toLowerCase() === normalizedEmail
    );
    if (bookingIndex === -1) throw new Error('Reservation not found for this guest email.');

    const booking = bookings[bookingIndex];
    if (booking.status !== 'confirmed') throw new Error('This reservation is already cancelled.');
    if (booking.check_in <= formatLocalDate(new Date())) {
      throw new Error('Reservations can only be cancelled before check-in.');
    }

    bookings[bookingIndex] = { ...booking, status: 'cancelled', cancelled_at: new Date().toISOString() };
    saveStoredList(BOOKINGS_KEY, bookings, 'booking');
    notifyChange(BOOKINGS_KEY);
    return { success: true, message: 'Reservation cancelled successfully.' };
  },

  getReviews: async (roomId) => {
    if (roomId && !ROOMS_DATA.some(room => room.id === roomId)) {
      throw new Error('That suite could not be found.');
    }
    const reviews = readStoredList(REVIEWS_KEY, 'reviews');
    return reviews
      .filter(review => !roomId || review.room_id === roomId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createReview: async (reviewData) => {
    if (!reviewData || typeof reviewData !== 'object') throw new Error('Review details are required.');
    const { bookingRef, email, rating, comment } = reviewData;
    const normalizedEmail = normalizeEmail(email);
    if (typeof bookingRef !== 'string' || !bookingRef.trim()) {
      throw new Error('A booking reference is required to leave a review.');
    }
    const bookings = readStoredList(BOOKINGS_KEY, 'bookings');
    const booking = bookings.find(item =>
      item.booking_ref === bookingRef.trim() &&
      item.customer?.email?.toLowerCase() === normalizedEmail &&
      item.status === 'confirmed'
    );
    if (!booking) throw new Error('A confirmed reservation is required to leave a review.');
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Choose a rating between 1 and 5 stars.');
    }
    if (typeof comment !== 'string' || !comment.trim()) throw new Error('Please add a short comment to your review.');

    const reviews = readStoredList(REVIEWS_KEY, 'reviews');
    if (reviews.some(review => review.booking_ref === bookingRef.trim())) {
      throw new Error('A review has already been submitted for this reservation.');
    }

    const review = {
      booking_ref: bookingRef.trim(),
      room_id: booking.room_id,
      room_name: booking.room_name,
      name: booking.customer.name,
      rating,
      comment: comment.trim().slice(0, 500),
      created_at: new Date().toISOString()
    };
    saveStoredList(REVIEWS_KEY, [...reviews, review], 'review');
    notifyChange(REVIEWS_KEY);
    return review;
  }
};
