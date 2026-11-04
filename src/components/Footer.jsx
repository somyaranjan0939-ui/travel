import React from 'react';
import { Compass, ShieldCheck, Headphones, Award, Mail, Heart } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="footer">
      <div className="max-w-7xl">
        {/* Trust Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3.5rem',
          marginBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>100% Secure Bookings</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>PCI-DSS verified payments</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c' }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>Best Rate Guarantee</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Verified local pricing</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>24/7 Global Concierge</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Instant traveler assistance</p>
            </div>
          </div>
        </div>

        {/* Footer Links Columns */}
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '2rem', height: '2rem' }}>
                <Compass size={18} />
              </div>
              <h3 style={{ margin: 0 }}>Travel<span style={{ color: '#38bdf8' }}>Ease</span></h3>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#94a3b8' }}>
              TravelEase is your all-in-one travel companion. Search & book curated hotels, flight & train tickets, hire licensed local guides, and explore global destinations on an interactive map.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge badge-dark" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>⭐ 4.9/5 Rating</span>
              <span className="badge badge-dark" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>✈️ 120+ Cities</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><button onClick={() => setActivePage('hotels')}>Boutique & Luxury Hotels</button></li>
              <li><button onClick={() => setActivePage('tickets')}>Flights & High-Speed Rail</button></li>
              <li><button onClick={() => setActivePage('guides')}>Certified Regional Guides</button></li>
              <li><button onClick={() => setActivePage('map')}>Interactive Destination Map</button></li>
              <li><button onClick={() => setActivePage('bookings')}>Trip Manager & E-Tickets</button></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><button onClick={() => setActivePage('about')}>About TravelEase</button></li>
              <li><button onClick={() => setActivePage('contact')}>Contact & Support</button></li>
              <li><button onClick={() => setActivePage('about')}>Security & Compliance</button></li>
              <li><button onClick={() => setActivePage('contact')}>Partner with Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Travel Inspiration</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#94a3b8' }}>
              Subscribe to get secret getaway deals, seasonal discounts, and curated cultural itineraries.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.9rem',
                  color: 'white',
                  fontSize: '0.85rem',
                  flex: 1
                }}
              />
              <button className="btn btn-primary btn-sm">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TravelEase Technologies Inc. Built with React & modern web standards.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
              Crafted with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for curious travelers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
