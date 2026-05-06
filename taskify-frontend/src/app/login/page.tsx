"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Login() {
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
      const res  = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      minHeight: 'calc(100vh - 68px)',
    }}>
      {/* ── Left brand panel ── */}
      <div style={{
        flex: '0 0 44%',
        background: 'linear-gradient(145deg, #eef2ff 0%, #f0f9ff 100%)',
        borderRight: '1px solid var(--border)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="auth-brand-panel hidden md:flex"
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
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
            Empower your<br />
            <span style={{ color: 'var(--primary)', background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>productivity.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>
            Seamlessly organize your work, collaborate in real-time, and ship faster than ever before.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: 'Blazing Fast' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Bank-grade Security' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, label: 'Seamless Sync' }
            ].map(({ icon, label }) => (
              <div key={label} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: 'var(--shadow-sm)',
                backdropFilter: 'blur(10px)',
              }}>
                <span style={{ color: 'var(--primary)' }}>{icon}</span>
                {label}
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
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
              Sign in
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              id="login-submit"
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
                  Signing in…
                </>
              ) : 'Sign In'}
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
