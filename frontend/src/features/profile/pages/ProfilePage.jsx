import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { updateProfile, changePassword } from '../profileApi';
import { useTheme } from '../../../context/ThemeContext';
import {
    User, Lock, Sun, Moon, Palette, Shield, Check, AlertCircle
} from 'lucide-react';
import DocSphereLogo from '../../../components/ui/DocSphereLogo';

function SettingsSection({ icon: Icon, iconColor, title, description, children }) {
    return (
        <div
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
                transition: 'border-color 0.2s ease',
            }}
        >
            {/* Section Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 24px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--surface-2)',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${iconColor}18`,
                        border: `1px solid ${iconColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Icon size={17} style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {title}
                    </h2>
                    {description && (
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Section Body */}
            <div style={{ padding: '22px 24px' }}>
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
            setProfileMessage('Display name updated successfully.');
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile.');
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
            setPasswordError(err.response?.data?.message || 'Password update failed.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Page Header */}
            <div>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                    Account Settings
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Manage your personal profile, security preferences, and interface appearance.
                </p>
            </div>

            {/* Account Card */}
            <div
                style={{
                    background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '180px',
                        height: '100%',
                        background: 'radial-gradient(circle at 100% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Big Avatar */}
                <div
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)',
                    }}
                >
                    {initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'DocSphere User'}
                        </h2>
                        <span className="ds-badge ds-badge-blue" style={{ fontSize: '10px' }}>
                            Verified
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Profile Section */}
            <SettingsSection
                icon={User}
                iconColor="var(--g-blue)"
                title="Personal Information"
                description="Update how your name appears to team members across workspaces."
            >
                {profileMessage && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: 'rgba(52, 168, 83, 0.12)',
                            border: '1px solid rgba(52, 168, 83, 0.25)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--g-green)',
                            fontSize: '13px',
                            marginBottom: '16px',
                        }}
                    >
                        <Check size={15} />
                        <span>{profileMessage}</span>
                    </div>
                )}
                {profileError && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--g-red)',
                            fontSize: '13px',
                            marginBottom: '16px',
                        }}
                    >
                        <AlertCircle size={15} />
                        <span>{profileError}</span>
                    </div>
                )}

                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="settings-name">Full Name</label>
                        <input
                            id="settings-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="ds-input"
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label">Email Address</label>
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
                        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '5px' }}>
                            Your email address is managed via your initial sign-up credentials.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="ds-btn ds-btn-primary"
                        >
                            {isSavingProfile ? 'Saving Changes…' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </SettingsSection>

            {/* Appearance Section */}
            <SettingsSection
                icon={Palette}
                iconColor="var(--g-yellow)"
                title="Interface Appearance"
                description="Choose whether you want DocSphere in dark or light mode."
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-2)',
                        gap: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: theme === 'dark' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(251, 188, 4, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: theme === 'dark' ? 'var(--g-blue)' : 'var(--g-yellow)',
                            }}
                        >
                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                                {theme === 'dark' ? 'Dark Obsidian Theme' : 'Light Clean Theme'}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                                {theme === 'dark' ? 'Engineered for reduced eye strain and modern aesthetics.' : 'Crisp high-contrast theme for bright environments.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="ds-btn ds-btn-ghost"
                        style={{ padding: '6px 14px', fontSize: '12.5px' }}
                    >
                        Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </SettingsSection>

            {/* Security / Password Section */}
            <SettingsSection
                icon={Lock}
                iconColor="var(--g-red)"
                title="Password & Security"
                description="Keep your account safe by setting a strong, unique password."
            >
                {passwordMessage && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: 'rgba(52, 168, 83, 0.12)',
                            border: '1px solid rgba(52, 168, 83, 0.25)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--g-green)',
                            fontSize: '13px',
                            marginBottom: '16px',
                        }}
                    >
                        <Check size={15} />
                        <span>{passwordMessage}</span>
                    </div>
                )}
                {passwordError && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--g-red)',
                            fontSize: '13px',
                            marginBottom: '16px',
                        }}
                    >
                        <AlertCircle size={15} />
                        <span>{passwordError}</span>
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="settings-current-pw">Current Password</label>
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
                        <label className="ds-label" htmlFor="settings-new-pw">New Password</label>
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

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="ds-btn"
                            style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: 'var(--g-red)',
                                gap: '6px',
                            }}
                        >
                            <Shield size={14} />
                            {isSavingPassword ? 'Updating Password…' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </SettingsSection>

            {/* Footer Wordmark */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                }}
            >
                <span>Secured by</span>
                <DocSphereLogo size={16} wordmarkSize="13px" />
            </div>
        </div>
    );
}

export default ProfilePage;