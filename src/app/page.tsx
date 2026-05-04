"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// SVG icon components
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const features = [
  {
    icon: <IconUsers />,
    title: "Collaborate",
    desc: "Work together with your team seamlessly. Share projects, assign tasks and stay in sync — all in one place.",
    color: "var(--primary)",
    glow: "var(--primary-glow)",
  },
  {
    icon: <IconCheck />,
    title: "Track Progress",
    desc: "Visualize what's in progress, done, or overdue. Keep your team moving forward with a real-time kanban board.",
    color: "var(--teal)",
    glow: "var(--teal-glow)",
  },
  {
    icon: <IconShield />,
    title: "Manage Roles",
    desc: "Admins create and assign work. Members focus on execution. Role-based control keeps everyone accountable.",
    color: "var(--amber)",
    glow: "var(--amber-glow)",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-100px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        animation: 'orb-float 12s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, transparent 70%)',
        animation: 'orb-float 16s ease-in-out infinite reverse',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '0', left: '40%',
        width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        animation: 'orb-float 20s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            fontSize: '0.8rem', fontWeight: 600,
            color: 'var(--primary-light)',
            marginBottom: '2rem',
            animation: 'fadeUp 0.5s ease forwards',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-light)', display: 'inline-block' }} />
            Team Task Management — Reimagined
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.5s 0.1s ease forwards',
            opacity: 0,
          }}>
            Ship Projects Faster,<br />
            <span className="gradient-text">Together.</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            animation: 'fadeUp 0.5s 0.2s ease forwards',
            opacity: 0,
          }}>
            Taskify gives your team one beautiful place to plan, assign, and track every piece of work — from idea to done.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeUp 0.5s 0.3s ease forwards',
            opacity: 0,
          }}>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn btn-primary btn-lg">
                  Get Started — It&apos;s Free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                <Link href="/login" className="btn btn-secondary btn-lg">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ position: 'relative', zIndex: 1, paddingBottom: '6rem' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {features.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ textAlign: 'left' }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '14px',
                  background: `rgba(0,0,0,0.3)`,
                  border: `1px solid ${f.glow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color,
                  marginBottom: '1.25rem',
                  boxShadow: `0 4px 16px ${f.glow}`,
                }}>
                  {f.icon}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
