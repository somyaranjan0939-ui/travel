import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { HotelCard } from '../components/HotelCard';
import { Search, Filter, SlidersHorizontal, MapPin, DollarSign, Star, Check } from 'lucide-react';

export const HotelsPage = ({ onSelectHotel, initialQuery = '' }) => {
  const { hotels } = useData();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  const allAmenities = [
    'Private Beach',
    'Infinity Pool',
    'Spa & Wellness',
    'Free High-Speed WiFi',
    'Breakfast Included',
    'Eiffel Tower View',
    'Ski Storage & Rental'
  ];

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const filteredHotels = useMemo(() => {
    return (hotels || []).filter(hotel => {
      // Search
      const matchesSearch = !searchQuery || 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Price
      const matchesPrice = hotel.pricePerNight <= maxPrice;

      // Rating
      const matchesRating = hotel.rating >= minRating;

      // Amenities
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(a => hotel.amenities.includes(a));

      return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended default
    });
  }, [searchQuery, maxPrice, minRating, selectedAmenities, sortBy]);

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="max-w-7xl">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Stay Collection</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Explore Hotels & Luxury Stays</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Compare amenities, read verified reviews, and book directly with instant confirmation.
          </p>
        </div>

        {/* Filter Bar & Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '5.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                <span>Filters</span>
              </div>
              {(searchQuery || maxPrice < 500 || minRating > 0 || selectedAmenities.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMaxPrice(500);
                    setMinRating(0);
                    setSelectedAmenities([]);
                  }}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Destination or Hotel
              </label>
              <div className="input-with-icon">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="e.g. Goa, Paris, Bali"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Max Price Slider */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Max Price / Night
                </label>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.92rem' }}>${maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>$100</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Star Rating Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Minimum Rating
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[0, 4.7, 4.8, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: minRating === rating ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                      background: minRating === rating ? 'var(--primary-light)' : '#f8fafc',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: minRating === rating ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    {rating === 0 ? 'All' : `${rating}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
                Amenities
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {allAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(amenity)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div>
            {/* Sorting Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredHotels.length}</strong> stays available
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: '#f8fafc'
                  }}
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            {filteredHotels.length > 0 ? (
              <div className="cards-grid">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} onSelect={onSelectHotel} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No hotels match your filters</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  Try relaxing your price range, clearing amenities, or searching for another city.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setMaxPrice(500);
                    setMinRating(0);
                    setSelectedAmenities([]);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
