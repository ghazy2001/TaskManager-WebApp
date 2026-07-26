import React, { useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types/task.types';

interface TaskFormProps {
  projectId: string;
  initialData?: Task;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'Medium');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'Todo');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status: initialData ? status : 'Todo',
        dueDate: dueDate || undefined,
      });
    } catch (error) {
      console.error('Failed to submit task form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Task Title</label>
        <input
          type="text"
          required
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Update design guidelines"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          style={{ minHeight: '80px', resize: 'none' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: initialData ? '1fr 1fr 1fr' : '1fr 1fr', gap: '12px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Priority</label>
          <select
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            disabled={isSubmitting}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {initialData && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              disabled={isSubmitting}
            >
              <option value="Todo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '8px',
          borderTop: '1px solid var(--border)',
          paddingTop: '16px',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', minWidth: '100px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
export default TaskForm;
