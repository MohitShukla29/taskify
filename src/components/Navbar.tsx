"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="navbar glass">
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div style={{ width: '2rem', height: '2rem', background: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            T
          </div>
          Taskify
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">Projects</Link>
              <div className="flex items-center gap-4 ml-4 pl-4" style={{ borderLeft: '1px solid var(--border-color)' }}>
                <span className="text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="text-sm font-medium hover:text-danger transition-colors">Logout</button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
