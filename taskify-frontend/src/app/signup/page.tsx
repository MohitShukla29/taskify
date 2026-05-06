"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Signup() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res  = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 'calc(100vh - 68px)' }}>

      {/* ── Left brand panel ── */}
      <div
        className="auth-brand-panel hidden md:flex"
        style={{
          flex: '0 0 44%',
          background: 'linear-gradient(145deg, #eef2ff 0%, #f0f9ff 100%)',
          borderRight: '1px solid var(--border)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.75rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.035em', lineHeight: 1.2, color: 'var(--text-main)' }}>
            Join the future of<br />
            <span style={{ color: 'var(--primary)', background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>collaboration.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>
            Experience the most powerful way to align your team, track progress, and hit every deadline.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem', textAlign: 'left', background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
            {[
              ['Next-generation workflows'],
              ['Enterprise-grade security'],
              ['Limitless scalability'],
            ].map(([text]) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600,
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        animation: 'fadeUp 0.4s ease forwards',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
              Create account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Already have one?{' '}
              <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, transition: 'var(--transition-fast)' }} className="hover:text-white">
                Sign in instead
              </Link>
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="signup-name" className="form-label">Full name</label>
              <input
                id="signup-name"
                type="text"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">Email address</label>
              <input
                id="signup-email"
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min. 6 chars)</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem',
                    lineHeight: 1, transition: 'var(--transition-fast)'
                  }}
                  className="hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="signup-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              {isLoading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create Free Account'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .hidden { display: none !important; }
        @media (min-width: 768px) {
          .md\\:flex { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
