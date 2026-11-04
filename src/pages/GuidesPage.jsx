import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { GuideCard } from '../components/GuideCard';
import { Search, UserCheck, Languages, MapPin, Award } from 'lucide-react';

export const GuidesPage = ({ onSelectGuide, initialQuery = '' }) => {
  const { guides } = useData();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [maxDailyFee, setMaxDailyFee] = useState(150);

  const languagesList = ['all', 'English', 'French', 'Japanese', 'Hindi', 'Spanish'];

  const filteredGuides = useMemo(() => {
    return (guides || []).filter(guide => {
      const matchesSearch = !searchQuery ||
        guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLang = selectedLanguage === 'all' || guide.languages.includes(selectedLanguage);
      const matchesFee = guide.pricePerDay <= maxDailyFee;

      return matchesSearch && matchesLang && matchesFee;
    });
  }, [searchQuery, selectedLanguage, maxDailyFee]);

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="max-w-7xl">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>Verified Locals</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Certified Regional Tour Guides</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Hire licensed local experts who craft bespoke cultural itineraries, food tours, and nature treks.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'white',
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          {/* Keyword Search */}
          <div className="input-with-icon" style={{ maxWidth: '320px', width: '100%' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search region, guide name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.55rem 0.75rem 0.55rem 2.3rem', fontSize: '0.88rem' }}
            />
          </div>

          {/* Language Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Languages size={15} /> Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: '#f8fafc'
              }}
            >
              {languagesList.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          {/* Max Daily Fee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Max Daily Fee: <strong style={{ color: 'var(--primary)' }}>${maxDailyFee}</strong>
            </span>
            <input
              type="range"
              min="50"
              max="150"
              step="10"
              value={maxDailyFee}
              onChange={(e) => setMaxDailyFee(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '120px' }}
            />
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="cards-grid">
            {filteredGuides.map(guide => (
              <GuideCard key={guide.id} guide={guide} onSelect={onSelectGuide} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No guides found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Try broadening your language selection or adjusting the fee filter.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setSearchQuery(''); setSelectedLanguage('all'); setMaxDailyFee(150); }}
            >
              Reset Guide Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
