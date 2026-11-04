import React from 'react';
import { X, CheckCircle2, Printer, Download, Share2, Compass, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const BookingReceiptModal = () => {
  const { activeReceipt, setActiveReceipt } = useBooking();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
      <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Booking Confirmed</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reference: <strong>{activeReceipt.id}</strong></p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveReceipt(null)} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '2rem' }}>
          {/* Voucher Header Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0b1329 0%, #1e293b 100%)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="#38bdf8" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>TravelEase Official Voucher</span>
              </div>
              <span className="badge badge-success">{activeReceipt.status}</span>
            </div>

            <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              {activeReceipt.title}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>📍 {activeReceipt.location}</p>
          </div>

          {/* Details Table */}
          <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Service Type</span>
                <strong style={{ textTransform: 'capitalize' }}>{activeReceipt.type} Booking</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Booking Date</span>
                <strong>{activeReceipt.bookingDate}</strong>
              </div>

              {activeReceipt.dates && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Reservation Dates</span>
                  <strong>{activeReceipt.dates}</strong>
                </div>
              )}

              {activeReceipt.departureTime && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Departure Schedule</span>
                  <strong>{activeReceipt.departureTime}</strong>
                </div>
              )}

              {activeReceipt.seatNo && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Assigned Seat</span>
                  <strong>{activeReceipt.seatNo}</strong>
                </div>
              )}

              {activeReceipt.room && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Room Selected</span>
                  <strong>{activeReceipt.room}</strong>
                </div>
              )}

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Payment Method</span>
                <strong>{activeReceipt.paymentMethod}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Total Paid</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${activeReceipt.totalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Simulated QR Code & Barcode */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '56px', height: '56px', background: '#0f172a', borderRadius: '8px', padding: '6px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ width: '8px', height: '8px', background: (i % 2 === 0 || i % 3 === 0) ? 'white' : '#0284c7' }}></div>
                ))}
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>MOBILE CHECK-IN READY</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan barcode at kiosk / reception</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Verified
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
              <Printer size={16} />
              <span>Print Voucher</span>
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActiveReceipt(null)}>
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
