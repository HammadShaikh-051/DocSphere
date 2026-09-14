import { LogOut, Sun, Moon, Menu, Layers } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from './SearchBar';

function Topbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    // Context title based on current route
    let pageContext = 'DocSphere';
    if (location.pathname.startsWith('/dashboard')) pageContext = 'Dashboard';
    else if (location.pathname.startsWith('/workspaces')) pageContext = 'Workspaces';
    else if (location.pathname.startsWith('/documents')) pageContext = 'Document Editor';
    else if (location.pathname.startsWith('/activity')) pageContext = 'Activity Feed';
    else if (location.pathname.startsWith('/settings')) pageContext = 'Settings & Profile';

    return (
        <header className="topbar">
            {/* Left side: Mobile menu toggle + page context indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                    className="mobile-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle navigation"
                >
                    <Menu size={19} />
                </button>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                    }}
                >
                    <Layers size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{pageContext}</span>
                </div>
            </div>

            {/* Right side: Search, Theme Toggle, User, Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <SearchBar />

                {/* Theme toggle */}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle color theme"
                >
                    {theme === 'dark' ? (
                        <Sun size={15} style={{ color: 'var(--g-yellow)' }} />
                    ) : (
                        <Moon size={15} style={{ color: 'var(--g-blue)' }} />
                    )}
                </button>

                {/* User Pill */}
                <Link
                    to="/settings"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 10px 4px 4px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-3)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                >
                    <div className="avatar" style={{ width: '26px', height: '26px', fontSize: '10.5px' }}>
                        {initials}
                    </div>
                    <span
                        style={{
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            maxWidth: '120px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {user?.name || 'Account'}
                    </span>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="ds-btn ds-btn-subtle"
                    style={{
                        fontSize: '12.5px',
                        padding: '6px 10px',
                        gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                        e.currentTarget.style.color = 'var(--g-red)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    title="Log out"
                >
                    <LogOut size={14} />
                    <span className="hidden-mobile">Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Topbar;