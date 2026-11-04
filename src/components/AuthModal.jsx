import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ setActivePage }) => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register, loginAsAdmin } = useAuth();

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Morgan');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(email, password);
    } else {
      register(name, email, password);
    }
  };

  const handleDemoLogin = (demoName, demoEmail) => {
    login(demoEmail, 'demo123');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: authMode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: authMode === 'login' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: authMode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: authMode === 'register' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Create Account
            </button>
          </div>

          <button className="modal-close-btn" onClick={() => setIsAuthModalOpen(false)} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.75rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authMode === 'register' && (
              <div className="search-field">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="search-field">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  required
                  placeholder="alex.morgan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="search-field">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
              <span>{authMode === 'login' ? 'Sign In to TravelEase' : 'Create Free Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
              Quick Demo Accounts
            </span>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('Alex Morgan', 'alex.morgan@example.com')}
              >
                Alex (Traveler)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDemoLogin('Elena Rostova', 'elena.rostova@globetrek.io')}
              >
                Elena (Business)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}
                onClick={() => loginAsAdmin ? loginAsAdmin() : handleDemoLogin('Marcus Vance', 'admin@travelease.com')}
              >
                Marcus (👑 Admin)
              </button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  if (setActivePage) setActivePage('register');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Prefer a dedicated page? Open Full Register Page →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
