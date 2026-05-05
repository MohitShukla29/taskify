"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return null;

  const navLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/projects',  label: 'Projects'  },
      ]
    : [];

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} role="banner">
      <div className="container flex justify-between items-center">

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }} aria-label="Taskify home">
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124,58,237,0.55)',
            flexShrink: 0,
            transition: 'var(--transition-fast)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span style={{
            fontWeight: 800, fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #ede9fe, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', letterSpacing: '-0.02em',
          }}>
            Taskify
          </span>
        </Link>

        {/* Nav + user section */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} role="navigation" aria-label="Main navigation">

          {/* Page links */}
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase()}`}
                style={{
                  padding: '0.38rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(124,58,237,0.14)' : 'transparent',
                  border: isActive ? '1px solid rgba(124,58,237,0.28)' : '1px solid transparent',
                  transition: 'var(--transition-fast)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-main)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth section */}
          {user ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginLeft: '0.5rem', paddingLeft: '0.875rem',
              borderLeft: '1px solid var(--border-subtle)',
            }}>
              {/* Avatar */}
              <div title={user.name} style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: '2px solid rgba(124,58,237,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 0 12px rgba(124,58,237,0.4)',
                flexShrink: 0,
                cursor: 'default',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-sub)' }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                id="nav-logout"
                onClick={logout}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.35rem 0.625rem', transition: 'var(--transition-fast)' }}
                aria-label="Log out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Link href="/login"  id="nav-login"  className="btn btn-secondary btn-sm">Login</Link>
              <Link href="/signup" id="nav-signup" className="btn btn-primary  btn-sm">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
