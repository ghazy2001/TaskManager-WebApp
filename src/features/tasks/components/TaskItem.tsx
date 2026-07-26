import React from 'react';
import { Calendar, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../types/task.types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onUpdateStatus }) => {
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return {
          borderLeft: '4px solid #f97316', // Orange
          bg: 'rgba(249, 115, 22, 0.08)',
          color: '#f97316',
          label: 'Urgent',
        };
      case 'Medium':
        return {
          borderLeft: '4px solid #7c3aed', // Purple
          bg: 'rgba(124, 58, 237, 0.08)',
          color: '#7c3aed',
          label: 'Design',
        };
      case 'Low':
        return {
          borderLeft: '4px solid #10b981', // Green
          bg: 'rgba(16, 185, 129, 0.08)',
          color: '#10b981',
          label: 'Low',
        };
      default:
        return {
          borderLeft: '4px solid #94a3b8',
          bg: 'rgba(148, 163, 184, 0.08)',
          color: '#64748b',
          label: priority,
        };
    }
  };

  const styleConfig = getPriorityStyle(task.priority);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderLeft: styleConfig.borderLeft,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Top Header: Custom Priority Badge and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: styleConfig.bg,
            color: styleConfig.color,
          }}
        >
          {styleConfig.label}
        </span>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onEdit(task)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px' }}
            title="Edit Task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
          {task.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {task.description}
        </p>
      </div>

      {/* Footer: Due Date and User Avatar / Status Done */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '14px',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'No date'}
          </span>
        </div>

        {/* Right side: Status checkmark or select switcher + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {task.status === 'Done' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem' }}>
              <CheckCircle2 size={14} />
              <span>Done</span>
            </div>
          ) : (
            <select
              value={task.status}
              onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Todo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          )}

          {/* User Avatar */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 700,
              border: '1px solid var(--primary)',
            }}
          >
            JD
          </div>
        </div>
      </div>
    </div>
  );
};
