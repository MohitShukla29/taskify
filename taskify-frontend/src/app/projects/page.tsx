"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects`, { credentials: 'include' });
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
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc }),
        credentials: 'include',
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
        marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your team projects and workspaces.
          </p>
        </div>
        <button id="btn-new-project" onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Loading projects…
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '50vh', textAlign: 'center', gap: '1.25rem',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-light)', marginBottom: '0.5rem',
            boxShadow: '0 8px 32px var(--primary-glow)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>No projects yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '360px', lineHeight: 1.6 }}>
            Create your first project to start collaborating and tracking tasks with your team.
          </p>
          <button id="btn-create-first-project" onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-lg" style={{ marginTop: '0.75rem' }}>
            Create your first project
          </button>
        </div>
      )}

      {/* Projects grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
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
                aria-label={`View project ${project.name}`}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', fontWeight: 800, color: '#fff',
                      flexShrink: 0,
                      boxShadow: `0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)`,
                    }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '1.05rem', fontWeight: 700,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        letterSpacing: '-0.01em',
                      }}>
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{
                    color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6,
                    flex: 1, marginBottom: '1.5rem',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Progress bar */}
                  {totalTasks > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <span>Progress</span>
                        <span style={{ color: 'var(--emerald)', fontWeight: 800 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: '8px' }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${pct}%`,
                            background: 'var(--emerald)',
                            boxShadow: '0 0 12px var(--emerald-glow)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer stats */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {project._count?.members ?? 0} members
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 id="modal-title" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ color: 'var(--text-muted)' }} aria-label="Close modal">
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="new-project-name" className="form-label">Project name</label>
                <input
                  id="new-project-name"
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
                <label htmlFor="new-project-desc" className="form-label">Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  id="new-project-desc"
                  className="input"
                  value={newProjectDesc}
                  onChange={e => setNewProjectDesc(e.target.value)}
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Briefly describe the project's goal…"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button id="btn-submit-project" type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
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
