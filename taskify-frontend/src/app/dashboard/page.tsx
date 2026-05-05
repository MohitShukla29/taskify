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
    <div className="stat-card" style={{ borderTop: `2px solid ${color}`, cursor: 'pointer' }}>
      {/* Subtle top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '60px',
        background: `linear-gradient(180deg, ${glow} 0%, transparent 100%)`,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative' }}>
        <div className="stat-icon" style={{ background: `${glow}`, border: `1px solid ${color}40`, color, transition: 'var(--transition-fast)' }}>
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
  'To Do':       { color: 'var(--text-muted)', glow: 'rgba(114,104,160,0.25)',  label: 'To Do' },
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
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API}/api/dashboard`, {
          credentials: 'include',
        });
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Loading your dashboard…
      </div>
    );
  }

  const statCards = stats ? [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      color: 'var(--primary-light)',
      glow: 'rgba(124,58,237,0.2)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      label: 'My Active Tasks',
      value: stats.userTasksCount,
      color: 'var(--teal)',
      glow: 'rgba(6,182,212,0.2)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      color: 'var(--text-sub)',
      glow: 'rgba(196,181,253,0.15)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      glow: 'rgba(244,63,94,0.18)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            {getGreeting()}
          </p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            {user?.name?.split(' ')[0]}&apos;s Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here&apos;s an overview of your team&apos;s work and progress.
          </p>
        </div>
        <Link href="/projects" className="btn btn-primary" id="dash-view-projects">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          View Projects
        </Link>
      </div>

      {/* Stat cards */}
      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger" style={{ marginBottom: '3rem' }}>
          {statCards.map(card => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          Failed to load statistics.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
        {/* Tasks by Status */}
        {stats && (
          <div className="card w-full">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--grad-primary)', display: 'inline-block',
                boxShadow: '0 0 8px var(--primary-glow)',
              }}/>
              Tasks by Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(stats.tasksByStatus).map(([status, count]: [string, any]) => {
                const pct  = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
                const cfg  = statusConfig[status] ?? { color: 'var(--text-muted)', glow: 'rgba(255,255,255,0.05)', label: status };

                return (
                  <div key={status} style={{ transition: 'var(--transition-fast)' }} className="hover:opacity-90">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: cfg.color, display: 'inline-block', flexShrink: 0,
                          boxShadow: `0 0 8px ${cfg.glow}`,
                        }}/>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-sub)' }}>{cfg.label}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {count} {count === 1 ? 'task' : 'tasks'}
                        <span style={{ marginLeft: '0.5rem', color: cfg.color, fontWeight: 700, display: 'inline-block', minWidth: '3ch', textAlign: 'right' }}>
                          {Math.round(pct)}%
                        </span>
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: progReady ? `${pct}%` : '0%',
                          background: cfg.color,
                          boxShadow: `0 0 10px ${cfg.glow}`,
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

        {/* Tasks per User */}
        {stats && stats.tasksPerUser && (
          <div className="card w-full">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--grad-teal)', display: 'inline-block',
                boxShadow: '0 0 8px var(--teal-glow)',
              }}/>
              Tasks per User
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.tasksPerUser.length > 0 ? stats.tasksPerUser.map((u: any, idx: number) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: '#fff'
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {u.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {u.count} {u.count === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                  No assigned tasks found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
