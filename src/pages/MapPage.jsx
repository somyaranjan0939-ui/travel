import React, { useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { useData } from '../context/DataContext';
import { MOCK_POIS } from '../data/mockPois';
import { MapPin, Search, Star, ExternalLink, Compass } from 'lucide-react';

export const MapPage = ({ onSelectHotel }) => {
  const { hotels: allHotels } = useData();
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'attractions'
  const [searchFilter, setSearchFilter] = useState('');

  const hotels = (allHotels || []).filter(h => 
    !searchFilter || h.name.toLowerCase().includes(searchFilter.toLowerCase()) || h.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const pois = MOCK_POIS.filter(p =>
    !searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="map-layout">
      {/* Sidebar Discovery List */}
      <div className="map-sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Compass size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Explore on Map</h2>
          </div>

          <div className="input-with-icon" style={{ marginBottom: '1rem' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Filter by city or place..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ padding: '0.55rem 0.6rem 0.55rem 2.2rem', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`btn btn-sm ${activeTab === 'hotels' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              🏨 Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setActiveTab('attractions')}
              className={`btn btn-sm ${activeTab === 'attractions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              📍 Sights ({pois.length})
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'hotels' ? (
            hotels.map(hotel => (
              <div
                key={hotel.id}
                onClick={() => onSelectHotel(hotel)}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.2rem' }}>
                      {hotel.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {hotel.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>★ {hotel.rating}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${hotel.pricePerNight} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ night</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            pois.map(poi => (
              <div
                key={poi.id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={poi.image}
                  alt={poi.name}
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <span className="badge badge-accent" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', marginBottom: '0.2rem' }}>
                    {poi.category}
                  </span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.2rem' }}>
                    {poi.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {poi.city} • ★ {poi.rating}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Interactive View */}
      <div className="map-container-view">
        <InteractiveMap onSelectHotel={onSelectHotel} />
      </div>
    </div>
  );
};
