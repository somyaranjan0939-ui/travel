import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const BookingContext = createContext();

const INITIAL_BOOKINGS = [
  {
    id: 'TE-H94821',
    type: 'hotel',
    title: 'The Azure Horizon Resort & Spa',
    location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    dates: 'Oct 14, 2026 - Oct 18, 2026',
    nights: 4,
    guests: '2 Adults',
    room: 'Deluxe Ocean View Room',
    totalAmount: 740,
    status: 'Confirmed',
    bookingDate: 'Sep 12, 2026',
    paymentMethod: 'Credit Card (**** 4242)'
  },
  {
    id: 'TE-T10394',
    type: 'ticket',
    title: 'Shinkansen Nozomi Bullet Train',
    location: 'Tokyo → Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    departureTime: '09:00 AM (Nov 04, 2026)',
    duration: '2h 15m',
    classType: 'Green Car (First Class)',
    seatNo: 'Car 08, Seat 12A (Fuji Side)',
    totalAmount: 176,
    status: 'Confirmed',
    bookingDate: 'Sep 15, 2026',
    paymentMethod: 'Apple Pay'
  }
];

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('travelease_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [activeReceipt, setActiveReceipt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load from Neon PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBookings() {
      try {
        const liveBookings = await api.getBookings();
        if (isMounted && liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
          localStorage.setItem('travelease_bookings', JSON.stringify(liveBookings));
        }
      } catch (err) {
        console.warn('Could not load live bookings from Neon DB, using cache:', err.message);
      }
    }
    loadBookings();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('travelease_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const addHotelBooking = async (hotel, bookingDetails) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: `TE-H${randomNum}`,
      type: 'hotel',
      title: hotel.name,
      location: hotel.location,
      image: hotel.image,
      dates: `${bookingDetails.checkIn} - ${bookingDetails.checkOut}`,
      nights: bookingDetails.nights || 1,
      guests: `${bookingDetails.guests} Guest${bookingDetails.guests > 1 ? 's' : ''}`,
      room: bookingDetails.roomName || 'Standard Suite',
      totalAmount: bookingDetails.totalAmount,
      status: 'Confirmed',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      paymentMethod: bookingDetails.paymentMethod || 'Credit Card (**** 8812)',
      hotelId: hotel.id
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`🎉 Hotel reservation confirmed! Ref: ${newBooking.id}`);
    setActiveReceipt(newBooking);

    try {
      const saved = await api.createBooking(newBooking);
      if (saved) {
        setBookings(prev => prev.map(b => b.id === newBooking.id ? saved : b));
      }
    } catch (err) {
      console.warn('Neon DB hotel booking fallback:', err);
    }

    return newBooking;
  };

  const addTicketBooking = async (ticket, bookingDetails) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: `TE-T${randomNum}`,
      type: 'ticket',
      title: `${ticket.carrier} (${ticket.modeName || ticket.mode})`,
      location: `${ticket.origin} → ${ticket.destination}`,
      image: ticket.mode === 'flight' 
        ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
        : ticket.mode === 'train'
        ? 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      departureTime: `${ticket.departureTime} (${bookingDetails.date})`,
      duration: ticket.duration,
      classType: bookingDetails.classType,
      seatNo: bookingDetails.seatNo || 'Seat 14C',
      passengers: bookingDetails.passengerName,
      totalAmount: bookingDetails.totalAmount,
      status: 'Confirmed',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      paymentMethod: bookingDetails.paymentMethod || 'Credit Card (**** 8812)',
      ticketId: ticket.id
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`✈️ Ticket e-pass generated! Ref: ${newBooking.id}`);
    setActiveReceipt(newBooking);

    try {
      const saved = await api.createBooking(newBooking);
      if (saved) {
        setBookings(prev => prev.map(b => b.id === newBooking.id ? saved : b));
      }
    } catch (err) {
      console.warn('Neon DB ticket booking fallback:', err);
    }

    return newBooking;
  };

  const addGuideBooking = async (guide, bookingDetails) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: `TE-G${randomNum}`,
      type: 'guide',
      title: `Guided Tour with ${guide.name}`,
      location: guide.region || guide.city,
      image: guide.avatar,
      dates: `${bookingDetails.startDate} to ${bookingDetails.endDate}`,
      daysCount: bookingDetails.daysCount || 1,
      specialty: guide.specialty,
      totalAmount: bookingDetails.totalAmount,
      status: 'Confirmed',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      paymentMethod: bookingDetails.paymentMethod || 'Credit Card (**** 8812)',
      guideId: guide.id
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`🧭 Local guide booked successfully! Ref: ${newBooking.id}`);
    setActiveReceipt(newBooking);

    try {
      const saved = await api.createBooking(newBooking);
      if (saved) {
        setBookings(prev => prev.map(b => b.id === newBooking.id ? saved : b));
      }
    } catch (err) {
      console.warn('Neon DB guide booking fallback:', err);
    }

    return newBooking;
  };

  const cancelBooking = async (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    showToast(`Booking ${id} has been cancelled`, 'info');
    try {
      await api.updateBookingStatus(id, 'Cancelled');
    } catch (err) {
      console.warn('Neon DB booking cancel fallback:', err);
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    showToast(`Booking ${id} marked as ${newStatus}`, 'success');
    try {
      await api.updateBookingStatus(id, newStatus);
    } catch (err) {
      console.warn('Neon DB booking update fallback:', err);
    }
  };

  const deleteBooking = async (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast(`Booking ${id} removed from system`, 'info');
    try {
      await api.deleteBooking(id);
    } catch (err) {
      console.warn('Neon DB booking delete fallback:', err);
    }
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addHotelBooking,
      addTicketBooking,
      addGuideBooking,
      cancelBooking,
      updateBookingStatus,
      deleteBooking,
      activeReceipt,
      setActiveReceipt,
      toastMessage,
      showToast
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
