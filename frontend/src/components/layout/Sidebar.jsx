import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderOpen,
    Activity,
    Settings,
    X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import DocSphereLogo from '../ui/DocSphereLogo';

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);

    const navSections = [
        {
            title: 'WORKSPACE',
            items: [
                {
                    label: 'Dashboard',
                    path: '/dashboard',
                    icon: LayoutDashboard,
                },
                {
                    label: 'Workspaces',
                    path: '/workspaces',
                    icon: FolderOpen,
                },
                {
                    label: 'Activity',
                    path: '/activity',
                    icon: Activity,
                },
            ],
        },
        {
            title: 'PREFERENCES',
            items: [
                {
                    label: 'Settings',
                    path: '/settings',
                    icon: Settings,
                },
            ],
        },
    ];

    const currentYear = new Date().getFullYear();

    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay active"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`sidebar ${isOpen ? 'open' : ''}`}
                aria-label="Sidebar navigation"
            >
                {/* Brand Header */}
                <div
                    style={{
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border)',
                        minHeight: '64px',
                    }}
                >
                    <Link
                        to="/dashboard"
                        onClick={onClose}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <DocSphereLogo size={32} subtitle="WORKSPACE" />
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="mobile-close-btn"
                        aria-label="Close sidebar"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'none',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

            {/* Navigation Groups */}
            <nav className="sidebar-nav">
                {navSections.map((section, sIdx) => (
                    <div key={section.title} style={{ marginBottom: sIdx === 0 ? '16px' : 0 }}>
                        <div
                            style={{
                                padding: '6px 12px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                color: 'var(--text-muted)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {section.title}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {section.items.map((item) => {
                                const isActive =
                                    location.pathname === item.path ||
                                    (item.path !== '/dashboard' &&
                                        location.pathname.startsWith(item.path + '/'));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={onClose}
                                        style={{
                                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            backgroundColor: isActive ? item.bg : 'transparent',
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    >
                                        {/* Left active glow bar */}
                                        {isActive && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '18%',
                                                    height: '64%',
                                                    width: '3px',
                                                    backgroundColor: item.color,
                                                    borderRadius: '0 4px 4px 0',
                                                    boxShadow: `0 0 8px ${item.color}`,
                                                }}
                                            />
                                        )}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '6px',
                                                color: isActive ? item.color : 'var(--text-muted)',
                                                transition: 'color 0.15s ease',
                                            }}
                                        >
                                            <Icon size={16} />
                                        </div>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile Bar at bottom */}
            <div
                style={{
                    padding: '12px 14px',
                    borderTop: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                <Link
                    to="/settings"
                    onClick={onClose}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                        {userInitials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {user?.name || 'User'}
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {user?.email || 'Logged in'}
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;