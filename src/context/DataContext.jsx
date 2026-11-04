import React, { createContext, useContext, useState, useEffect } from 'react';
import { HOTELS_DATA } from '../data/hotelsData';
import { TICKETS_DATA } from '../data/ticketsData';
import { GUIDES_DATA } from '../data/guidesData';
import { api } from '../services/api';

const DataContext = createContext();

const INITIAL_INQUIRIES = [
  {
    id: 'INQ-101',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    topic: 'booking',
    message: 'Hello, I would like to inquire if the Azure Horizon Resort allows late checkout on Oct 18th for our anniversary trip?',
    date: 'Sep 17, 2026, 2:32 PM',
    status: 'New'
  },
  {
    id: 'INQ-102',
    name: 'Liam O’Connor',
    email: 'liam.oc@travelclub.co.uk',
    topic: 'partnership',
    message: 'We operate bespoke walking tours in Edinburgh and would like to register 4 licensed local guides onto the TravelEase platform.',
    date: 'Sep 16, 2026, 9:15 AM',
    status: 'In Progress'
  },
  {
    id: 'INQ-103',
    name: 'Dr. Maria Santos',
    email: 'msantos@healthres.org',
    topic: 'support',
    message: 'Can I add extra luggage allowance to my SkyLuxe London to Paris flight after booking confirmation?',
    date: 'Sep 15, 2026, 6:40 PM',
    status: 'Resolved'
  }
];

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'traveler',
    status: 'Active',
    joined: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    totalBookings: 3
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@globetrek.io',
    role: 'traveler',
    status: 'Active',
    joined: 'Mar 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    totalBookings: 8
  },
  {
    id: 'usr-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@goaguides.in',
    role: 'guide',
    status: 'Active',
    joined: 'Feb 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    totalBookings: 42
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'admin@travelease.com',
    role: 'admin',
    status: 'Active',
    joined: 'Nov 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    totalBookings: 0
  }
];

