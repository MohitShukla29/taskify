"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted">Manage your team projects and workspaces.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="text-4xl mb-4 opacity-50">📁</div>
          <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
          <p className="text-muted mb-6">Create your first project to start managing tasks.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Create Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="card hover:border-[var(--primary)] transition-all">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-muted text-sm mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>
              
              <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-4">
                <div className="flex items-center gap-1 text-muted">
                  <span>👥</span> {project._count?.members || 0} Members
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <span>📝</span> {project._count?.tasks || 0} Tasks
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-muted hover:text-main"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)} 
                  required 
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea 
                  className="input min-h-[100px] resize-y" 
                  value={newProjectDesc} 
                  onChange={(e) => setNewProjectDesc(e.target.value)} 
                  placeholder="Briefly describe the project..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
