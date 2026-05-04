"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* Gradient initials for project cards */
const GRADIENTS = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #f43f5e)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #a855f7, #f43f5e)',
  'linear-gradient(135deg, #3b82f6, #7c3aed)',
];

export default function Projects() {
  const [projects, setProjects]         = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating]         = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc }),
      });
      if (res.ok) {
        setNewProjectName('');
        setNewProjectDesc('');
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your team projects and workspaces.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Loading projects…
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '50vh', textAlign: 'center', gap: '1rem',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-light)', marginBottom: '0.5rem',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No projects yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px' }}>
            Create your first project to start collaborating and tracking tasks with your team.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Create your first project
          </button>
        </div>
      )}

      {/* Projects grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {projects.map((project, i) => {
            const grad   = GRADIENTS[i % GRADIENTS.length];
            const initial = project.name.charAt(0).toUpperCase();
            const doneTasks = project.tasks?.filter((t: any) => t.status === 'Done').length ?? 0;
            const totalTasks = project._count?.tasks ?? 0;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card"
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Project icon + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 800, color: '#fff',
                      flexShrink: 0,
                      boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
                    }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{
                    color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6,
                    flex: 1, marginBottom: '1.25rem',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Progress bar */}
                  {totalTasks > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>
                        <span>Progress</span>
                        <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${pct}%`,
                            background: 'var(--emerald)',
                            boxShadow: '0 0 8px var(--emerald-glow)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer stats */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem', color: 'var(--text-muted)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {project._count?.members ?? 0} members
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      {totalTasks} tasks
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Create Project Modal ── */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ color: 'var(--text-muted)' }}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project name</label>
                <input
                  type="text"
                  className="input"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  required
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  className="input"
                  value={newProjectDesc}
                  onChange={e => setNewProjectDesc(e.target.value)}
                  style={{ minHeight: '90px', resize: 'vertical' }}
                  placeholder="Briefly describe the project's goal…"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Creating…
                    </>
                  ) : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
