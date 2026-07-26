import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, X, Loader2, Sparkles, FolderKanban, Pencil, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import type { Project, ProjectStatus } from '../types/project.types';

export const ProjectList: React.FC = () => {
  const { projects, isLoading, isError, createProject, updateProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  // Router-driven state for the New Project modal (sidebar integration)
  const [searchParams, setSearchParams] = useSearchParams();
  const showAddModal = searchParams.get('new') === 'true';

  // Local state for edit modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [startDate, setStartDate] = useState('');

  // Active status filter: 'All' | 'Active' | 'Completed'
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // Handle edit click
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setStatus(project.status);
    setStartDate(project.startDate || '');
  };

  // Close modals
  const handleCloseModals = () => {
    if (showAddModal) {
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
    setEditingProject(null);
    // Reset forms
    setName('');
    setDescription('');
    setStatus('Active');
    setStartDate('');
  };

  // Submit project (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          data: {
            name,
            description,
            status,
            startDate: startDate || undefined,
          },
        });
      } else {
        await createProject({
          name,
          description,
          status: 'Active', // Default status for new projects
          startDate: startDate || undefined,
        });
      }
      handleCloseModals();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? All associated tasks will also be removed.')) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  // Filter projects list
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.status === activeFilter;
  });

  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading project workspace...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '24px', background: 'var(--danger-glow)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>
        Failed to load projects. Please verify your local storage permissions.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header and Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Work Overview
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            Project Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{activeProjectsCount}</span> Active Projects
            </span>
          </div>

          <button
            onClick={() => setSearchParams({ new: 'true' })}
            className="btn btn-primary"
            style={{ display: 'flex', gap: '8px', padding: '12px 20px', fontWeight: 600 }}
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
          Filter By:
        </span>
        {(['All', 'Active', 'Completed'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="btn"
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {filter === 'Active' ? 'In Progress' : filter}
            </button>
          );
        })}
      </div>

      {/* Projects Section */}
      {filteredProjects.length === 0 ? (
        <div
          className="glass-panel fade-in"
          style={{
            padding: '64px 32px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            border: '1px dashed var(--border)',
          }}
        >
          <img
            src="/empty-state.png"
            alt="No projects"
            style={{ width: '180px', height: '180px', objectFit: 'contain', opacity: 0.9 }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No projects found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              No projects matching "{activeFilter === 'Active' ? 'In Progress' : activeFilter}" status.
            </p>
          </div>
          {activeFilter !== 'All' ? (
            <button onClick={() => setActiveFilter('All')} className="btn btn-secondary">
              Show All Projects
            </button>
          ) : (
            <button onClick={() => setSearchParams({ new: 'true' })} className="btn btn-primary" style={{ marginTop: '8px' }}>
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 1. Projects Cards Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Project Cards
            </h3>
            <div
              className="fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>

          {/* 2. Projects Rows Table */}
          <div className="glass-panel fade-in" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Project Inventory List</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>Overview table displaying progress and deadlines.</p>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Showing {filteredProjects.length} projects
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Name</th>
                    <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deadline</th>
                    <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress</th>
                    <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const totalTasks = project.tasksCount || 0;
                    const completedTasks = project.completedTasksCount || 0;
                    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    // Days left helper
                    const getDaysLeft = (startDateStr?: string) => {
                      if (!startDateStr) return { text: 'No deadline', isOverdue: false };
                      const due = new Date(startDateStr);
                      const today = new Date();
                      due.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      const diff = due.getTime() - today.getTime();
                      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                      if (days < 0) return { text: 'Overdue', isOverdue: true };
                      if (days === 0) return { text: 'Due today', isOverdue: false };
                      if (days === 1) return { text: '1 day left', isOverdue: false };
                      return { text: `${days} days left`, isOverdue: false };
                    };

                    const { text: daysText, isOverdue } = getDaysLeft(project.startDate);

                    const getBadgeStyle = (status: ProjectStatus) => {
                      if (status === 'Active') return { bg: 'var(--primary-glow)', color: 'var(--primary)', label: '• Active' };
                      if (status === 'Completed') return { bg: 'var(--success-glow)', color: 'var(--success)', label: 'Completed' };
                      return { bg: 'var(--warning-glow)', color: 'var(--warning)', label: 'On Hold' };
                    };

                    const badgeInfo = getBadgeStyle(project.status);

                    return (
                      <tr
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background-color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {/* Project Name Column */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'var(--primary-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                              }}
                            >
                              <FolderKanban size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{project.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {project.description || 'No details provided.'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Deadline Column */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-primary)', fontWeight: isOverdue ? 600 : 500 }}>
                            {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: isOverdue ? 'var(--danger)' : 'var(--text-secondary)', marginTop: '2px' }}>
                            {daysText}
                          </div>
                        </td>

                        {/* Progress Column */}
                        <td style={{ padding: '16px', minWidth: '160px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                            <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-primary)' }}>{progressPercent}%</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{completedTasks}/{totalTasks} tasks</span>
                          </div>
                          <div className="progress-bar-container" style={{ height: '6px' }}>
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${progressPercent}%`,
                                backgroundColor: isOverdue ? 'var(--danger)' : 'var(--primary)',
                              }}
                            />
                          </div>
                        </td>

                        {/* Status Column */}
                        <td style={{ padding: '16px' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: badgeInfo.bg,
                              color: badgeInfo.color,
                            }}
                          >
                            {badgeInfo.label}
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                              }}
                              className="btn btn-secondary btn-icon"
                              style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project.id);
                              }}
                              className="btn btn-secondary btn-icon"
                              style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal Overlay */}
      {(showAddModal || !!editingProject) && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 24px 16px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Workspace
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)' }}>
                  {editingProject ? 'Edit Project Settings' : 'Create New Project'}
                </h2>
              </div>
              <button
                onClick={handleCloseModals}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Website Redesign"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'none' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the primary objectives and key results..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {editingProject ? (
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    >
                      <option value="Active">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="OnHold">On Hold</option>
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input">
                      <option>Design</option>
                      <option>Development</option>
                      <option>Marketing</option>
                      <option>Internal Ops</option>
                    </select>
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <button type="button" onClick={handleCloseModals} className="btn btn-secondary" style={{ padding: '8px 18px', fontWeight: 600 }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={16} fill="white" />
                  {editingProject ? 'Save Changes' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectList;
