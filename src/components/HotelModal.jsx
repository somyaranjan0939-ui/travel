import React, { useState } from 'react';
import { X, Star, MapPin, Check, Calendar, Users, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const HotelModal = ({ hotel, onClose }) => {
  const { addHotelBooking } = useBooking();
  const [selectedPhoto, setSelectedPhoto] = useState(hotel.image);
  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(1, d2 - d1);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = selectedRoom.price * nights;
  const taxesAndFees = Math.round(basePrice * 0.12);
  const totalAmount = basePrice + taxesAndFees;

  const handleBookNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      addHotelBooking(hotel, {
        checkIn,
        checkOut,
        nights,
        guests,
        roomName: selectedRoom.name,
        totalAmount,
        paymentMethod: paymentMethod === 'card' ? 'Visa (**** 4242)' : paymentMethod === 'apple' ? 'Apple Pay' : 'UPI Instant'
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>{hotel.badge || 'Featured Hotel'}</span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{hotel.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} color="var(--primary)" /> {hotel.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" /> {hotel.rating} ({hotel.reviewsCount} reviews)
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Photo Gallery */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img src={selectedPhoto} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {hotel.gallery && hotel.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {hotel.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(img)}
                    style={{
                      width: '80px',
                      height: '56px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedPhoto === img ? '2.5px solid var(--primary)' : '2px solid transparent',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>About the Property</h4>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6' }}>{hotel.description}</p>
          </div>

          {/* Amenities Grid */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>Included Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {hotel.amenities.map((amenity, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--primary)" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>Select Room Option</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hotel.rooms.map((room) => {
                const isSelected = selectedRoom.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-light)' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h5 style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{room.name}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{room.bed} • {room.capacity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        ${room.price}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / night</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking & Checkout Form */}
          <form onSubmit={handleBookNow} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={18} color="var(--primary)" /> Reservation Details & Payment
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="search-field">
                <label>Check-in Date</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
              <div className="search-field">
                <label>Check-out Date</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="search-field">
                <label>Guests</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div className="search-field">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <option value="card">Credit Card (Visa / Mastercard)</option>
                  <option value="apple">Apple Pay / Google Pay</option>
                  <option value="upi">Instant UPI / NetBanking</option>
                </select>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>${selectedRoom.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>${basePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Taxes & Tourism Surcharges (12%)</span>
                <span>${taxesAndFees}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem' }}>
                <span>Total Amount Due</span>
                <span style={{ color: 'var(--primary)' }}>${totalAmount}</span>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#059669', marginBottom: '1.25rem' }}>
              <ShieldCheck size={16} />
              <span>Free cancellation up to 48 hours before check-in. Instant digital voucher sent to email.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-accent btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Processing Secure Payment...' : `Confirm & Pay $${totalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
