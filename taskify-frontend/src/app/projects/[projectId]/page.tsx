"use client";

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';

/* ── Column config ── */
const COLUMNS = [
  {
    status: 'To Do',
    color: 'var(--text-muted)',
    glow: 'rgba(114,104,160,0.12)',
    accent: '#7268a0',
  },
  {
    status: 'In Progress',
    color: 'var(--amber)',
    glow: 'var(--amber-glow)',
    accent: '#f59e0b',
  },
  {
    status: 'Done',
    color: 'var(--emerald)',
    glow: 'var(--emerald-glow)',
    accent: '#10b981',
  },
];

const PRIORITY_COLOR: Record<string, string> = {
  High:   'var(--rose)',
  Medium: 'var(--amber)',
  Low:    'var(--emerald)',
};

/* ── Close icon ── */
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;
  const { user } = useAuth();

  const [project, setProject]   = useState<any>(null);
  const [tasks,   setTasks]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState('');

  const [isTaskModalOpen,   setIsTaskModalOpen]   = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [taskTitle,    setTaskTitle]    = useState('');
  const [taskDesc,     setTaskDesc]     = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskAssignee, setTaskAssignee] = useState('');

  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole,  setMemberRole]  = useState('MEMBER');

  useEffect(() => { fetchProjectData(); }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects/${projectId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setTasks(data.project.tasks);
      } else {
        setError('Failed to load project details.');
      }
    } catch {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, description: taskDesc, priority: taskPriority, assigneeId: taskAssignee || null }),
        credentials: 'include',
      });
      if (res.ok) {
        setTaskTitle(''); setTaskDesc(''); setTaskAssignee('');
        setIsTaskModalOpen(false);
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { console.error(err); }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail, role: memberRole }),
        credentials: 'include',
      });
      if (res.ok) {
        setMemberEmail('');
        setIsMemberModalOpen(false);
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '0.75rem', color: 'var(--text-muted)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Loading project…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--rose)' }}>
        {error || 'Project not found'}
      </div>
    );
  }

  const isAdmin = project.members.some((m: any) => m.userId === user?.id && m.role === 'ADMIN');

  return (
    <div className="animate-fade-in">
      {/* ── Project Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            {project.name}
          </h1>
          {project.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{project.description}</p>
          )}
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="btn btn-secondary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Add Member
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-primary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Task
            </button>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem' }}>

        {/* ── Kanban Board ── */}
        <div>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
            Task Board
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.status);
              return (
                <div
                  key={col.status}
                  className="kanban-col"
                  style={{ borderTop: `2px solid ${col.accent}` }}
                >
                  <div className="kanban-col-header">
                    <span
                      className="kanban-col-title"
                      style={{ color: col.color }}
                    >
                      {col.status}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      background: `${col.glow}`,
                      border: `1px solid ${col.accent}40`,
                      color: col.color,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      {colTasks.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '200px' }}>
                    {colTasks.map(task => (
                      <div
                        key={task.id}
                        className={`task-card priority-${task.priority.toLowerCase()}`}
                      >
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.625rem', lineHeight: 1.5 }}
                             className="line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem' }}>
                          {/* Assignee */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            {task.assignee ? (
                              <>
                                <div style={{
                                  width: '20px', height: '20px', borderRadius: '50%',
                                  background: 'var(--grad-primary)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.6rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                                }}>
                                  {task.assignee.name.charAt(0)}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {task.assignee.name.split(' ')[0]}
                                </span>
                              </>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                            )}
                          </div>

                          {/* Priority badge + Status select */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{
                              fontSize: '0.65rem', fontWeight: 700,
                              color: PRIORITY_COLOR[task.priority],
                              padding: '0.1rem 0.4rem',
                              background: `${PRIORITY_COLOR[task.priority]}18`,
                              border: `1px solid ${PRIORITY_COLOR[task.priority]}35`,
                              borderRadius: 'var(--radius-full)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={e => handleUpdateTaskStatus(task.id, e.target.value)}
                              disabled={!isAdmin && task.assigneeId !== user?.id}
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-muted)',
                                fontSize: '0.72rem',
                                padding: '0.2rem 0.4rem',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'inherit',
                              }}
                            >
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '2rem 1rem',
                        border: '1px dashed rgba(114,104,160,0.2)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem', textAlign: 'center', gap: '0.5rem',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        No tasks here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Team sidebar ── */}
        <div>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
            Team · {project.members.length}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.members.map((member: any) => (
              <div
                key={member.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(22,20,39,0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.25)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(30,28,51,0.8)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.background  = 'rgba(22,20,39,0.6)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: member.role === 'ADMIN'
                      ? 'linear-gradient(135deg, #f59e0b, #f43f5e)'
                      : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    border: member.role === 'ADMIN' ? '2px solid rgba(245,158,11,0.4)' : '2px solid rgba(124,58,237,0.4)',
                    boxShadow: member.role === 'ADMIN' ? '0 0 8px rgba(245,158,11,0.25)' : '0 0 8px rgba(124,58,237,0.2)',
                  }}>
                    {member.user.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.user.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.user.email}
                    </div>
                  </div>
                </div>
                <span className={`badge ${member.role === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Create Task Modal ── */}
      {isTaskModalOpen && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setIsTaskModalOpen(false); }}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Task</h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="btn-ghost" style={{ color: 'var(--text-muted)' }}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Task title</label>
                <input type="text" className="input" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required placeholder="e.g. Design the onboarding screen" />
              </div>
              <div className="form-group">
                <label className="form-label">Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="input" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} placeholder="What needs to be done?" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="input" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select className="input" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)}>
                    <option value="">Unassigned</option>
                    {project.members.map((m: any) => (
                      <option key={m.userId} value={m.userId}>{m.user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Member Modal ── */}
      {isMemberModalOpen && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setIsMemberModalOpen(false); }}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Team Member</h2>
              <button onClick={() => setIsMemberModalOpen(false)} className="btn-ghost" style={{ color: 'var(--text-muted)' }}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input type="email" className="input" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required placeholder="teammate@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="input" value={memberRole} onChange={e => setMemberRole(e.target.value)}>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Member
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
