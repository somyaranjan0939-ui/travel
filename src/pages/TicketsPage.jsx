import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TicketCard } from '../components/TicketCard';
import { Plane, Train, Bus, Search, Filter, ArrowUpDown } from 'lucide-react';

export const TicketsPage = ({ onSelectTicket, initialQuery = '', initialMode = 'all' }) => {
  const { tickets } = useData();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [sortBy, setSortBy] = useState('price-asc');

  const filteredTickets = useMemo(() => {
    return (tickets || []).filter(ticket => {
      const matchesSearch = !searchQuery ||
        ticket.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.carrier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMode = selectedMode === 'all' || ticket.mode === selectedMode;

      return matchesSearch && matchesMode;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedMode, sortBy]);

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="max-w-7xl">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.4rem' }}>Multi-Modal Transit</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Flight, Rail & Bus Ticket Booking</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Search verified connections across international airlines, bullet trains, and executive sleeper coaches.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          background: 'white',
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          {/* Mode Switcher Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedMode('all')}
              className={`btn btn-sm ${selectedMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Transit Modes
            </button>
            <button
              onClick={() => setSelectedMode('flight')}
              className={`btn btn-sm ${selectedMode === 'flight' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Plane size={15} />
              <span>Flights</span>
            </button>
            <button
              onClick={() => setSelectedMode('train')}
              className={`btn btn-sm ${selectedMode === 'train' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Train size={15} />
              <span>High-Speed Rail</span>
            </button>
            <button
              onClick={() => setSelectedMode('bus')}
              className={`btn btn-sm ${selectedMode === 'bus' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Bus size={15} />
              <span>Sleeper Buses</span>
            </button>
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
            <div className="input-with-icon" style={{ maxWidth: '280px', width: '100%' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search origin, city, carrier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.5rem 0.6rem 0.5rem 2.2rem', fontSize: '0.85rem' }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: '#f8fafc'
              }}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onSelect={onSelectTicket} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No routes found</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Try switching the transport mode or clearing your search term.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setSearchQuery(''); setSelectedMode('all'); }}
              >
                Reset Route Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
