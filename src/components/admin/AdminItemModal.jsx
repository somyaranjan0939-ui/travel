import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminItemModal = ({
  isOpen,
  onClose,
  type, // 'hotel' | 'ticket' | 'guide' | 'inquiry'
  item, // null for create, object for edit
  onSave
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(item);

  // Initial form states depending on type
  const [formData, setFormData] = useState(() => {
    if (type === 'hotel') {
      return {
        name: item?.name || '',
        location: item?.location || '',
        city: item?.city || '',
        country: item?.country || '',
        pricePerNight: item?.pricePerNight || 150,
        rating: item?.rating || 4.8,
        badge: item?.badge || 'Top Pick',
        image: item?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        amenities: item?.amenities ? item.amenities.join(', ') : 'Free High-Speed WiFi, Infinity Pool, Breakfast Included',
        description: item?.description || ''
      };
    } else if (type === 'ticket') {
      return {
        carrier: item?.carrier || '',
        mode: item?.mode || 'flight',
        modeName: item?.modeName || 'Flight',
        flightNo: item?.flightNo || 'TL-100',
        origin: item?.origin || '',
        destination: item?.destination || '',
        departureTime: item?.departureTime || '09:00 AM',
        arrivalTime: item?.arrivalTime || '12:30 PM',
        duration: item?.duration || '3h 30m',
        type: item?.type || 'Non-stop',
        price: item?.price || 120,
        seatsAvailable: item?.seatsAvailable || 25,
        baggage: item?.baggage || '1 Carry-on (10kg)'
      };
    } else if (type === 'guide') {
      return {
        name: item?.name || '',
        region: item?.region || '',
        city: item?.city || '',
        pricePerDay: item?.pricePerDay || 75,
        rating: item?.rating || 4.9,
        experienceYears: item?.experienceYears || 5,
        languages: item?.languages ? item.languages.join(', ') : 'English, French',
        specialty: item?.specialty || '',
        badge: item?.badge || 'Certified Local Expert',
        avatar: item?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: item?.bio || ''
      };
    } else if (type === 'inquiry') {
      return {
        status: item?.status || 'New',
        adminReply: ''
      };
    }
    return {};
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'hotel') {
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean)
      };
      onSave(payload);
    } else if (type === 'ticket') {
      const modeNameMap = {
        flight: 'Flight',
        train: 'High-Speed Rail',
        bus: 'Express Coach'
      };
      const payload = {
        ...formData,
        modeName: modeNameMap[formData.mode] || 'Transit'
      };
      onSave(payload);
    } else if (type === 'guide') {
      const payload = {
        ...formData,
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean)
      };
      onSave(payload);
    } else if (type === 'inquiry') {
      onSave(formData.status);
    }
    onClose();
  };

  const titles = {
    hotel: isEditing ? 'Edit Hotel Property' : 'Add New Hotel Property',
    ticket: isEditing ? 'Edit Transport Route' : 'Add New Transport Route',
    guide: isEditing ? 'Edit Guide Profile' : 'Add Certified Travel Guide',
    inquiry: 'Manage Customer Inquiry'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{titles[type]}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isEditing ? `Modifying ID: ${item.id}` : 'Create a new catalog entry'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* HOTEL FORM */}
          {type === 'hotel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="search-field">
                <label>Property Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. The Azure Horizon Resort"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Goa"
                  />
                </div>
                <div className="search-field">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. India"
                  />
                </div>
              </div>

              <div className="search-field">
                <label>Full Location String *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Goa, India"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Price/Night ($) *</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    min="1"
                    required
                    value={formData.pricePerNight}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-field">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-field">
                  <label>Badge / Tag</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="Luxury Beachfront"
                  />
                </div>
              </div>

              <div className="search-field">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.image && (
                  <div style={{ marginTop: '0.5rem', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className="search-field">
                <label>Amenities (Comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Infinity Pool, Free WiFi, Spa"
                />
              </div>

              <div className="search-field">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the hotel experience, location perks, and key highlights..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* TICKET FORM */}
          {type === 'ticket' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Carrier / Operator *</label>
                  <input
                    type="text"
                    name="carrier"
                    required
                    value={formData.carrier}
                    onChange={handleChange}
                    placeholder="e.g. SkyLuxe Airways / Shinkansen"
                  />
                </div>
                <div className="search-field">
                  <label>Mode of Transit *</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="flight">Flight (Air)</option>
                    <option value="train">Train (Rail)</option>
                    <option value="bus">Bus (Coach)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Origin *</label>
                  <input
                    type="text"
                    name="origin"
                    required
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. New York (JFK)"
                  />
                </div>
                <div className="search-field">
                  <label>Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. London (LHR)"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Departure</label>
                  <input
                    type="text"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    placeholder="08:30 AM"
                  />
                </div>
                <div className="search-field">
                  <label>Arrival</label>
                  <input
                    type="text"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    placeholder="04:15 PM"
                  />
                </div>
                <div className="search-field">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="7h 45m"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Route Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Non-stop / 1 Stop"
                  />
                </div>
                <div className="search-field">
                  <label>Base Price ($) *</label>
                  <input
                    type="number"
                    min="1"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-field">
                  <label>Seats Available</label>
                  <input
                    type="number"
                    min="0"
                    name="seatsAvailable"
                    value={formData.seatsAvailable}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* GUIDE FORM */}
          {type === 'guide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="search-field">
                <label>Guide Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sophia Rossi"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Region / Area *</label>
                  <input
                    type="text"
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g. Tuscany, Italy"
                  />
                </div>
                <div className="search-field">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Florence"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label>Daily Rate ($) *</label>
                  <input
                    type="number"
                    min="1"
                    name="pricePerDay"
                    required
                    value={formData.pricePerDay}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-field">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>
                <div className="search-field">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="search-field">
                <label>Avatar Photo URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.avatar && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={formData.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avatar Preview</span>
                  </div>
                )}
              </div>

              <div className="search-field">
                <label>Specialty Focus *</label>
                <input
                  type="text"
                  name="specialty"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="e.g. Renaissance Art, Wine Tasting & Countryside Drives"
                />
              </div>

              <div className="search-field">
                <label>Languages (Comma separated)</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English, Italian, German"
                />
              </div>

              <div className="search-field">
                <label>Bio & Background</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Introduce the guide's credentials, passion, and unique local perspective..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* INQUIRY MANAGEMENT */}
          {type === 'inquiry' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item?.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item?.date}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{item?.email}</p>
                <div style={{ fontSize: '0.88rem', background: 'white', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <strong>Message:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>{item?.message}</p>
                </div>
              </div>

              <div className="search-field">
                <label>Update Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                >
                  <option value="New">🟡 New Inquiry</option>
                  <option value="In Progress">🔵 In Progress</option>
                  <option value="Resolved">🟢 Resolved</option>
                  <option value="Archived">⚪ Archived</option>
                </select>
              </div>

              <div className="search-field">
                <label>Reply Note (Internal / Log)</label>
                <textarea
                  name="adminReply"
                  rows={2}
                  value={formData.adminReply}
                  onChange={handleChange}
                  placeholder="Record reply details or notes for the concierge team..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Save size={16} />
              <span>{isEditing ? 'Update Changes' : 'Save & Publish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
