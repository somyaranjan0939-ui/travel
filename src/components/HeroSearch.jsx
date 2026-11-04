import React, { useState } from 'react';
import { Hotel, Plane, UserCheck, Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export const HeroSearch = ({ onSearch, setActivePage }) => {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'tickets' | 'guides'
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('2026-10-15');
  const [guests, setGuests] = useState('2');
  const [ticketMode, setTicketMode] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'hotels') {
      onSearch({ query: location, type: 'hotel', guests });
      setActivePage('hotels');
    } else if (activeTab === 'tickets') {
      onSearch({ query: location, type: 'ticket', mode: ticketMode });
      setActivePage('tickets');
    } else {
      onSearch({ query: location, type: 'guide' });
      setActivePage('guides');
    }
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-content">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-primary" style={{ background: 'rgba(2, 132, 199, 0.25)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
            ✨ Your Gateway to Extraordinary Journeys
          </span>
        </div>

        <h1 className="hero-title">
          Explore the World, <span>Effortlessly.</span>
        </h1>

        <p className="hero-subtitle">
          Book handpicked luxury hotels, high-speed rail & flight tickets, and hire licensed local tour guides — all backed by our best-price guarantee.
        </p>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Popular Searches:</span>
          {['Goa Resorts', 'Paris Eiffel Suites', 'Tokyo Shinkansen', 'Bali Villas', 'Zermatt Ski Chalet'].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLocation(tag.split(' ')[0]);
                if (tag.includes('Shinkansen')) {
                  setActiveTab('tickets');
                  setActivePage('tickets');
                } else {
                  setActiveTab('hotels');
                  setActivePage('hotels');
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Search Card */}
      <div className="search-widget-container">
        <div className="search-widget-card">
          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              <Hotel size={18} />
              <span>Stays & Hotels</span>
            </button>

            <button
              className={`search-tab ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <Plane size={18} />
              <span>Flights, Trains & Buses</span>
            </button>

            <button
              className={`search-tab ${activeTab === 'guides' ? 'active' : ''}`}
              onClick={() => setActiveTab('guides')}
            >
              <UserCheck size={18} />
              <span>Local Tour Guides</span>
            </button>
          </div>

          <form className="search-body" onSubmit={handleSearchSubmit}>
            <div className="search-grid">
              {/* Location Input */}
              <div className="search-field">
                <label>
                  {activeTab === 'hotels' ? 'Destination / Hotel' : activeTab === 'tickets' ? 'Origin or Destination' : 'Destination Region'}
                </label>
                <div className="input-with-icon">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder={activeTab === 'hotels' ? 'e.g. Goa, Paris, Bali, Kyoto' : activeTab === 'tickets' ? 'e.g. London, Tokyo, Mumbai' : 'e.g. Paris, Bali, Kyoto'}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Dates Input */}
              <div className="search-field">
                <label>{activeTab === 'guides' ? 'Tour Date' : 'Travel / Check-in Date'}</label>
                <div className="input-with-icon">
                  <Calendar size={18} />
                  <input
                    type="date"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
              </div>

              {/* Third Selector */}
              <div className="search-field">
                <label>
                  {activeTab === 'tickets' ? 'Transport Type' : 'Guests / Travelers'}
                </label>
                <div className="input-with-icon">
                  {activeTab === 'tickets' ? <Plane size={18} /> : <Users size={18} />}
                  {activeTab === 'tickets' ? (
                    <select value={ticketMode} onChange={(e) => setTicketMode(e.target.value)}>
                      <option value="all">All Modes</option>
                      <option value="flight">Flights Only</option>
                      <option value="train">High-Speed Rail</option>
                      <option value="bus">Luxury Sleeper Buses</option>
                    </select>
                  ) : (
                    <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                      <option value="1">1 Solo Traveler</option>
                      <option value="2">2 Adults (Couple)</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4+ Family / Group</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="search-field" style={{ alignSelf: 'flex-end' }}>
                <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', minHeight: '48px' }}>
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
