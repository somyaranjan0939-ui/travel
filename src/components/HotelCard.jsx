import React from 'react';
import { MapPin, Star, Sparkles, ArrowRight, Check } from 'lucide-react';

export const HotelCard = ({ hotel, onSelect }) => {
  return (
    <div className="hotel-card">
      <div className="card-img-wrapper">
        <img src={hotel.image} alt={hotel.name} className="card-img" loading="lazy" />
        {hotel.badge && (
          <span className="badge badge-accent card-badge">
            <Sparkles size={12} />
            {hotel.badge}
          </span>
        )}
        <div className="card-rating-float">
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span>{hotel.rating}</span>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>({hotel.reviewsCount})</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-location">
          <MapPin size={14} color="var(--primary)" />
          <span>{hotel.location}</span>
        </div>

        <h3 className="card-title">{hotel.name}</h3>

        <div className="amenities-preview">
          {hotel.amenities.slice(0, 4).map((amenity, i) => (
            <span key={i} className="amenity-chip">
              <Check size={11} color="var(--primary)" style={{ display: 'inline', marginRight: '3px' }} />
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="amenity-chip">+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        <div className="card-footer">
          <div className="price-box">
            <span className="price-sub">From</span>
            <div className="price-val">
              ${hotel.pricePerNight} <span>/ night</span>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(hotel)}
          >
            <span>View & Book</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
