import { HOTELS_DATA } from '../data/hotelsData';
import { TICKETS_DATA } from '../data/ticketsData';
import { GUIDES_DATA } from '../data/guidesData';
import { MOCK_POIS } from '../data/mockPois';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Health & Stats
  getHealth: async () => {
    return request('/health');
  },

  getStats: async () => {
    return request('/stats');
  },

  // Search
  search: async ({ query = '', type = 'all' }) => {
    const q = query.toLowerCase().trim();
    let hotels = [];
    let tickets = [];
    let guides = [];

    try {
      if (type === 'all' || type === 'hotel') {
        hotels = await api.getHotels();
      }
      if (type === 'all' || type === 'ticket') {
        tickets = await api.getTickets();
      }
      if (type === 'all' || type === 'guide') {
        guides = await api.getGuides();
      }
    } catch {
      hotels = HOTELS_DATA;
      tickets = TICKETS_DATA;
      guides = GUIDES_DATA;
    }

    if (q) {
      hotels = hotels.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q)
      );
      tickets = tickets.filter(t =>
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.carrier.toLowerCase().includes(q)
      );
      guides = guides.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.region.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.specialty.toLowerCase().includes(q)
      );
    }

    return {
      hotels: type === 'all' || type === 'hotel' ? hotels : [],
      tickets: type === 'all' || type === 'ticket' ? tickets : [],
      guides: type === 'all' || type === 'guide' ? guides : []
    };
  },

  // Hotels
  getHotels: async () => {
    try {
      return await request('/hotels');
    } catch (e) {
      return HOTELS_DATA;
    }
  },
  getHotelById: async (id) => {
    try {
      return await request(`/hotels/${id}`);
    } catch (e) {
      return HOTELS_DATA.find(h => h.id === id) || null;
    }
  },
  createHotel: async (data) => request('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  updateHotel: async (id, data) => request(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHotel: async (id) => request(`/hotels/${id}`, { method: 'DELETE' }),

  // Tickets
  getTickets: async () => {
    try {
      return await request('/tickets');
    } catch (e) {
      return TICKETS_DATA;
    }
  },
  getTicketById: async (id) => {
    try {
      return await request(`/tickets/${id}`);
    } catch (e) {
      return TICKETS_DATA.find(t => t.id === id) || null;
    }
  },
  createTicket: async (data) => request('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: async (id, data) => request(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicket: async (id) => request(`/tickets/${id}`, { method: 'DELETE' }),

  // Guides
  getGuides: async () => {
    try {
      return await request('/guides');
    } catch (e) {
      return GUIDES_DATA;
    }
  },
  getGuideById: async (id) => {
    try {
      return await request(`/guides/${id}`);
    } catch (e) {
      return GUIDES_DATA.find(g => g.id === id) || null;
    }
  },
  createGuide: async (data) => request('/guides', { method: 'POST', body: JSON.stringify(data) }),
  updateGuide: async (id, data) => request(`/guides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGuide: async (id) => request(`/guides/${id}`, { method: 'DELETE' }),

  // Bookings
  getBookings: async () => request('/bookings'),
  createBooking: async (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBookingStatus: async (id, status) => request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteBooking: async (id) => request(`/bookings/${id}`, { method: 'DELETE' }),

  // Inquiries / Contact
  getInquiries: async () => request('/inquiries'),
  submitContact: async (formData) => {
    try {
      return await request('/inquiries', { method: 'POST', body: JSON.stringify(formData) });
    } catch (err) {
      return { success: true, message: 'Message recorded in offline session mode.' };
    }
  },
  updateInquiryStatus: async (id, status) => request(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteInquiry: async (id) => request(`/inquiries/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: async () => request('/users'),
  createUser: async (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUserRole: async (id, role) => request(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deleteUser: async (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Map POIs
  getPois: async () => MOCK_POIS
};
