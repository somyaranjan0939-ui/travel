import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Hotel,
  Plane,
  UserCheck,
  BookmarkCheck,
  Mail,
  Users,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Eye,
  ShieldAlert,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { AdminItemModal } from '../components/admin/AdminItemModal';

export const AdminPage = ({ setActivePage }) => {
  const { user, loginAsAdmin, switchRole } = useAuth();
  const { bookings, updateBookingStatus, deleteBooking, setActiveReceipt, showToast } = useBooking();
  const {
    hotels,
    tickets,
    guides,
    inquiries,
    users: platformUsers,
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
    updateInquiryStatus,
    deleteInquiry,
    updateUserRole,
    addUser,
    deleteUser,
    resetAllData
  } = useData();

  // Active Admin Tab
  const [currentTab, setCurrentTab] = useState('overview'); // 'overview' | 'hotels' | 'tickets' | 'guides' | 'bookings' | 'inquiries' | 'users'
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    item: null
  });

  // Calculate Metrics
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'Cancelled' && b.status !== 'Refunded')
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  }, [bookings]);

  const hotelBookingsCount = bookings.filter(b => b.type === 'hotel').length;
  const ticketBookingsCount = bookings.filter(b => b.type === 'ticket').length;
  const guideBookingsCount = bookings.filter(b => b.type === 'guide').length;

  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  // Gate check if user is not admin
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="section-padding admin-gate-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '520px', width: '100%', background: 'white', borderRadius: 'var(--radius-xl)', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <ShieldAlert size={36} />
          </div>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Restricted Operations Area</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>Administrator Access Required</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            You are currently browsing as a <strong>{user?.role || 'Guest'}</strong>. To manage catalog properties, transport routes, guides, and customer bookings, please unlock admin access.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                loginAsAdmin();
                showToast('👑 Switched to Administrator: Marcus Vance');
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Sparkles size={18} />
              <span>Unlock Demo Admin Portal</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActivePage('home')}
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle CRUD modal triggers
  const handleOpenCreateModal = (type) => {
    setModalConfig({
      isOpen: true,
      type,
      item: null
    });
  };

  const handleOpenEditModal = (type, item) => {
    setModalConfig({
      isOpen: true,
      type,
      item
    });
  };

  const handleSaveModal = (data) => {
    const { type, item } = modalConfig;
    if (type === 'hotel') {
      if (item) {
        updateHotel(item.id, data);
        showToast(`Hotel "${data.name}" updated successfully!`);
      } else {
        addHotel(data);
        showToast(`Hotel "${data.name}" added to catalog!`);
      }
    } else if (type === 'ticket') {
      if (item) {
        updateTicket(item.id, data);
        showToast(`Route "${data.origin} → ${data.destination}" updated!`);
      } else {
        addTicket(data);
        showToast(`Route "${data.origin} → ${data.destination}" added!`);
      }
    } else if (type === 'guide') {
      if (item) {
        updateGuide(item.id, data);
        showToast(`Guide "${data.name}" updated!`);
      } else {
        addGuide(data);
        showToast(`Guide "${data.name}" added to team!`);
      }
    } else if (type === 'inquiry') {
      updateInquiryStatus(item.id, data);
      showToast(`Inquiry ${item.id} status updated to ${data}!`);
    }
  };

  // Filtered lists based on search and status
  const filteredHotels = hotels.filter(h =>
    !searchQuery ||
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(t =>
    !searchQuery ||
    t.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guides.filter(g =>
    !searchQuery ||
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    const matchesQuery = !searchQuery ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const filteredInquiries = inquiries.filter(i => {
    const matchesQuery = !searchQuery ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hotels', label: 'Hotels', icon: Hotel, badge: hotels.length },
    { id: 'tickets', label: 'Tickets & Routes', icon: Plane, badge: tickets.length },
    { id: 'guides', label: 'Local Guides', icon: UserCheck, badge: guides.length },
    { id: 'bookings', label: 'All Bookings', icon: BookmarkCheck, badge: bookings.length },
    { id: 'inquiries', label: 'Support Inquiries', icon: Mail, badge: newInquiriesCount > 0 ? newInquiriesCount : null, badgeColor: 'var(--accent)' },
    { id: 'users', label: 'Users & Roles', icon: Users, badge: platformUsers.length }
  ];

  return (
    <div className="admin-page-layout">
      {/* Top Banner & Control Bar */}
      <div className="admin-header-bar">
        <div className="admin-header-inner max-w-7xl">
          <div className="admin-brand-meta">
            <div className="admin-badge-pill">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Admin Console</span>
            </div>
            <div className="admin-system-health">
              <span className="health-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="admin-header-controls">
            {/* Live Neon DB Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: dbStatus?.connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                color: dbStatus?.connected ? '#047857' : '#b45309',
                border: `1px solid ${dbStatus?.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
              }}
              title={dbStatus?.connected ? `Connected to Neon PostgreSQL (${dbStatus.database || 'neondb'})` : 'Connecting...'}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: dbStatus?.connected ? '#10b981' : '#f59e0b',
                boxShadow: dbStatus?.connected ? '0 0 8px rgba(16, 185, 129, 0.8)' : 'none'
              }} />
              <span>{dbStatus?.connected ? 'Neon DB Active' : 'Connecting DB...'}</span>
            </div>

            <div className="admin-user-pill">
              <img src={user.avatar} alt={user.name} />
              <div>
                <p className="admin-user-name">{user.name}</p>
                <p className="admin-user-role">Administrator</p>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                switchRole('traveler');
                showToast('Switched to Traveler view');
                setActivePage('home');
              }}
              title="Test user experience as regular traveler"
            >
              Switch to Traveler
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm('Reset all catalog data and sample inquiries to default?')) {
                  resetAllData();
                  showToast('Catalog reset to initial defaults');
                }
              }}
              title="Reset sample data"
            >
              <RotateCcw size={14} />
              <span>Reset Data</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActivePage('home')}
            >
              <span>View Live Website</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <div className="admin-workspace max-w-7xl">
        {/* Sidebar Tabs */}
        <aside className="admin-sidebar">
          <nav className="admin-nav-list">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge !== null && (
                    <span 
                      className="admin-tab-count" 
                      style={tab.badgeColor ? { background: tab.badgeColor, color: 'white' } : {}}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="admin-sidebar-card">
            <h4>Live Sync Active</h4>
            <p>Changes saved here immediately update the website storefront and persist in browser storage.</p>
          </div>
        </aside>

        {/* Content Area */}
        <section className="admin-content-area">
          {/* TAB 1: OVERVIEW / ANALYTICS */}
          {currentTab === 'overview' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Performance & Analytics</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Real-time overview of website activity, bookings, and revenue</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenCreateModal('hotel')}>
                    <Plus size={15} />
                    <span>Add Hotel</span>
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenCreateModal('ticket')}>
                    <Plus size={15} />
                    <span>Add Route</span>
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleOpenCreateModal('guide')}>
                    <Plus size={15} />
                    <span>Add Guide</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="admin-metrics-grid">
                <div className="admin-kpi-card">
                  <div className="kpi-icon-wrapper" style={{ background: '#ecfdf5', color: 'var(--success)' }}>
                    <DollarSign size={24} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Gross Bookings Revenue</span>
                    <h3 className="kpi-val">${totalRevenue.toLocaleString()}</h3>
                    <span className="kpi-trend positive">
                      <TrendingUp size={13} /> +18.4% this week
                    </span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <BookmarkCheck size={24} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Total Reservations</span>
                    <h3 className="kpi-val">{bookings.length}</h3>
                    <span className="kpi-subtext">{hotelBookingsCount} hotels · {ticketBookingsCount} tickets · {guideBookingsCount} guides</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-icon-wrapper" style={{ background: '#fef3c7', color: 'var(--warning)' }}>
                    <Hotel size={24} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Active Hotel Properties</span>
                    <h3 className="kpi-val">{hotels.length}</h3>
                    <span className="kpi-subtext">Across 4 countries</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <div className="kpi-icon-wrapper" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                    <Users size={24} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Registered Members</span>
                    <h3 className="kpi-val">{platformUsers.length}</h3>
                    <span className="kpi-subtext">{platformUsers.filter(u => u.role === 'traveler').length} travelers · {guides.length} guides</span>
                  </div>
                </div>
              </div>

              {/* Overview Breakdown & Recent Stream */}
              <div className="admin-two-col-grid" style={{ marginTop: '1.5rem' }}>
                {/* Recent Bookings Feed */}
                <div className="admin-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Reservations</h3>
                    <button className="text-btn" onClick={() => setCurrentTab('bookings')} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {bookings.slice(0, 4).map(b => (
                      <div key={b.id} className="admin-stream-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={b.image} alt={b.title} style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.title}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.id} · {b.bookingDate || 'Recent'}</p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>${b.totalAmount}</p>
                          <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inventory Distribution & Quick Stats */}
                <div className="admin-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Inventory Distribution</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span>Hotels & Beachfront Resorts</span>
                        <span>{hotels.length} properties</span>
                      </div>
                      <div className="admin-progress-bar">
                        <div style={{ width: `${(hotels.length / 15) * 100}%`, background: 'var(--primary)' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span>Transport Routes (Flights/Trains)</span>
                        <span>{tickets.length} routes</span>
                      </div>
                      <div className="admin-progress-bar">
                        <div style={{ width: `${(tickets.length / 15) * 100}%`, background: '#f97316' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span>Certified Local Guides</span>
                        <span>{guides.length} guides</span>
                      </div>
                      <div className="admin-progress-bar">
                        <div style={{ width: `${(guides.length / 15) * 100}%`, background: '#10b981' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <strong>Tip:</strong> Adding a new hotel, transport route, or guide automatically populates it across search results, the homepage, and the interactive map!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOTELS MANAGEMENT */}
          {currentTab === 'hotels' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Hotels & Properties Management</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage listings, nightly rates, amenities, and property availability</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenCreateModal('hotel')}>
                  <Plus size={16} />
                  <span>Add New Property</span>
                </button>
              </div>

              {/* Filter Toolbar */}
              <div className="admin-toolbar">
                <div className="input-with-icon" style={{ flex: 1, maxWidth: '360px' }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, city, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing {filteredHotels.length} of {hotels.length} properties
                </span>
              </div>

              {/* Hotels Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Nightly Rate</th>
                      <th>Rating</th>
                      <th>Badge</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map(hotel => (
                      <tr key={hotel.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={hotel.image} alt={hotel.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{hotel.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {hotel.id}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}>
                            <MapPin size={14} color="var(--primary)" />
                            {hotel.location}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>${hotel.pricePerNight}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/night</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, fontSize: '0.88rem', color: '#eab308' }}>
                            ★ {hotel.rating}
                          </span>
                        </td>
                        <td>
                          {hotel.badge ? (
                            <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>{hotel.badge}</span>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>None</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="admin-action-btn"
                              title="Edit Property"
                              onClick={() => handleOpenEditModal('hotel', hotel)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="admin-action-btn danger"
                              title="Delete Property"
                              onClick={() => {
                                if (window.confirm(`Delete property "${hotel.name}"?`)) {
                                  deleteHotel(hotel.id);
                                  showToast(`Property "${hotel.name}" removed from catalog`, 'info');
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TICKETS & ROUTES */}
          {currentTab === 'tickets' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Transport Routes & Tickets</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage scheduled flights, high-speed rail, and express coach routes</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenCreateModal('ticket')}>
                  <Plus size={16} />
                  <span>Add New Route</span>
                </button>
              </div>

              {/* Filter Toolbar */}
              <div className="admin-toolbar">
                <div className="input-with-icon" style={{ flex: 1, maxWidth: '360px' }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by carrier, origin, destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing {filteredTickets.length} of {tickets.length} routes
                </span>
              </div>

              {/* Tickets Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Carrier & Mode</th>
                      <th>Origin → Destination</th>
                      <th>Departure / Duration</th>
                      <th>Base Fare</th>
                      <th>Seats Open</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ticket.carrier}</p>
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                              {ticket.modeName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {ticket.origin} <span style={{ color: 'var(--primary)' }}>→</span> {ticket.destination}
                          </span>
                        </td>
                        <td>
                          <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{ticket.departureTime}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.duration} · {ticket.type}</p>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>${ticket.price}</strong>
                        </td>
                        <td>
                          <span className={`status-pill ${ticket.seatsAvailable > 5 ? 'active' : 'warning'}`}>
                            {ticket.seatsAvailable} seats
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="admin-action-btn"
                              title="Edit Route"
                              onClick={() => handleOpenEditModal('ticket', ticket)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="admin-action-btn danger"
                              title="Delete Route"
                              onClick={() => {
                                if (window.confirm(`Delete route "${ticket.origin} → ${ticket.destination}"?`)) {
                                  deleteTicket(ticket.id);
                                  showToast(`Route removed from catalog`, 'info');
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GUIDES MANAGEMENT */}
          {currentTab === 'guides' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Certified Local Guides</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage professional regional guides, languages, and daily rates</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenCreateModal('guide')}>
                  <Plus size={16} />
                  <span>Add Guide</span>
                </button>
              </div>

              {/* Filter Toolbar */}
              <div className="admin-toolbar">
                <div className="input-with-icon" style={{ flex: 1, maxWidth: '360px' }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, region, specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing {filteredGuides.length} of {guides.length} guides
                </span>
              </div>

              {/* Guides Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guide</th>
                      <th>Region & City</th>
                      <th>Specialty</th>
                      <th>Daily Rate</th>
                      <th>Rating</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuides.map(guide => (
                      <tr key={guide.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={guide.avatar} alt={guide.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{guide.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{guide.experienceYears} yrs exp</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{guide.region}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '240px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {guide.specialty}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>${guide.pricePerDay}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, fontSize: '0.88rem', color: '#eab308' }}>
                            ★ {guide.rating}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="admin-action-btn"
                              title="Edit Guide"
                              onClick={() => handleOpenEditModal('guide', guide)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="admin-action-btn danger"
                              title="Delete Guide"
                              onClick={() => {
                                if (window.confirm(`Delete guide "${guide.name}"?`)) {
                                  deleteGuide(guide.id);
                                  showToast(`Guide "${guide.name}" removed`, 'info');
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ALL BOOKINGS MANAGEMENT */}
          {currentTab === 'bookings' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Reservations</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Audit bookings, change status, verify payments, and inspect vouchers</p>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="admin-toolbar">
                <div className="input-with-icon" style={{ flex: 1, maxWidth: '360px' }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by ID, title, destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['all', 'confirmed', 'completed', 'cancelled'].map(st => (
                    <button
                      key={st}
                      className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setStatusFilter(st)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Category & Title</th>
                      <th>Schedule / Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <code style={{ fontSize: '0.82rem', background: 'var(--bg-page)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            {b.id}
                          </code>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img src={b.image} alt={b.title} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.title}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.location}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontSize: '0.85rem' }}>{b.dates || b.departureTime || 'Flexible'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booked: {b.bookingDate || 'Recent'}</p>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>${b.totalAmount}</strong>
                        </td>
                        <td>
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className={`admin-status-select ${b.status.toLowerCase()}`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="admin-action-btn"
                              title="Inspect Receipt / Voucher"
                              onClick={() => setActiveReceipt(b)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="admin-action-btn danger"
                              title="Delete Booking Record"
                              onClick={() => {
                                if (window.confirm(`Permanently remove booking ${b.id}?`)) {
                                  deleteBooking(b.id);
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT INQUIRIES */}
          {currentTab === 'inquiries' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Inquiries & Concierge Messages</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage incoming support, custom trip requests, and partnership messages</p>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Inquiry ID</th>
                      <th>Sender</th>
                      <th>Topic</th>
                      <th>Message Snippet</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>
                          <code style={{ fontSize: '0.82rem', fontWeight: 700 }}>{inq.id}</code>
                        </td>
                        <td>
                          <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{inq.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{inq.email}</p>
                        </td>
                        <td>
                          <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                            {inq.topic}
                          </span>
                        </td>
                        <td>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inq.message}
                          </p>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inq.date}</span>
                        </td>
                        <td>
                          <select
                            value={inq.status}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                            className={`admin-status-select ${inq.status.toLowerCase().replace(' ', '-')}`}
                          >
                            <option value="New">🟡 New</option>
                            <option value="In Progress">🔵 In Progress</option>
                            <option value="Resolved">🟢 Resolved</option>
                            <option value="Archived">⚪ Archived</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="admin-action-btn"
                              title="View & Reply"
                              onClick={() => handleOpenEditModal('inquiry', inq)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="admin-action-btn danger"
                              title="Delete Inquiry"
                              onClick={() => {
                                if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                                  deleteInquiry(inq.id);
                                  showToast('Inquiry removed', 'info');
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: USERS & ROLES */}
          {currentTab === 'users' && (
            <div className="admin-tab-view">
              <div className="admin-view-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Users & Access Control (RBAC)</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Manage user accounts, assign roles (Admin, Guide, Traveler), and audit membership</p>
                </div>
              </div>

              {/* Users Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Role</th>
                      <th>Bookings</th>
                      <th style={{ textAlign: 'right' }}>Role Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.88rem' }}>{u.email}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.joined}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${u.role === 'admin' ? 'active' : 'neutral'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{u.totalBookings}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select
                            value={u.role}
                            onChange={(e) => {
                              updateUserRole(u.id, e.target.value);
                              showToast(`Updated ${u.name}'s role to ${e.target.value}`);
                            }}
                            className="admin-status-select"
                            style={{ padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}
                          >
                            <option value="traveler">Traveler</option>
                            <option value="guide">Guide</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Admin Item Modal for Hotels, Tickets, Guides, Inquiries */}
      <AdminItemModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        item={modalConfig.item}
        onClose={() => setModalConfig({ isOpen: false, type: null, item: null })}
        onSave={handleSaveModal}
      />
    </div>
  );
};
