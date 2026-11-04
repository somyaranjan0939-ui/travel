import React, { useState } from 'react';
import { Compass, Hotel, Plane, UserCheck, Map, Bookmark, Phone, Info, User, LogOut, Menu, X, ShieldCheck, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout, openLoginModal, loginAsAdmin } = useAuth();
  const { bookings } = useBooking();
  const { dbStatus } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'tickets', label: 'Tickets', icon: Plane },
    { id: 'guides', label: 'Guides', icon: UserCheck },
    { id: 'map', label: 'Map Explore', icon: Map },
    { id: 'bookings', label: 'My Trips', icon: Bookmark, badge: bookings.length },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="max-w-7xl nav-container">
        {/* Brand */}
        <button 
          className="nav-brand" 
          onClick={() => handleNavClick('home')}
          aria-label="TravelEase Home"
        >
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <span>Travel<span style={{ color: 'var(--primary)' }}>Ease</span></span>
        </button>

        {/* Desktop Nav Items */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="trip-count-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="nav-actions">
          {/* Neon DB Live Status */}
          <div
            className="neon-db-pill"
            title={dbStatus?.connected ? `Connected to Neon PostgreSQL (${dbStatus.database || 'neondb'})` : 'Connecting to Neon PostgreSQL...'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: dbStatus?.connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              color: dbStatus?.connected ? '#047857' : '#b45309',
              border: `1px solid ${dbStatus?.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              cursor: 'default',
              userSelect: 'none'
            }}
          >
            <Database size={13} color={dbStatus?.connected ? '#059669' : '#d97706'} />
            <span>{dbStatus?.connected ? 'Neon DB' : 'Connecting'}</span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: dbStatus?.connected ? '#10b981' : '#f59e0b',
              boxShadow: dbStatus?.connected ? '0 0 6px rgba(16, 185, 129, 0.8)' : 'none'
            }} />
          </div>

          <button
            className={`btn btn-sm ${activePage === 'admin' ? 'btn-primary' : 'btn-secondary'} nav-admin-btn`}
            onClick={() => handleNavClick('admin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.85rem'
            }}
          >
            <ShieldCheck size={15} color={activePage === 'admin' ? 'white' : 'var(--primary)'} />
            <span>Admin</span>
            {user?.role === 'admin' && (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
            )}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.85rem' }}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '210px',
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</p>
                      <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', textTransform: 'capitalize' }}>
                        {user.role}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <button 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      handleNavClick('admin');
                      setUserDropdownOpen(false);
                    }}
                  >
                    <ShieldCheck size={15} color="var(--primary)" />
                    <span>Admin Console</span>
                  </button>
                  <button 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      handleNavClick('bookings');
                      setUserDropdownOpen(false);
                    }}
                  >
                    <Bookmark size={15} color="var(--primary)" />
                    <span>My Bookings ({bookings.length})</span>
                  </button>
                  <button 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--danger)',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={openLoginModal}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <span>Sign In</span>
              </button>
              <button 
                className={`btn btn-sm ${activePage === 'register' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleNavClick('register')}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <User size={14} />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            style={{ display: 'none' }}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: 'white', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 0',
                  fontWeight: 600,
                  color: activePage === item.id ? 'var(--primary)' : 'var(--text-main)'
                }}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="trip-count-badge" style={{ marginLeft: 'auto' }}>{item.badge}</span>
                )}
              </button>
            );
          })}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 0',
              fontWeight: 700,
              color: activePage === 'admin' ? 'var(--primary)' : 'var(--slate-dark)',
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem'
            }}
            onClick={() => handleNavClick('admin')}
          >
            <ShieldCheck size={18} color="var(--primary)" />
            <span>Admin Console</span>
            <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Portal</span>
          </button>

          {!user && (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 0',
                fontWeight: 700,
                color: activePage === 'register' ? 'var(--primary)' : 'var(--primary)',
                borderTop: '1px dashed var(--border-color)',
                marginTop: '0.5rem'
              }}
              onClick={() => handleNavClick('register')}
            >
              <User size={18} color="var(--primary)" />
              <span>Create Free Account / Register</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
