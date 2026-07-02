import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { updateProfile, changePassword } from '../profileApi';
import { useTheme } from '../../../context/ThemeContext';
import {
    User, Lock, Sun, Moon, Palette, Shield, Bell, ChevronRight, Check
} from 'lucide-react';

const LOGO_LETTERS = ['D','o','c','S','p','h','e','r','e'];

function SettingsSection({ icon: Icon, iconColor, title, description, children }) {
    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
        }}>
            {/* Section Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-2)',
            }}>
                <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: iconColor + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Icon size={18} style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
                    {description && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{description}</p>
                    )}
                </div>
            </div>

            {/* Section Body */}
            <div style={{ padding: '24px' }}>
                {children}
            </div>
        </div>
    );
}

function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const { theme, toggleTheme } = useTheme();

    const [name, setName] = useState(user?.name || '');
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        setProfileError('');
        setIsSavingProfile(true);
        try {
            const result = await updateProfile({ name });
            setUser(result.data);
            setProfileMessage('Profile updated successfully.');
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Update failed.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');
        setIsSavingPassword(true);
        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordMessage('Password changed successfully.');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Password change failed.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div style={{ maxWidth: '640px' }}>

            {/* Page Header */}
            <div style={{ marginBottom: '28px' }}>
                <h1 className="page-title">Settings</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    Manage your account, security, and preferences.
                </p>
                <div style={{
                    marginTop: '12px',
                    height: '2px',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, var(--g-blue), var(--g-red), var(--g-yellow), var(--g-green))',
                    opacity: 0.4,
                    width: '160px',
                }} />
            </div>

            {/* ─── Account Card (Avatar + email) ─── */}
            <div className="settings-account-card">
                {/* Gradient blob */}
                <div style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    width: '200px', height: '100%',
                    background: 'linear-gradient(135deg, transparent 60%, var(--accent-light) 100%)',
                    pointerEvents: 'none',
                }} />

                {/* Big Avatar */}
                <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--g-blue), var(--g-green))',
                    color: '#fff',
                    fontSize: '26px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(66,133,244,.3)',
                }}>
                    {initials}
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                        {['var(--g-blue)','var(--g-red)','var(--g-yellow)','var(--g-green)'].map((c, i) => (
                            <div key={i} style={{
                                width: '8px', height: '8px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                opacity: 0.7,
                            }} />
                        ))}
                    </div>
                </div>

                {/* DocSphere wordmark watermark */}
                <div className="docsphere-logo" style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    opacity: 0.15,
                    letterSpacing: '-0.3px',
                    userSelect: 'none',
                }}>
                    {LOGO_LETTERS.map((l, i) => <span key={i}>{l}</span>)}
                </div>
            </div>

            {/* ─── Profile Section ─── */}
            <div style={{ marginBottom: '20px' }}>
                <SettingsSection
                    icon={User}
                    iconColor="var(--g-blue)"
                    title="Profile"
                    description="Update your display name"
                >
                    {profileMessage && (
                        <div className="ds-alert ds-alert-green" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={14} /> {profileMessage}
                        </div>
                    )}
                    {profileError && (
                        <div className="ds-alert ds-alert-red" style={{ marginBottom: '16px' }}>
                            {profileError}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="ds-label" htmlFor="settings-name">Display name</label>
                            <input
                                id="settings-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="ds-input"
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="ds-label">Email address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="ds-input"
                                style={{
                                    backgroundColor: 'var(--surface-2)',
                                    color: 'var(--text-muted)',
                                    cursor: 'not-allowed',
                                }}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Email cannot be changed.
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="ds-btn ds-btn-primary"
                            >
                                {isSavingProfile ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </SettingsSection>
            </div>

            {/* ─── Appearance Section ─── */}
            <div style={{ marginBottom: '20px' }}>
                <SettingsSection
                    icon={Palette}
                    iconColor="var(--g-yellow)"
                    title="Appearance"
                    description="Customize how DocSphere looks"
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-2)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {theme === 'dark'
                                ? <Moon size={20} style={{ color: 'var(--g-blue)' }} />
                                : <Sun size={20} style={{ color: 'var(--g-yellow)' }} />
                            }
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {theme === 'dark' ? 'Easy on the eyes at night' : 'Bright and clear interface'}
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: '52px',
                                height: '28px',
                                borderRadius: '99px',
                                background: theme === 'dark' ? 'var(--g-blue)' : 'var(--surface-3)',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background-color 0.3s ease',
                                flexShrink: 0,
                            }}
                            aria-label="Toggle dark mode"
                        >
                            <div style={{
                                position: 'absolute',
                                top: '3px',
                                left: theme === 'dark' ? '26px' : '3px',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#fff',
                                transition: 'left 0.3s ease',
                                boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                            }} />
                        </button>
                    </div>
                </SettingsSection>
            </div>

            {/* ─── Security Section ─── */}
            <div style={{ marginBottom: '20px' }}>
                <SettingsSection
                    icon={Lock}
                    iconColor="var(--g-red)"
                    title="Security"
                    description="Change your account password"
                >
                    {passwordMessage && (
                        <div className="ds-alert ds-alert-green" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={14} /> {passwordMessage}
                        </div>
                    )}
                    {passwordError && (
                        <div className="ds-alert ds-alert-red" style={{ marginBottom: '16px' }}>
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="ds-label" htmlFor="settings-current-pw">Current password</label>
                            <input
                                id="settings-current-pw"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="Enter current password"
                                className="ds-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="ds-label" htmlFor="settings-new-pw">New password</label>
                            <input
                                id="settings-new-pw"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="At least 8 characters"
                                className="ds-input"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                className="ds-btn ds-btn-primary"
                                style={{ backgroundColor: 'var(--g-red)' }}
                            >
                                <Shield size={14} />
                                {isSavingPassword ? 'Updating…' : 'Change password'}
                            </button>
                        </div>
                    </form>
                </SettingsSection>
            </div>

            {/* ─── Info Row ─── */}
            <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '11px',
                color: 'var(--text-muted)',
            }}>
                <span>Powered by</span>
                <span className="docsphere-logo" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {LOGO_LETTERS.map((l, i) => <span key={i}>{l}</span>)}
                </span>
            </div>
        </div>
    );
}

export default ProfilePage;