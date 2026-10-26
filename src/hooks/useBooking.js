import { useState, useEffect } from "react";
import { hotelApi } from "../api/hotelApi.js";
import { getDateOffset, getStayNights } from "../utils/bookingDates.js";

export const useBooking = () => {
  // Search parameters
  const [checkIn, setCheckIn] = useState(() => getDateOffset(1));
  const [checkOut, setCheckOut] = useState(() => getDateOffset(4));
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("all");

  // Confirmed search parameters (after search click)
  const [activeFilters, setActiveFilters] = useState({
    checkIn: getDateOffset(1),
    checkOut: getDateOffset(4),
    guests: 2,
    roomType: "all",
  });

  // API database states
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState('');
  const [roomRequestKey, setRoomRequestKey] = useState(0);
  const [addons, setAddons] = useState([]);
  const [loadingAddons, setLoadingAddons] = useState(true);

  // Selected room for checkout
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Custom booking addons
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Wizard steps: 1 = Addons, 2 = Form & Card, 3 = Ticket Receipt
  const [bookingStep, setBookingStep] = useState(1);

  // Checkout inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requests: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  // Booking Reference number
  const [bookingRef, setBookingRef] = useState("");

  // Fetch addons on init
  useEffect(() => {
    const loadAddons = async () => {
      setLoadingAddons(true);
      try {
        const data = await hotelApi.getAddons();
        setAddons(data);
      } catch (err) {
        console.error("Failed to load addons", err);
      } finally {
        setLoadingAddons(false);
      }
    };
    loadAddons();
  }, []);

  // Fetch rooms on any active filter changes
  useEffect(() => {
    let isCurrentRequest = true;
    const loadRooms = async () => {
      setLoadingRooms(true);
      setRoomsError('');
      try {
        const data = await hotelApi.getRooms({
          guests: activeFilters.guests,
          roomType: activeFilters.roomType,
          checkIn: activeFilters.checkIn,
          checkOut: activeFilters.checkOut,
        });
        if (isCurrentRequest) setRooms(data);
      } catch (err) {
        console.error("Failed to load rooms", err);
        if (isCurrentRequest) {
          setRoomsError(err instanceof Error ? err.message : 'Unable to load suites. Please try again.');
        }
      } finally {
        if (isCurrentRequest) setLoadingRooms(false);
      }
    };
    loadRooms();
    return () => {
      isCurrentRequest = false;
    };
  }, [activeFilters, roomRequestKey]);

  useEffect(() => {
    const refreshRooms = () => setRoomRequestKey(key => key + 1);
    return hotelApi.subscribe((key) => {
      if (key === 'aurelia_bookings') refreshRooms();
    });
  }, []);

  const retryRooms = () => setRoomRequestKey((key) => key + 1);

  // Apply filters when clicking search
  const handleSearchSubmit = () => {
    if (getStayNights(checkIn, checkOut) < 1 || checkIn < getDateOffset(0)) return false;

    setActiveFilters({
      checkIn,
      checkOut,
      guests,
      roomType,
    });
    // Scroll to rooms section
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
    return true;
  };

  // Night calculation
  const getNights = () => {
    return getStayNights(activeFilters.checkIn, activeFilters.checkOut);
  };

  const nights = getNights();

  // Reset booking form on close
  const resetBooking = () => {
    setSelectedRoom(null);
    setSelectedAddons([]);
    setBookingStep(1);
    setForm({
      name: "",
      email: "",
      phone: "",
      requests: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardName: "",
    });
    setBookingRef("");
  };

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Billing Math
  const getBillingDetails = () => {
    if (!selectedRoom) {
      return {
        roomTotal: 0,
        addonsTotal: 0,
        luxuryTax: 0,
        resortFee: 0,
        totalPrice: 0,
      };
    }

    const roomTotal = selectedRoom.price * nights;

    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return sum;
      return sum + (addon.perNight ? addon.price * nights : addon.price);
    }, 0);

    const luxuryTax = Math.round((roomTotal + addonsTotal) * 0.12); // 12% luxury service tax
    const resortFee = 45 * nights; // $45/night flat resort amenities fee
    const totalPrice = roomTotal + addonsTotal + luxuryTax + resortFee;

    return {
      roomTotal,
      addonsTotal,
      luxuryTax,
      resortFee,
      totalPrice,
    };
  };

  const billing = getBillingDetails();

  // Go to next wizard step
  const nextStep = () => {
    if (bookingStep === 2) {
      // Simulate booking reference generation on final completion
      const ref = "AUR-" + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);
      setBookingStep(3);
    } else {
      setBookingStep(bookingStep + 1);
    }
  };

  const prevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  return {
    // Inputs
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    roomType,
    setRoomType,

    // Active filters
    activeFilters,
    setActiveFilters,
    handleSearchSubmit,

    // API states
    rooms,
    loadingRooms,
    roomsError,
    retryRooms,
    addons,
    loadingAddons,

    // Booking states
    selectedRoom,
    setSelectedRoom,
    selectedAddons,
    toggleAddon,
    bookingStep,
    setBookingStep,
    form,
    setForm,
    bookingRef,
    nights,
    billing,

    // Actions
    resetBooking,
    nextStep,
    prevStep,
  };
};
