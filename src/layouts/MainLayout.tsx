import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, Settings, X, Zap, Bell, Search, Menu } from 'lucide-react';

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
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
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
            className="sidebar-close-btn btn btn-secondary btn-icon"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            aria-label="Close menu"
          >
            <X size={20} />
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
                onClick={() => setIsSidebarOpen(false)}
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
            onClick={() => {
              setIsSidebarOpen(false);
              navigate('/projects?new=true');
            }}
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
      <div className="main-content">
        {/* Header */}
        <header className="app-header glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger button for mobile screens */}
            <button
              onClick={toggleSidebar}
              className="mobile-nav-toggle"
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>

            {/* Search bar inside header */}
            <div
              className="search-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f1f5f9',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                width: '300px',
              }}
            >
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* User profile & notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '14px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  border: '1px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                JD
              </div>
              <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>John Doe</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="main-layout-body">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default MainLayout;

