import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings } from 'lucide-react';

const LOGO_LETTERS = ['D','o','c','S','p','h','e','r','e'];

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard',   path: '/dashboard',   icon: LayoutDashboard, color: 'var(--g-blue)', bg: 'rgba(66, 133, 244, 0.08)' },
        { label: 'Workspaces',  path: '/workspaces',  icon: FolderOpen,      color: 'var(--g-green)', bg: 'rgba(52, 168, 83, 0.08)' },
        { label: 'Settings',    path: '/settings',    icon: Settings,        color: 'var(--g-red)', bg: 'rgba(234, 67, 53, 0.08)' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <div
                    className="docsphere-logo"
                    style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0px',
                        lineHeight: 1,
                        userSelect: 'none',
                    }}
                >
                    {LOGO_LETTERS.map((letter, i) => (
                        <span key={i}>{letter}</span>
                    ))}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Collaborative Workspace
                </p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                            style={{
                                color: isActive ? item.color : 'var(--text-secondary)',
                                backgroundColor: isActive ? item.bg : 'transparent',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '9px 12px',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 500,
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            {/* Left indicator */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '20%',
                                    height: '60%',
                                    width: '3px',
                                    backgroundColor: item.color,
                                    borderRadius: '0 4px 4px 0',
                                }} />
                            )}
                            <Icon
                                size={17}
                                style={{ color: isActive ? item.color : 'var(--text-muted)' }}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom decoration */}
            <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '6px',
            }}>
                {['var(--g-blue)','var(--g-red)','var(--g-yellow)','var(--g-green)'].map((c, i) => (
                    <div
                        key={i}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            opacity: 0.7,
                        }}
                    />
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;