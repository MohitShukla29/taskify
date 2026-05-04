"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
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
    return <div className="text-center py-20 text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted">Here's an overview of your team's tasks and projects.</p>
        </div>
        <Link href="/projects" className="btn btn-primary">View Projects</Link>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Total Projects</h3>
            <p className="text-4xl font-bold text-primary">{stats.totalProjects}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">My Active Tasks</h3>
            <p className="text-4xl font-bold text-secondary">{stats.userTasksCount}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-main">{stats.totalTasks}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-danger uppercase tracking-wider mb-2">Overdue Tasks</h3>
            <p className="text-4xl font-bold text-danger">{stats.overdueTasks}</p>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center text-muted">Failed to load statistics.</div>
      )}

      {stats && (
        <div className="card w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-6">Tasks by Status</h2>
          <div className="flex flex-col gap-4">
            {Object.entries(stats.tasksByStatus).map(([status, count]: [string, any]) => {
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              let color = 'var(--primary)';
              if (status === 'Done') color = 'var(--success)';
              if (status === 'To Do') color = 'var(--text-muted)';

              return (
                <div key={status} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{status}</span>
                    <span className="text-muted">{count} Tasks</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface-hover)] rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
