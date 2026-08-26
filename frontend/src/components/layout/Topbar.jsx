import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from './SearchBar';

function Topbar({ onToggleSidebar }) {
    const navigate = useNavigate();
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

    return (
        <header className="topbar">
            {/* Hamburger toggle menu */}
            <button
                className="mobile-menu-btn"
                onClick={onToggleSidebar}
                aria-label="Toggle menu"
            >
                <Menu size={20} />
            </button>

            <div />

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* User name */}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {user?.name}
                </span>

                <SearchBar />

                {/* Theme toggle */}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark'
                        ? <Sun size={16} />
                        : <Moon size={16} />
                    }
                </button>

                {/* Avatar */}
                <div className="avatar">{initials}</div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color 0.2s, color 0.2s',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                        e.currentTarget.style.color = 'var(--g-red)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                >
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Topbar;