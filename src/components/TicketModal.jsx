import React, { useState } from 'react';
import { X, Plane, Train, Bus, Clock, ShieldCheck, User, CreditCard } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export const TicketModal = ({ ticket, onClose }) => {
  const { addTicketBooking } = useBooking();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(ticket.classes[0]);
  const [travelDate, setTravelDate] = useState('2026-11-04');
  const [passengerName, setPassengerName] = useState(user ? user.name : 'Alex Morgan');
  const [selectedSeat, setSelectedSeat] = useState('14A');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = Math.round(ticket.price * selectedClass.multiplier);

  const handleBook = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      addTicketBooking(ticket, {
        date: travelDate,
        passengerName,
        classType: selectedClass.name,
        seatNo: `${selectedSeat} (${selectedClass.seatType})`,
        totalAmount,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (**** 4242)' : 'Apple Pay'
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  const sampleSeats = ['12A', '12B', '14A', '14B', '15C', '16D', '18A', '20B'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-primary">{ticket.carrier} • {ticket.flightNo}</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>
              {ticket.origin} to {ticket.destination}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Departure: {ticket.departureTime} • Duration: {ticket.duration}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Class Options */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Select Fare Class</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {ticket.classes.map((cls, idx) => {
                const isSelected = selectedClass.name === cls.name;
                const classPrice = Math.round(ticket.price * cls.multiplier);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedClass(cls)}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-light)' : '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{cls.name}</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${classPrice}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cls.seatType}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Picker Grid */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Choose Seat Preference</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sampleSeats.map((seat) => (
                <button
                  key={seat}
                  type="button"
                  onClick={() => setSelectedSeat(seat)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedSeat === seat ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: selectedSeat === seat ? 'var(--primary)' : '#f8fafc',
                    color: selectedSeat === seat ? 'white' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>

          {/* Passenger & Payment Form */}
          <form onSubmit={handleBook} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--primary)" /> Passenger Details
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="search-field">
                <label>Passenger Full Name</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                  style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div className="search-field">
                <label>Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                  style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div className="search-field" style={{ marginBottom: '1.25rem' }}>
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              >
                <option value="card">Credit Card (Visa / Mastercard)</option>
                <option value="apple">Apple Pay / Google Pay</option>
              </select>
            </div>

            {/* Price Summary */}
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Total Fare (Taxes Included)</span>
                <span style={{ color: 'var(--primary)' }}>${totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-accent btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Issuing Ticket...' : `Confirm & Pay $${totalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
