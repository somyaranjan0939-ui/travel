import React from 'react';
import { Star, MapPin, Languages, Check, ArrowRight, Award } from 'lucide-react';

export const GuideCard = ({ guide, onSelect }) => {
  return (
    <div className="guide-card">
      <div className="guide-header">
        <img src={guide.avatar} alt={guide.name} className="guide-avatar" />
        <div className="guide-meta">
          <div className="guide-badge">
            <Award size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {guide.badge}
          </div>
          <h3 className="guide-name">{guide.name}</h3>
          <div className="guide-region">
            <MapPin size={13} color="var(--primary)" />
            <span>{guide.region}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
            <Star size={13} fill="#f59e0b" /> {guide.rating} ({guide.reviewsCount} reviews)
          </div>
        </div>
      </div>

      <div className="guide-body">
        <p className="guide-bio">{guide.bio}</p>

        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Specialty
          </span>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {guide.specialty}
          </p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
            <Languages size={13} /> Languages Spoken
          </span>
          <div className="guide-tags">
            {guide.languages.map((lang, idx) => (
              <span key={idx} className="lang-tag">{lang}</span>
            ))}
          </div>
        </div>

        <div className="card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div className="price-box">
            <span className="price-sub">Daily Rate</span>
            <div className="price-val">
              ${guide.pricePerDay} <span>/ day</span>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(guide)}
          >
            <span>Hire Guide</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
