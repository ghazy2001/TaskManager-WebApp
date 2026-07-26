import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, Settings, X, Zap, Bell, Search } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { label: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Mobile Sidebar Toggle Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="glass-panel"
        style={{
          width: '260px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(0)',
          transition: 'transform var(--transition-normal)',
          // Simple responsive mock via transform for mobile handled inline
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Zap size={18} fill="white" />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              Vivid Productivity
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="btn btn-secondary btn-icon"
            style={{ display: 'none', border: 'none', background: 'transparent' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with + New Project Button */}
        <div style={{ padding: '24px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => navigate('/projects?new=true')}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Zap size={16} fill="white" />
            + New Project
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className="main-content"
        style={{
          marginLeft: '260px',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          className="glass-panel"
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Search bar inside header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '8px 16px', borderRadius: 'var(--radius-full)', width: '300px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: 'var(--text-primary)' }}
            />
          </div>

          {/* User profile & notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  border: '1px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  fontSize: '0.9rem',
                }}
              >
                JD
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>John Doe</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
