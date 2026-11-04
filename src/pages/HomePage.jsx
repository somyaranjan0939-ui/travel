import React from 'react';
import { HeroSearch } from '../components/HeroSearch';
import { HotelCard } from '../components/HotelCard';
import { TicketCard } from '../components/TicketCard';
import { GuideCard } from '../components/GuideCard';
import { useData } from '../context/DataContext';
import { ArrowRight, Star, ShieldCheck, Zap, Globe, Sparkles, MapPin, Compass } from 'lucide-react';

export const HomePage = ({ setActivePage, onSelectHotel, onSelectTicket, onSelectGuide, onSearch }) => {
  const { hotels, tickets, guides } = useData();
  return (
    <div>
      {/* Hero & Unified Search */}
      <HeroSearch onSearch={onSearch} setActivePage={setActivePage} />

      {/* Featured Stays & Hotels */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Curated Accommodations</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Featured Stays & Luxury Resorts</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Handpicked boutique hotels, beachside retreats, and alpine chalets verified for exceptional hospitality.
              </p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => { setActivePage('hotels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>View All Hotels</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="cards-grid">
            {hotels.slice(0, 3).map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} onSelect={onSelectHotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Travel Routes (Tickets) */}
      <section className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Multi-Modal Transit</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Trending Flights, Rail & Express Lines</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Seamless connection tickets across international routes with guaranteed seat reservations.
              </p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => { setActivePage('tickets'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>Explore All Routes</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tickets.slice(0, 3).map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onSelect={onSelectTicket} />
            ))}
          </div>
        </div>
      </section>

      {/* Verified Local Guides */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Local Knowledge</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore with Certified Tour Guides</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Hire bilingual locals who unlock private spots, cultural stories, and authentic street food.
              </p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => { setActivePage('guides'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span>Meet All Guides</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="cards-grid">
            {guides.slice(0, 3).map(guide => (
              <GuideCard key={guide.id} guide={guide} onSelect={onSelectGuide} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Teaser Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #0b1329 0%, #1c2541 100%)', color: 'white' }}>
        <div className="max-w-7xl" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ background: 'rgba(2, 132, 199, 0.25)', color: '#38bdf8', marginBottom: '1rem' }}>
              Interactive Discovery
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: '1.2' }}>
              Discover Top Spots & Resorts on Our Live Map
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Browse hotels, sacred shrines, panoramic viewpoints, and historical monuments geographically. Click any pin to view transparent rates, reviews, and jump straight into booking.
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => { setActivePage('map'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <Compass size={20} />
              <span>Launch Interactive Map</span>
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                alt="Map discovery" 
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>Over 120+ Global Destinations</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, marginTop: '0.2rem' }}>
                Live GPS pins, POI recommendations & rates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose TravelEase */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="max-w-7xl">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>The TravelEase Advantage</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Engineered for Stress-Free Travel</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Everything you need for an unforgettable journey, organized in one elegant platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Guaranteed Protection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Your bookings are secured with instant digital confirmation, PCI-DSS compliance, and transparent refund policies.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.25rem' }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Unified Instant Booking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Book hotels, transit tickets, and local guides together without hopping across multiple disjointed websites.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1.25rem' }}>
                <Globe size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Handpicked Local Guides</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Every guide undergoes thorough background verification, language fluency checks, and safety certifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Traveler Stories</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Loved by 50,000+ Explorers</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Solo Backpacker',
                quote: 'Booking both my Kyoto Ryokan and Shinkansen bullet train in 3 minutes on TravelEase made my Japan trip completely stress-free!',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
              },
              {
                name: 'David & Maya Thorne',
                role: 'Family Vacationers',
                quote: 'Rohan, our local guide in Goa, took us to hidden spice plantations that weren’t in any guidebook. Best experience ever!',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
              },
              {
                name: 'Liam Chen',
                role: 'Digital Nomad',
                quote: 'The interactive map is brilliant for finding hotels close to top attractions. Everything is clear, fast, and transparent.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
              }
            ].map((review, i) => (
              <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{review.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={review.avatar} alt={review.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{review.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
