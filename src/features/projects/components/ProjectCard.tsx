import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, Pencil, FolderKanban } from 'lucide-react';
import type { Project } from '../types/project.types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#f3e8ff', color: '#7c3aed', accent: '#7c3aed', label: 'In Progress' };
      case 'Completed':
        return { bg: '#dcfce7', color: '#16a34a', accent: '#10b981', label: 'Completed' };
      case 'OnHold':
        return { bg: '#fef3c7', color: '#d97706', accent: '#f59e0b', label: 'On Hold' };
      default:
        return { bg: '#f3e8ff', color: '#7c3aed', accent: '#7c3aed', label: 'In Progress' };
    }
  };

  const badgeStyle = getStatusBadgeStyle(project.status);

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{
        padding: '24px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderLeft: `5px solid ${badgeStyle.accent}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
      }}
    >
      {/* Card Header: Folder Icon & Edit/Delete Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7c3aed',
          }}
        >
          <FolderKanban size={20} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#334155')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            title="Edit Project"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              background: 'transparent',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f87171')}
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Project Title & Description */}
      <div>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px',
            lineHeight: '1.4',
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            color: '#64748b',
            fontSize: '0.85rem',
            lineHeight: '1.55',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '57px',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer: Calendar Date & Status Pill */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '16px',
          marginTop: '4px',
          fontSize: '0.825rem',
          color: '#64748b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
          <Calendar size={15} style={{ color: '#94a3b8' }} />
          <span>
            {project.startDate
              ? new Date(project.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'No deadline'}
          </span>
        </div>

        <span
          style={{
            background: badgeStyle.bg,
            color: badgeStyle.color,
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {badgeStyle.label}
        </span>
      </div>
    </div>
  );
};
