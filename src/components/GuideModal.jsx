import React, { useState } from 'react';
import { X, Star, MapPin, Check, Calendar, Award, Languages, ShieldCheck, Heart } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const GuideModal = ({ guide, onClose }) => {
  const { addGuideBooking } = useBooking();
  const [startDate, setStartDate] = useState('2026-10-20');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [customNotes, setCustomNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = Math.max(0, d2 - d1);
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const totalAmount = guide.pricePerDay * daysCount;

  const handleHire = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      addGuideBooking(guide, {
        startDate,
        endDate,
        daysCount,
        totalAmount,
        notes: customNotes
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={guide.avatar} alt={guide.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <span className="badge badge-primary">{guide.badge}</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hire {guide.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={13} color="var(--primary)" /> {guide.region} • {guide.experienceYears} Years Experience
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Guide Included Perks */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Included with This Guide</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
              {guide.included.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} color="var(--primary)" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hire Form */}
          <form onSubmit={handleHire} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--primary)" /> Tour Dates & Customization
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="search-field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div className="search-field">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div className="search-field" style={{ marginBottom: '1.25rem' }}>
              <label>Special Requests / Itinerary Preferences (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Interested in vegetarian food walks, photography spots, or historic temples..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', resize: 'vertical' }}
              />
            </div>

            {/* Total Fee Calculation */}
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>${guide.pricePerDay} × {daysCount} day{daysCount > 1 ? 's' : ''}</span>
                <span>${totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                <span>Total Fee (All Taxes Included)</span>
                <span style={{ color: 'var(--primary)' }}>${totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#059669', marginBottom: '1.25rem' }}>
              <ShieldCheck size={16} />
              <span>Full refund if guide cancels or if cancelled 72 hours in advance.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-accent btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Securing Booking...' : `Confirm & Hire for $${totalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
