import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HOTELS_DATA } from '../data/hotelsData';
import { MOCK_POIS } from '../data/mockPois';
import { MapPin, Hotel, Compass, Star, Eye } from 'lucide-react';

// Fix leaflet default icon asset paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const InteractiveMap = ({ onSelectHotel }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [filterType, setFilterType] = useState('all'); // 'all' | 'hotels' | 'attractions'
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = ['all', 'Goa', 'Paris', 'Bali', 'Kyoto', 'Zermatt', 'New York'];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25.0, 15.0],
        zoom: 2,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    // Refresh markers
    if (markersLayerRef.current && mapInstanceRef.current) {
      markersLayerRef.current.clearLayers();

      // Hotel icon
      const hotelIcon = L.divIcon({
        className: 'custom-hotel-pin',
        html: `<div style="background:#0284c7;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;font-weight:bold;font-size:15px;">🏨</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      // POI icon
      const poiIcon = L.divIcon({
        className: 'custom-poi-pin',
        html: `<div style="background:#f97316;color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;font-weight:bold;font-size:15px;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      // Add Hotels
      if (filterType === 'all' || filterType === 'hotels') {
        HOTELS_DATA.forEach(hotel => {
          if (selectedCity === 'all' || hotel.city.toLowerCase() === selectedCity.toLowerCase()) {
            const marker = L.marker([hotel.lat, hotel.lng], { icon: hotelIcon });
            
            const popupContent = document.createElement('div');
            popupContent.style.width = '240px';
            popupContent.style.fontFamily = 'Inter, sans-serif';
            popupContent.innerHTML = `
              <div style="border-radius:8px;overflow:hidden;margin-bottom:8px;">
                <img src="${hotel.image}" style="width:100%;height:110px;object-fit:cover;" />
              </div>
              <div style="font-size:10px;font-weight:700;color:#0284c7;text-transform:uppercase;">Hotel Resort</div>
              <h4 style="margin:2px 0 4px 0;font-size:14px;font-weight:700;color:#0f172a;">${hotel.name}</h4>
              <div style="font-size:12px;color:#64748b;margin-bottom:6px;">📍 ${hotel.location}</div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:700;color:#f59e0b;font-size:12px;">★ ${hotel.rating}</span>
                <span style="font-weight:800;color:#0284c7;font-size:14px;">$${hotel.pricePerNight} <span style="font-size:10px;font-weight:400;color:#64748b;">/night</span></span>
              </div>
              <button id="book-hotel-${hotel.id}" style="width:100%;background:#0284c7;color:white;border:none;padding:7px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
                View & Book Hotel
              </button>
            `;

            marker.bindPopup(popupContent);
            marker.on('popupopen', () => {
              const btn = document.getElementById(`book-hotel-${hotel.id}`);
              if (btn) {
                btn.onclick = () => {
                  if (onSelectHotel) onSelectHotel(hotel);
                };
              }
            });

            markersLayerRef.current.addLayer(marker);
          }
        });
      }

      // Add POIs
      if (filterType === 'all' || filterType === 'attractions') {
        MOCK_POIS.forEach(poi => {
          if (selectedCity === 'all' || poi.city.toLowerCase() === selectedCity.toLowerCase()) {
            const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
            
            const popupContent = `
              <div style="width:230px;font-family:Inter,sans-serif;">
                <div style="border-radius:8px;overflow:hidden;margin-bottom:8px;">
                  <img src="${poi.image}" style="width:100%;height:110px;object-fit:cover;" />
                </div>
                <div style="font-size:10px;font-weight:700;color:#f97316;text-transform:uppercase;">${poi.category}</div>
                <h4 style="margin:2px 0 4px 0;font-size:14px;font-weight:700;color:#0f172a;">${poi.name}</h4>
                <div style="font-size:12px;color:#64748b;margin-bottom:6px;">📍 ${poi.city} • ★ ${poi.rating}</div>
                <p style="font-size:11px;color:#475569;margin:0;line-height:1.4;">${poi.description}</p>
              </div>
            `;
            marker.bindPopup(popupContent);
            markersLayerRef.current.addLayer(marker);
          }
        });
      }

      // Center map on chosen city
      if (selectedCity !== 'all') {
        const cityHotel = HOTELS_DATA.find(h => h.city.toLowerCase() === selectedCity.toLowerCase());
        if (cityHotel) {
          mapInstanceRef.current.setView([cityHotel.lat, cityHotel.lng], 11);
        }
      }
    }
  }, [filterType, selectedCity, onSelectHotel]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Floating Control Bar */}
      <div 
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Places
          </button>
          <button
            onClick={() => setFilterType('hotels')}
            className={`btn btn-sm ${filterType === 'hotels' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🏨 Stays
          </button>
          <button
            onClick={() => setFilterType('attractions')}
            className={`btn btn-sm ${filterType === 'attractions' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📍 Attractions
          </button>
        </div>

        <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jump to City:</span>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'white'
            }}
          >
            <option value="all">🌍 Global View</option>
            <option value="Goa">Goa, India</option>
            <option value="Paris">Paris, France</option>
            <option value="Bali">Bali, Indonesia</option>
            <option value="Kyoto">Kyoto, Japan</option>
            <option value="Zermatt">Zermatt, Switzerland</option>
            <option value="New York">New York, USA</option>
          </select>
        </div>
      </div>

      {/* Map DOM Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '520px' }}></div>
    </div>
  );
};
