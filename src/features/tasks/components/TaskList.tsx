import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, ClipboardList, X, Pencil, Trash2 } from 'lucide-react';
import { useProjectDetails } from '../../projects/hooks/useProjectDetails';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import type { Task, TaskStatus } from '../types/task.types';

export const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const resolvedProjectId = projectId || '';

  const { project, projectLoading, tasks, tasksLoading } = useProjectDetails(resolvedProjectId);
  const { createTask, updateTask, deleteTask } = useTaskMutations(resolvedProjectId);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filtering state
  const [activeFilter, setActiveFilter] = useState<'All' | 'Todo' | 'InProgress' | 'Done'>('All');

  const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask({ id: taskId, data: { status } });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await createTask(data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (data: any) => {
    if (!editingTask) return;
    try {
      await updateTask({
        id: editingTask.id,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate,
        },
      });
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (projectLoading || tasksLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontWeight: 500 }}>
          Project not found.
        </div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Done').length;
  const remainingTasksCount = totalTasksCount - completedTasksCount;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Filter tasks for columns based on active tab
  const getFilteredTasks = (status: TaskStatus) => {
    return tasks.filter((t) => {
      if (t.status !== status) return false;
      if (activeFilter === 'All') return true;
      return t.status === activeFilter;
    });
  };

  const todoTasks = getFilteredTasks('Todo');
  const inProgressTasks = getFilteredTasks('InProgress');
  const doneTasks = getFilteredTasks('Done');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Navigation */}
      <Link
        to="/projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Project Details Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ flex: 1, minWidth: '300px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Project
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
            {project.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.6' }}>
            {project.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', borderLeft: '1px solid var(--border)', paddingLeft: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Progress</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{progressPercent}%</span>
              <div className="progress-bar-container" style={{ width: '80px', height: '6px' }}>
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Remaining Tasks</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{remainingTasksCount}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Working Days</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>08</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Team</span>
            <div style={{ display: 'flex', marginTop: '4px' }}>
              {['JD', 'AM', 'SK'].map((initials, idx) => (
                <div
                  key={initials}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: idx === 0 ? 'var(--primary-glow)' : idx === 1 ? 'var(--success-glow)' : 'var(--warning-glow)',
                    border: '1.5px solid white',
                    marginLeft: idx > 0 ? '-8px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: idx === 0 ? 'var(--primary)' : idx === 1 ? 'var(--success)' : 'var(--warning)',
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {(['All', 'Todo', 'InProgress', 'Done'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            let label = 'All';
            if (filter === 'Todo') label = 'To Do';
            if (filter === 'InProgress') label = 'In Progress';
            if (filter === 'Done') label = 'Completed';

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
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', gap: '8px', padding: '12px 20px', fontWeight: 600 }}
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* Kanban Board columns */}
      {totalTasksCount === 0 ? (
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
            alt="No tasks"
            style={{ width: '180px', height: '180px', objectFit: 'contain', opacity: 0.9 }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No tasks yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Create a task to start organizing your work in this project.
            </p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ marginTop: '8px' }}>
            Add Task
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* To Do Column */}
          {(activeFilter === 'All' || activeFilter === 'Todo') && (
            <div
              className="glass-panel fade-in"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#f1f5f9',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                  To Do
                </h3>
                <span className="badge badge-secondary" style={{ padding: '2px 8px' }}>{todoTasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100px' }}>
                {todoTasks.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No tasks here</p>
                ) : (
                  todoTasks.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onEdit={setEditingTask}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* In Progress Column */}
          {(activeFilter === 'All' || activeFilter === 'InProgress') && (
            <div
              className="glass-panel fade-in"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#f1f5f9',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                  In Progress
                </h3>
                <span className="badge badge-primary" style={{ padding: '2px 8px' }}>{inProgressTasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100px' }}>
                {inProgressTasks.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No tasks here</p>
                ) : (
                  inProgressTasks.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onEdit={setEditingTask}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Done Column */}
          {(activeFilter === 'All' || activeFilter === 'Done') && (
            <div
              className="glass-panel fade-in"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#f1f5f9',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                  Completed
                </h3>
                <span className="badge badge-success" style={{ padding: '2px 8px' }}>{doneTasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100px' }}>
                {doneTasks.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No tasks here</p>
                ) : (
                  doneTasks.map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      onEdit={setEditingTask}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Inventory List View (Rows) */}
      {tasks.length > 0 && (
        <div className="glass-panel fade-in" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Task Inventory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>List view of all project objectives and timelines.</p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Showing {tasks.length} tasks
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Name</th>
                  <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deadline</th>
                  <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                  <th style={{ padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  // Days left helper
                  const getDaysLeft = (dueDateStr?: string) => {
                    if (!dueDateStr) return { text: 'No deadline', isOverdue: false };
                    const due = new Date(dueDateStr);
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

                  const { text: daysText, isOverdue } = getDaysLeft(task.dueDate);

                  const getPriorityClass = (priority: string) => {
                    if (priority === 'High') return 'badge-danger';
                    if (priority === 'Medium') return 'badge-warning';
                    return 'badge-success';
                  };

                  return (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        fontSize: '0.9rem',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Task Name Column */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: task.priority === 'High' ? 'var(--danger-glow)' : 'var(--primary-glow)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: task.priority === 'High' ? 'var(--danger)' : 'var(--primary)',
                            }}
                          >
                            <ClipboardList size={16} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {task.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deadline Column */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-primary)', fontWeight: isOverdue ? 600 : 500 }}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: isOverdue ? 'var(--danger)' : 'var(--text-secondary)', marginTop: '2px' }}>
                          {daysText}
                        </div>
                      </td>

                      {/* Priority Column */}
                      <td style={{ padding: '16px' }}>
                        <span className={`badge ${getPriorityClass(task.priority)}`}>
                          {task.priority === 'High' ? 'Urgent' : task.priority}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td style={{ padding: '16px' }}>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            padding: '4px 8px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Todo">To Do</option>
                          <option value="InProgress">In Progress</option>
                          <option value="Done">Completed</option>
                        </select>
                      </td>

                      {/* Actions Column */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
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
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add New Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <TaskForm
                projectId={resolvedProjectId}
                onSubmit={handleCreateTask}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Edit Task Details</h3>
              <button
                onClick={() => setEditingTask(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <TaskForm
                projectId={resolvedProjectId}
                initialData={editingTask}
                onSubmit={handleEditTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskList;
