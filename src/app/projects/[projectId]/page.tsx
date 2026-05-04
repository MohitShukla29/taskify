"use client";

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // New Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskAssignee, setTaskAssignee] = useState('');

  // New Member form state
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('MEMBER');

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setTasks(data.project.tasks);
      } else {
        setError('Failed to load project details.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          assigneeId: taskAssignee || null,
        })
      });
      if (res.ok) {
        setTaskTitle(''); setTaskDesc(''); setTaskAssignee('');
        setIsTaskModalOpen(false);
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail, role: memberRole })
      });
      if (res.ok) {
        setMemberEmail('');
        setIsMemberModalOpen(false);
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchProjectData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-muted">Loading project...</div>;
  if (error || !project) return <div className="text-center py-20 text-danger">{error || 'Project not found'}</div>;

  const isAdmin = project.members.some((m: any) => m.userId === user?.id && m.role === 'ADMIN');
  
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-muted">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setIsMemberModalOpen(true)} className="btn btn-secondary">Add Member</button>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">Create Task</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Task Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map(status => (
              <div key={status} className="bg-[var(--bg-surface)] p-4 rounded-md border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{status}</h3>
                  <span className="badge badge-info">{tasks.filter(t => t.status === status).length}</span>
                </div>
                <div className="flex flex-col gap-3 min-h-[200px]">
                  {tasks.filter(t => t.status === status).map(task => (
                    <div key={task.id} className="card p-3 border-l-4" style={{ borderLeftColor: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)' }}>
                      <h4 className="font-semibold mb-1 text-sm">{task.title}</h4>
                      {task.description && <p className="text-xs text-muted mb-2 line-clamp-2">{task.description}</p>}
                      <div className="flex justify-between items-center text-xs text-muted mt-2">
                        <span>{task.assignee ? task.assignee.name : 'Unassigned'}</span>
                        <select 
                          className="bg-transparent border-none outline-none cursor-pointer"
                          value={task.status}
                          onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                          disabled={!isAdmin && task.assigneeId !== user?.id}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {tasks.filter(t => t.status === status).length === 0 && (
                    <div className="text-center text-muted text-sm py-4 border-2 border-dashed border-[var(--border-color)] rounded">No tasks</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Team ({project.members.length})</h2>
          <div className="flex flex-col gap-3">
            {project.members.map((member: any) => (
              <div key={member.id} className="card p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs">
                    {member.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{member.user.name}</div>
                    <div className="text-xs text-muted">{member.user.email}</div>
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

      {/* Modals here... */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in relative">
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-main">✕</button>
            <h2 className="text-xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" className="input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input min-h-[80px]" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="input" value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <select className="input" value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
                    <option value="">Unassigned</option>
                    {project.members.map((m: any) => (
                      <option key={m.userId} value={m.userId}>{m.user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in relative">
            <button onClick={() => setIsMemberModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-main">✕</button>
            <h2 className="text-xl font-bold mb-6">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">User Email</label>
                <input type="email" className="input" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="input" value={memberRole} onChange={(e) => setMemberRole(e.target.value)}>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