export const DataProvider = ({ children }) => {
  const [hotels, setHotels] = useState(() => {
    const saved = localStorage.getItem('travelease_admin_hotels');
    return saved ? JSON.parse(saved) : HOTELS_DATA;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('travelease_admin_tickets');
    return saved ? JSON.parse(saved) : TICKETS_DATA;
  });

  const [guides, setGuides] = useState(() => {
    const saved = localStorage.getItem('travelease_admin_guides');
    return saved ? JSON.parse(saved) : GUIDES_DATA;
  });

  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('travelease_admin_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('travelease_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [dbStatus, setDbStatus] = useState({
    connected: false,
    checking: true,
    provider: 'Neon PostgreSQL',
    database: null,
    version: null
  });

  // Fetch live data from Neon PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;

    async function loadNeonData() {
      try {
        const health = await api.getHealth();
        if (isMounted) {
          setDbStatus({
            connected: Boolean(health?.database?.connected),
            checking: false,
            provider: 'Neon PostgreSQL',
            database: health?.database?.database || 'neondb',
            version: health?.database?.version || ''
          });
        }

        const [hList, tList, gList, inqList, uList] = await Promise.allSettled([
          api.getHotels(),
          api.getTickets(),
          api.getGuides(),
          api.getInquiries(),
          api.getUsers()
        ]);

        if (isMounted) {
          if (hList.status === 'fulfilled' && hList.value?.length) {
            setHotels(hList.value);
            localStorage.setItem('travelease_admin_hotels', JSON.stringify(hList.value));
          }
          if (tList.status === 'fulfilled' && tList.value?.length) {
            setTickets(tList.value);
            localStorage.setItem('travelease_admin_tickets', JSON.stringify(tList.value));
          }
          if (gList.status === 'fulfilled' && gList.value?.length) {
            setGuides(gList.value);
            localStorage.setItem('travelease_admin_guides', JSON.stringify(gList.value));
          }
          if (inqList.status === 'fulfilled' && inqList.value?.length) {
            setInquiries(inqList.value);
            localStorage.setItem('travelease_admin_inquiries', JSON.stringify(inqList.value));
          }
          if (uList.status === 'fulfilled' && uList.value?.length) {
            setUsers(uList.value);
            localStorage.setItem('travelease_admin_users', JSON.stringify(uList.value));
          }
        }
      } catch (err) {
        if (isMounted) {
          setDbStatus(prev => ({ ...prev, connected: false, checking: false }));
        }
      }
    }

    loadNeonData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage as local cache
  useEffect(() => {
    localStorage.setItem('travelease_admin_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('travelease_admin_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('travelease_admin_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem('travelease_admin_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('travelease_admin_users', JSON.stringify(users));
  }, [users]);

  // --- Hotel CRUD ---
  const addHotel = async (hotel) => {
    const newId = `h${Date.now()}`;
    const newHotel = {
      ...hotel,
      id: newId,
      pricePerNight: Number(hotel.pricePerNight),
      rating: Number(hotel.rating || 4.8),
      reviewsCount: Number(hotel.reviewsCount || 1),
      currency: '$',
      lat: Number(hotel.lat) || 20.5937,
      lng: Number(hotel.lng) || 78.9629,
      gallery: hotel.gallery && hotel.gallery.length ? hotel.gallery : [hotel.image],
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities || '').split(',').map(s => s.trim()).filter(Boolean),
      rooms: hotel.rooms && hotel.rooms.length ? hotel.rooms : [
        { id: `r-${Date.now()}-1`, name: 'Deluxe Suite', price: Number(hotel.pricePerNight), capacity: '2 Adults', bed: '1 King Bed' }
      ]
    };

    setHotels(prev => [newHotel, ...prev]);

    try {
      const saved = await api.createHotel(newHotel);
      if (saved) {
        setHotels(prev => prev.map(h => h.id === newId ? saved : h));
      }
    } catch (e) {
      console.warn('Neon DB hotel create fallback to local state:', e);
    }

    return newHotel;
  };

  const updateHotel = async (id, updatedFields) => {
    setHotels(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          ...updatedFields,
          pricePerNight: updatedFields.pricePerNight !== undefined ? Number(updatedFields.pricePerNight) : h.pricePerNight,
          rating: updatedFields.rating !== undefined ? Number(updatedFields.rating) : h.rating,
          amenities: Array.isArray(updatedFields.amenities) 
            ? updatedFields.amenities 
            : (typeof updatedFields.amenities === 'string' ? updatedFields.amenities.split(',').map(s => s.trim()).filter(Boolean) : h.amenities)
        };
      }
      return h;
    }));

    try {
      await api.updateHotel(id, updatedFields);
    } catch (e) {
      console.warn('Neon DB hotel update fallback to local state:', e);
    }
  };

  const deleteHotel = async (id) => {
    setHotels(prev => prev.filter(h => h.id !== id));
    try {
      await api.deleteHotel(id);
    } catch (e) {
      console.warn('Neon DB hotel delete fallback to local state:', e);
    }
  };

  // --- Ticket CRUD ---
  const addTicket = async (ticket) => {
    const newId = `t${Date.now()}`;
    const newTicket = {
      ...ticket,
      id: newId,
      price: Number(ticket.price),
      seatsAvailable: Number(ticket.seatsAvailable || 20),
      features: Array.isArray(ticket.features) ? ticket.features : (ticket.features || '').split(',').map(s => s.trim()).filter(Boolean),
      classes: ticket.classes && ticket.classes.length ? ticket.classes : [
        { name: 'Standard Seat', multiplier: 1.0, seatType: 'Standard Window/Aisle' },
        { name: 'Premium Class', multiplier: 1.5, seatType: 'Extra Legroom + Priority Service' }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    try {
      const saved = await api.createTicket(newTicket);
      if (saved) {
        setTickets(prev => prev.map(t => t.id === newId ? saved : t));
      }
    } catch (e) {
      console.warn('Neon DB ticket create fallback:', e);
    }

    return newTicket;
  };

  const updateTicket = async (id, updatedFields) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : t.price,
          seatsAvailable: updatedFields.seatsAvailable !== undefined ? Number(updatedFields.seatsAvailable) : t.seatsAvailable
        };
      }
      return t;
    }));

    try {
      await api.updateTicket(id, updatedFields);
    } catch (e) {
      console.warn('Neon DB ticket update fallback:', e);
    }
  };

  const deleteTicket = async (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTicket(id);
    } catch (e) {
      console.warn('Neon DB ticket delete fallback:', e);
    }
  };

  // --- Guide CRUD ---
  const addGuide = async (guide) => {
    const newId = `g${Date.now()}`;
    const newGuide = {
      ...guide,
      id: newId,
      pricePerDay: Number(guide.pricePerDay),
      rating: Number(guide.rating || 4.9),
      reviewsCount: Number(guide.reviewsCount || 1),
      experienceYears: Number(guide.experienceYears || 5),
      languages: Array.isArray(guide.languages) ? guide.languages : (guide.languages || '').split(',').map(s => s.trim()).filter(Boolean),
      included: Array.isArray(guide.included) ? guide.included : (guide.included || '').split(',').map(s => s.trim()).filter(Boolean)
    };

    setGuides(prev => [newGuide, ...prev]);

    try {
      const saved = await api.createGuide(newGuide);
      if (saved) {
        setGuides(prev => prev.map(g => g.id === newId ? saved : g));
      }
    } catch (e) {
      console.warn('Neon DB guide create fallback:', e);
    }

    return newGuide;
  };

  const updateGuide = async (id, updatedFields) => {
    setGuides(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          ...updatedFields,
          pricePerDay: updatedFields.pricePerDay !== undefined ? Number(updatedFields.pricePerDay) : g.pricePerDay,
          rating: updatedFields.rating !== undefined ? Number(updatedFields.rating) : g.rating,
          languages: Array.isArray(updatedFields.languages)
            ? updatedFields.languages
            : (typeof updatedFields.languages === 'string' ? updatedFields.languages.split(',').map(s => s.trim()).filter(Boolean) : g.languages)
        };
      }
      return g;
    }));

    try {
      await api.updateGuide(id, updatedFields);
    } catch (e) {
      console.warn('Neon DB guide update fallback:', e);
    }
  };

  const deleteGuide = async (id) => {
    setGuides(prev => prev.filter(g => g.id !== id));
    try {
      await api.deleteGuide(id);
    } catch (e) {
      console.warn('Neon DB guide delete fallback:', e);
    }
  };

  // --- Inquiries CRUD ---
  const addInquiry = async (inquiry) => {
    const newId = `INQ-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInquiry = {
      ...inquiry,
      id: newId,
      date: dateStr,
      status: 'New'
    };

    setInquiries(prev => [newInquiry, ...prev]);

    try {
      const res = await api.submitContact(inquiry);
      if (res?.inquiry) {
        setInquiries(prev => prev.map(i => i.id === newId ? res.inquiry : i));
      }
    } catch (e) {
      console.warn('Neon DB inquiry fallback:', e);
    }

    return newInquiry;
  };

  const updateInquiryStatus = async (id, status) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    try {
      await api.updateInquiryStatus(id, status);
    } catch (e) {
      console.warn('Neon DB inquiry status update fallback:', e);
    }
  };

  const deleteInquiry = async (id) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
    try {
      await api.deleteInquiry(id);
    } catch (e) {
      console.warn('Neon DB inquiry delete fallback:', e);
    }
  };

  // --- Users CRUD ---
  const updateUserRole = async (userId, role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    try {
      await api.updateUserRole(userId, role);
    } catch (e) {
      console.warn('Neon DB user role update fallback:', e);
    }
  };

  const addUser = async (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      joined: 'Today',
      totalBookings: 0,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      ...userData
    };

    setUsers(prev => [newUser, ...prev]);

    try {
      const saved = await api.createUser(newUser);
      if (saved) {
        setUsers(prev => prev.map(u => u.id === newUser.id ? saved : u));
      }
    } catch (e) {
      console.warn('Neon DB user create fallback:', e);
    }

    return newUser;
  };

  const deleteUser = async (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await api.deleteUser(userId);
    } catch (e) {
      console.warn('Neon DB user delete fallback:', e);
    }
  };

  // --- Reset All To Initial Defaults ---
  const resetAllData = async () => {
    localStorage.removeItem('travelease_admin_hotels');
    localStorage.removeItem('travelease_admin_tickets');
    localStorage.removeItem('travelease_admin_guides');
    localStorage.removeItem('travelease_admin_inquiries');
    localStorage.removeItem('travelease_admin_users');
    setHotels(HOTELS_DATA);
    setTickets(TICKETS_DATA);
    setGuides(GUIDES_DATA);
    setInquiries(INITIAL_INQUIRIES);
    setUsers(INITIAL_USERS);
  };

  return (
    <DataContext.Provider value={{
      hotels,
      tickets,
      guides,
      inquiries,
      users,
      dbStatus,
      addHotel,
      updateHotel,
      deleteHotel,
      addTicket,
      updateTicket,
      deleteTicket,
      addGuide,
      updateGuide,
      deleteGuide,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry,
      updateUserRole,
      addUser,
      deleteUser,
      resetAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
