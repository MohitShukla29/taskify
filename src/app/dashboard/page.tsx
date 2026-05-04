"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

/* ── Animated count-up hook ── */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start   = performance.now();
    const animate = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (pct < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return value;
}

/* ── Greeting based on time ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Stat Card ── */
function StatCard({ label, value, color, glow, icon }: {
  label: string; value: number; color: string; glow: string; icon: React.ReactNode;
}) {
  const animVal = useCountUp(value);
  return (
    <div className="stat-card" style={{ borderTop: `2px solid ${color}` }}>
      {/* Subtle top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '60px',
        background: `linear-gradient(180deg, ${glow} 0%, transparent 100%)`,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative' }}>
        <div className="stat-icon" style={{ background: `${glow}`, border: `1px solid ${color}40`, color }}>
          {icon}
        </div>
        <div className="stat-value" style={{ color }}>{animVal}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

/* ── Status config ── */
const statusConfig: Record<string, { color: string; glow: string; label: string }> = {
  'To Do':       { color: 'var(--text-muted)', glow: 'rgba(114,104,160,0.2)',  label: 'To Do' },
  'In Progress': { color: 'var(--amber)',       glow: 'var(--amber-glow)',       label: 'In Progress' },
  'Done':        { color: 'var(--emerald)',     glow: 'var(--emerald-glow)',     label: 'Done' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progReady, setProgReady] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setTimeout(() => setProgReady(true), 300);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '50vh', gap: '0.75rem', color: 'var(--text-muted)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Loading your dashboard…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = stats ? [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      color: 'var(--primary-light)',
      glow: 'rgba(124,58,237,0.15)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      label: 'My Active Tasks',
      value: stats.userTasksCount,
      color: 'var(--teal)',
      glow: 'rgba(6,182,212,0.15)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      color: 'var(--text-sub)',
      glow: 'rgba(196,181,253,0.1)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      label: 'Overdue Tasks',
      value: stats.overdueTasks,
      color: 'var(--rose)',
      glow: 'rgba(244,63,94,0.12)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  ] : [];

  return (
    <div className="animate-fade-in">
      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>
            {getGreeting()}
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {user?.name?.split(' ')[0]}&apos;s Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Here&apos;s an overview of your team&apos;s work.
          </p>
        </div>
        <Link href="/projects" className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          View Projects
        </Link>
      </div>

      {/* Stat cards */}
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger" style={{ marginBottom: '2.5rem' }}>
          {statCards.map(card => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          Failed to load statistics.
        </div>
      )}

      {/* Tasks by Status */}
      {stats && (
        <div className="card" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--grad-primary)', display: 'inline-block',
            }}/>
            Tasks by Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(stats.tasksByStatus).map(([status, count]: [string, any]) => {
              const pct  = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              const cfg  = statusConfig[status] ?? { color: 'var(--text-muted)', glow: 'rgba(255,255,255,0.05)', label: status };

              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: cfg.color, display: 'inline-block', flexShrink: 0,
                      }}/>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-sub)' }}>{cfg.label}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {count} {count === 1 ? 'task' : 'tasks'}
                      <span style={{ marginLeft: '0.4rem', color: cfg.color, fontWeight: 700 }}>
                        {Math.round(pct)}%
                      </span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: progReady ? `${pct}%` : '0%',
                        background: cfg.color,
                        boxShadow: `0 0 8px ${cfg.glow}`,
                        animation: progReady ? `progressIn 1.2s cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
