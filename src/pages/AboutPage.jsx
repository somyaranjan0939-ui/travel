import React from 'react';
import { Compass, ShieldCheck, Award, Heart, Globe, Users, CheckCircle } from 'lucide-react';

export const AboutPage = ({ setActivePage }) => {
  return (
    <div className="section-padding" style={{ background: '#f8fafc' }}>
      <div className="max-w-7xl">
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Our Mission</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: '1.2' }}>
            Transforming How the World <span style={{ color: 'var(--primary)' }}>Travels & Discovers</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            TravelEase was founded with a singular ambition: eliminate the chaos of travel planning. By unifying handpicked luxury stays, multi-modal transport connections, and verified local guides into a seamless digital experience, we empower independent explorers worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {[
            { label: 'Verified Hotels & Stays', val: '2,400+' },
            { label: 'Happy Global Travelers', val: '50,000+' },
            { label: 'Cities & Regions Covered', val: '120+' },
            { label: 'Target Platform Uptime', val: '99.9%' }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
                {stat.val}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Built for Travelers</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Why We Built TravelEase
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              Modern travelers shouldn't have to juggle five different tabs just to book a flight, find a boutique hotel near the beach, hire a reputable guide, and map out daily walking routes.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              TravelEase bridges all parts of your itinerary. With high-performance micro-interactions, transparent pricing, and instant digital vouchers, your trip planning is as delightful as the journey itself.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Zero hidden transaction fees', 'Direct contact with licensed guides', 'Free cancellation on eligible bookings', 'Instant mobile check-in passes'].map((perk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>
                  <CheckCircle size={18} color="var(--primary)" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80"
              alt="Travelers exploring"
              style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Security & Reliability Callout */}
        <div style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#38bdf8' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Bank-Grade Security Architecture
          </h2>
          <p style={{ color: '#cbd5e1', maxWidth: '680px', margin: '0 auto 2rem auto', fontSize: '1rem', lineHeight: '1.7' }}>
            Every interaction on TravelEase adheres to rigorous security best practices: TLS encryption for all data in transit, bcrypt hashed credentials, tokenized payment gateways, and comprehensive audit logs.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setActivePage('hotels')}>
            Start Exploring Trips
          </button>
        </div>
      </div>
    </div>
  );
};
