import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { api } from '../services/api';

export const ContactPage = () => {
  const { showToast } = useBooking();
  const { addInquiry } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'booking',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(formData);
      if (addInquiry) {
        addInquiry(formData);
      }
      showToast('✉️ Message sent successfully! Our concierge will respond shortly.');
      setFormData({ name: '', email: '', topic: 'booking', message: '' });
    } catch (err) {
      showToast('Error sending message. Please try again.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How do I access and print my booking vouchers?',
      a: 'Navigate to "My Trips" from the top navigation bar. Click "View Voucher" on any active reservation to display, print, or save your official digital voucher with mobile check-in barcode.'
    },
    {
      q: 'What is the hotel cancellation and refund policy?',
      a: 'Most featured hotels offer 100% free cancellation up to 48 hours before check-in. The exact cancellation terms are visible on each property card and on your booking receipt.'
    },
    {
      q: 'How are local tour guides vetted and verified?',
      a: 'Every guide on TravelEase undergoes a strict 3-tier vetting process: government licensing verification, background checks, and spoken language fluency assessments.'
    },
    {
      q: 'Can I book flights and high-speed trains for groups?',
      a: 'Yes! Select the number of passengers during seat selection to automatically group your tickets together in the same cabin or row.'
    }
  ];

  return (
    <div className="section-padding" style={{ background: '#f8fafc' }}>
      <div className="max-w-7xl">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>24/7 Traveler Support</span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>We're Here to Assist Your Journey</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Have questions regarding a reservation or need assistance planning a custom trip? Reach our team anytime.
          </p>
        </div>

        {/* Form and Contact Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', marginBottom: '5rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Send Us a Message</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We typically reply in under 2 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="search-field">
                <label>Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div className="search-field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex.morgan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div className="search-field">
                <label>Inquiry Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                >
                  <option value="booking">Existing Booking / Voucher Inquiry</option>
                  <option value="hotel">Hotel Partner Listing</option>
                  <option value="guide">Tour Guide Partnership</option>
                  <option value="general">General Question / Feedback</option>
                </select>
              </div>

              <div className="search-field">
                <label>Message Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry or reservation details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Contact Details & Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Call Our Concierge</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Toll-free worldwide support</p>
                </div>
              </div>
              <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>+1 (800) 492-TRAVEL</p>
              <p style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                <Clock size={13} /> Available 24 hours a day, 7 days a week
              </p>
            </div>

            <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Email Support</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For detailed requests & itineraries</p>
                </div>
              </div>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>support@travelease.io</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Priority response for confirmed bookings
              </p>
            </div>

            <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Headquarters</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Global Travel Hub</p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                450 Lexington Avenue, Suite 2800<br />
                New York, NY 10017, United States
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Frequently Asked Questions</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Quick Answers</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isOpen ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', borderTop: '1px solid #f1f5f9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
