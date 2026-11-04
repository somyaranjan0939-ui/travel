import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  MapPin,
  Sparkles,
  Luggage,
  Users,
  Award,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';

export const RegisterPage = ({ setActivePage }) => {
  const { register, openLoginModal } = useAuth();
  const { showToast } = useBooking();

  const [role, setRole] = useState('traveler'); // 'traveler' | 'guide'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#e2e8f0' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10b981' };
      default:
        return { score: 15, label: 'Too short', color: '#ef4444' };
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Register in AuthContext & localStorage
      const authResult = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        role
      );

      // 2. Persist directly into Neon PostgreSQL database via API
      try {
        await api.createUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: role,
          avatar: role === 'guide'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          status: 'Active',
          joined: '2026'
        });
      } catch (dbErr) {
        console.warn('Neon DB user registration async sync note:', dbErr);
      }

      showToast(`🎉 Welcome to TravelEase, ${formData.name.split(' ')[0]}! Your account is active.`, 'success');
      
      // Navigate to home after successful registration
      if (setActivePage) {
        setActivePage('home');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'traveler') {
      setRole('traveler');
      setFormData({
        name: 'Maya Lin',
        email: `maya.${Math.floor(100 + Math.random() * 900)}@travelease.com`,
        city: 'San Francisco, USA',
        password: 'Traveler2026!#',
        confirmPassword: 'Traveler2026!#',
        agreeTerms: true
      });
    } else {
      setRole('guide');
      setFormData({
        name: 'Daisuke Tanaka',
        email: `daisuke.${Math.floor(100 + Math.random() * 900)}@travelease.com`,
        city: 'Kyoto, Japan',
        password: 'GuideExpert2026!#',
        confirmPassword: 'GuideExpert2026!#',
        agreeTerms: true
      });
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#f8fafc', padding: '3rem 1rem' }}>
      <div className="max-w-7xl" style={{ margin: '0 auto' }}>
        {/* Back Link */}
        <button
          onClick={() => setActivePage && setActivePage('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Split Layout Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            background: 'white',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Left Column: Visual Brand & Value Proposition */}
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(145deg, #0b1329 0%, #034b75 100%)',
              color: 'white',
              padding: '3.5rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Background Texture & Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(2, 132, 199, 0.4) 0%, rgba(2, 132, 199, 0) 70%)',
                pointerEvents: 'none'
              }}
            />

            <div>
              {/* Brand Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
                <div
                  style={{
                    background: 'var(--primary)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <Compass size={24} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Travel<span style={{ color: '#38bdf8' }}>Ease</span>
                </span>
              </div>

              {/* Tagline */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1rem'
                }}
              >
                <Sparkles size={13} color="#38bdf8" />
                Join Our Global Travel Community
              </span>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
                Start Your Journey to Unforgettable Places.
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                One membership opens access to world-class resorts, verified local guides, and seamless bookings across 80+ countries.
              </p>

              {/* Value Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '0.4rem', borderRadius: '8px', marginTop: '2px' }}>
                    <CheckCircle2 size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.15rem' }}>Exclusive Member Rates</p>
                    <p style={{ fontSize: '0.83rem', color: 'rgba(255, 255, 255, 0.7)' }}>Save up to 35% on luxury boutique hotels and eco-resorts.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '0.4rem', borderRadius: '8px', marginTop: '2px' }}>
                    <CheckCircle2 size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.15rem' }}>Instant Digital Passes</p>
                    <p style={{ fontSize: '0.83rem', color: 'rgba(255, 255, 255, 0.7)' }}>Mobile vouchers for high-speed rail, airlines, and intercity buses.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '0.4rem', borderRadius: '8px', marginTop: '2px' }}>
                    <CheckCircle2 size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.15rem' }}>Licensed Local Guides</p>
                    <p style={{ fontSize: '0.83rem', color: 'rgba(255, 255, 255, 0.7)' }}>Bespoke excursions curated by verified resident historians and guides.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial / Social Proof */}
            <div
              style={{
                marginTop: '3rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid white', marginLeft: '-10px', objectFit: 'cover' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid white', marginLeft: '-10px', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                  ★ ★ ★ ★ ★
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  Loved by 50,000+ travelers worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div style={{ padding: '3.5rem 3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Create your account
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Enter your details to start booking trips or register as a local guide.
              </p>
            </div>

            {/* Role Switcher Cards */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('traveler')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'traveler' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: role === 'traveler' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Luggage size={18} color={role === 'traveler' ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: role === 'traveler' ? 'var(--primary)' : 'var(--text-main)' }}>
                        Traveler
                      </span>
                    </div>
                    {role === 'traveler' && <CheckCircle2 size={16} color="var(--primary)" />}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Book hotels, tickets & guided adventures
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('guide')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'guide' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: role === 'guide' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={18} color={role === 'guide' ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: role === 'guide' ? 'var(--primary)' : 'var(--text-main)' }}>
                        Local Guide
                      </span>
                    </div>
                    {role === 'guide' && <CheckCircle2 size={16} color="var(--primary)" />}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    List bespoke tours & guide travelers
                  </span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                style={{
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Full Name */}
              <div className="search-field">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Martinez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </div>

              {/* Email & City Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="search-field">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      required
                      placeholder="sophia@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Home City</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Barcelona"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="search-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Create Password</label>
                  {formData.password && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pwdStrength.color }}>
                      {pwdStrength.label}
                    </span>
                  )}
                </div>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ padding: '0.75rem 2.5rem 0.75rem 2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Progress Bar */}
                {formData.password && (
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '4px', marginTop: '0.35rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pwdStrength.score}%`,
                        background: pwdStrength.color,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="search-field">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Confirm Password</label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{ padding: '0.75rem 2.5rem 0.75rem 2.5rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.2rem' }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  style={{ marginTop: '0.25rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="agreeTerms" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, cursor: 'pointer' }}>
                  I agree to the <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</span>,{' '}
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</span>, and travel member guarantee.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <span>Creating your account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Quick Fill testing helpers */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Quick Fill Demo Profiles:
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickFill('traveler')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                >
                  Demo Traveler
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('guide')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                >
                  Demo Guide
                </button>
              </div>
            </div>

            {/* Already have an account link */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  if (openLoginModal) openLoginModal();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
