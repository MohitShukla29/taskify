"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const features = [
  {
    icon: <IconUsers />,
    title: "Team Collaboration",
    desc: "Work together seamlessly. Share projects, assign tasks and stay in sync — all in one beautiful workspace.",
    color: "var(--primary)",
    glow: "var(--primary-glow)",
    num: "01",
  },
  {
    icon: <IconCheck />,
    title: "Kanban Tracking",
    desc: "Visualize what's in progress, done, or overdue. Keep your team moving with a real-time kanban board.",
    color: "var(--teal)",
    glow: "var(--teal-glow)",
    num: "02",
  },
  {
    icon: <IconShield />,
    title: "Role-Based Access",
    desc: "Admins create and assign work. Members focus on execution. Fine-grained control keeps everyone accountable.",
    color: "var(--amber)",
    glow: "var(--amber-glow)",
    num: "03",
  },
];

const stats = [
  { value: "10k+", label: "Active teams" },
  { value: "500k+", label: "Tasks shipped" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9", label: "Average rating", icon: <IconStar /> },
];

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>

      {/* Decorative orbs — static, no continuous animation per skill UX guideline */}
      <div style={{
        position: "absolute", top: "-140px", left: "-120px",
        width: "560px", height: "560px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: "80px", right: "-160px",
        width: "440px", height: "440px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,63,94,0.14) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "40px", left: "35%",
        width: "380px", height: "380px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 1, paddingTop: "7rem", paddingBottom: "4rem", textAlign: "center" }}>
        <div className="container">

          {/* Animated badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: "999px",
            padding: "0.4rem 1.1rem",
            fontSize: "0.8rem", fontWeight: 600,
            color: "var(--primary-light)",
            marginBottom: "2.25rem",
            animation: "fadeDown 0.5s ease forwards, badge-pulse 3s ease-in-out 1s infinite",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "var(--primary-light)",
              display: "inline-block",
              animation: "glow-pulse 2s ease-in-out infinite",
              boxShadow: "0 0 8px var(--primary-glow)",
            }} />
            Team Task Management — Reimagined
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            marginBottom: "1.5rem",
            animation: "fadeUp 0.55s 0.1s ease both",
          }}>
            Ship Projects Faster,<br />
            <span className="gradient-text">Together.</span>
          </h1>

          <p style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            maxWidth: "540px",
            margin: "0 auto 2.75rem",
            lineHeight: 1.75,
            animation: "fadeUp 0.55s 0.2s ease both",
          }}>
            Taskify gives your team one beautiful place to plan, assign, and track every piece of work — from idea to done.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap",
            animation: "fadeUp 0.55s 0.3s ease both",
          }}>
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg" id="hero-cta-dashboard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn btn-primary btn-lg" id="hero-cta-signup">
                  Get Started — It&apos;s Free
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
                <Link href="/login" className="btn btn-secondary btn-lg" id="hero-cta-login">Log In</Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", marginTop: "2.25rem",
            animation: "fadeUp 0.55s 0.4s ease both",
          }}>
            {/* Avatar stack */}
            <div style={{ display: "flex" }}>
              {["#7c3aed","#06b6d4","#f43f5e","#f59e0b"].map((c, i) => (
                <div key={i} style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: c, border: "2px solid var(--bg-base)",
                  marginLeft: i === 0 ? 0 : "-8px",
                  fontSize: "0.65rem", fontWeight: 700, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{["M","A","R","S"][i]}</div>
              ))}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Loved by <strong style={{ color: "var(--text-sub)" }}>10,000+</strong> teams worldwide
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: "3.5rem" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1px",
            background: "var(--border-subtle)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            animation: "fadeUp 0.55s 0.45s ease both",
          }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "var(--bg-surface)",
                padding: "1.5rem",
                textAlign: "center",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)"}
              >
                <div style={{
                  fontSize: "1.875rem", fontWeight: 800,
                  letterSpacing: "-0.04em", lineHeight: 1,
                  background: "var(--grad-primary)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                  marginBottom: "0.375rem",
                }}>
                  {s.value}
                  {s.icon && <span style={{ WebkitTextFillColor: "var(--amber)", color: "var(--amber)" }}>{s.icon}</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary-light)", marginBottom: "0.75rem" }}>
              Why Taskify
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Everything your team needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ textAlign: "left", cursor: "default" }}>
                {/* Number accent */}
                <div style={{
                  position: "absolute", top: "1.25rem", right: "1.25rem",
                  fontSize: "3rem", fontWeight: 900, lineHeight: 1,
                  color: "rgba(255,255,255,0.03)",
                  letterSpacing: "-0.05em",
                  pointerEvents: "none",
                  userSelect: "none",
                }}>{f.num}</div>

                {/* Icon */}
                <div style={{
                  width: "50px", height: "50px",
                  borderRadius: "14px",
                  background: `rgba(0,0,0,0.35)`,
                  border: `1px solid ${f.glow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color,
                  marginBottom: "1.375rem",
                  boxShadow: `0 4px 20px ${f.glow}`,
                  transition: "var(--transition-fast)",
                }}>
                  {f.icon}
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.625rem", color: "var(--text-main)" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA STRIP ── */}
      {!user && (
        <section style={{ position: "relative", zIndex: 1, paddingBottom: "6rem" }}>
          <div className="container">
            <div style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(244,63,94,0.1) 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "var(--radius-xl)",
              padding: "3rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.75rem", position: "relative" }}>
                Ready to ship faster?
              </h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem", position: "relative" }}>
                Join thousands of teams already using Taskify. Free forever.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
                <Link href="/signup" className="btn btn-primary btn-lg" id="bottom-cta-signup">
                  Create Free Account
                </Link>
                <Link href="/login" className="btn btn-secondary btn-lg" id="bottom-cta-login">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
