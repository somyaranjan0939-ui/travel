import React from 'react';
import { Plane, Train, Bus, Clock, Luggage, ArrowRight, ShieldCheck } from 'lucide-react';

export const TicketCard = ({ ticket, onSelect }) => {
  const getModeIcon = (mode) => {
    switch (mode) {
      case 'flight':
        return <Plane size={24} />;
      case 'train':
        return <Train size={24} />;
      case 'bus':
        return <Bus size={24} />;
      default:
        return <Plane size={24} />;
    }
  };

  return (
    <div className="ticket-card">
      {/* Mode & Carrier */}
      <div className="ticket-carrier-box">
        <div className="mode-icon-circle">
          {getModeIcon(ticket.mode)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{ticket.carrier}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.flightNo}</span>
        </div>
      </div>

      {/* Flight / Transit Route & Times */}
      <div className="flight-route-info">
        <div className="route-stop" style={{ textAlign: 'left' }}>
          <div className="route-time">{ticket.departureTime}</div>
          <div className="route-city">{ticket.origin}</div>
        </div>

        <div className="route-mid">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} /> {ticket.duration}
          </span>
          <div className="route-line"></div>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
            {ticket.type}
          </span>
        </div>

        <div className="route-stop" style={{ textAlign: 'right' }}>
          <div className="route-time">{ticket.arrivalTime}</div>
          <div className="route-city">{ticket.destination}</div>
        </div>
      </div>

      {/* Price & Action */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Starting from</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            ${ticket.price}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / passenger</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ShieldCheck size={14} /> {ticket.seatsAvailable} seats left
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => onSelect(ticket)}
          style={{ width: '100%' }}
        >
          <span>Select & Book</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
