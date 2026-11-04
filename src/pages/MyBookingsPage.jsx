import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Hotel, Plane, UserCheck, Calendar, MapPin, Printer, XCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const MyBookingsPage = ({ setActivePage }) => {
  const { bookings, cancelBooking, setActiveReceipt } = useBooking();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'hotel' | 'ticket' | 'guide'

  const filtered = bookings.filter(b => filterType === 'all' || b.type === filterType);

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="max-w-7xl">
        {/* Header with User Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Trip Dashboard</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Bookings & Itinerary</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Manage active reservations, access digital boarding passes, and download hotel vouchers.
            </p>
          </div>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{user.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setFilterType('hotel')}
            className={`btn btn-sm ${filterType === 'hotel' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Hotel size={14} />
            <span>Hotels ({bookings.filter(b => b.type === 'hotel').length})</span>
          </button>
          <button
            onClick={() => setFilterType('ticket')}
            className={`btn btn-sm ${filterType === 'ticket' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Plane size={14} />
            <span>Tickets ({bookings.filter(b => b.type === 'ticket').length})</span>
          </button>
          <button
            onClick={() => setFilterType('guide')}
            className={`btn btn-sm ${filterType === 'guide' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserCheck size={14} />
            <span>Tour Guides ({bookings.filter(b => b.type === 'guide').length})</span>
          </button>
        </div>

        {/* Bookings List */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filtered.map(booking => {
              const isCancelled = booking.status === 'Cancelled';
              return (
                <div
                  key={booking.id}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    opacity: isCancelled ? 0.65 : 1
                  }}
                >
                  <img
                    src={booking.image}
                    alt={booking.title}
                    style={{ width: '120px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isCancelled ? 'badge-accent' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                        {booking.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Ref: {booking.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{booking.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      📍 {booking.location}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: '#475569' }}>
                      {booking.dates && <span>📅 Dates: <strong>{booking.dates}</strong></span>}
                      {booking.departureTime && <span>🛫 Time: <strong>{booking.departureTime}</strong></span>}
                      {booking.seatNo && <span>💺 Seat: <strong>{booking.seatNo}</strong></span>}
                      {booking.room && <span>🏨 Room: <strong>{booking.room}</strong></span>}
                      <span>💳 Paid: <strong>${booking.totalAmount}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveReceipt(booking)}
                    >
                      <Printer size={15} />
                      <span>View Voucher</span>
                    </button>

                    {!isCancelled && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => cancelBooking(booking.id)}
                      >
                        <XCircle size={15} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--primary)' }}>
              <Bookmark size={30} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No bookings found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              You don't have any bookings in this category yet. Explore our handpicked hotels, transit tickets, or regional guides to plan your next journey!
            </p>
            <button className="btn btn-primary" onClick={() => setActivePage('hotels')}>
              <span>Browse Hotels & Stays</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
