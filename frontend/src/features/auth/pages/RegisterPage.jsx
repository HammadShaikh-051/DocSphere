import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { registerUser } from '../authApi';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import DocSphereLogo from '../../../components/ui/DocSphereLogo';

function RegisterPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const result = await registerUser({ name, email, password });
            setSuccessMessage(result.message || 'Account created successfully! Check your email to verify.');
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card" style={{ maxWidth: '420px' }}>
                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <DocSphereLogo size={42} layout="vertical" wordmarkSize="24px" />
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
                        Create your free DocSphere account
                    </p>
                </div>

                {/* Alerts */}
                {error && (
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
                            marginBottom: '20px',
                        }}
                    >
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
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
                            marginBottom: '20px',
                        }}
                    >
                        <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Google Sign-Up */}
                <button
                    type="button"
                    className="google-btn"
                    onClick={() => {
                        const backendOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
                        window.location.href = `${backendOrigin}/oauth2/authorization/google`;
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                        <path fill="#4CAF50" d="M24 44c5.5 0 10.5-1.9 14.3-5.2l-6.6-5.6c-2 1.5-4.7 2.5-7.7 2.5-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" />
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.5 36.3 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z" />
                    </svg>
                    Sign up with Google
                </button>

                <div className="or-divider" style={{ margin: '20px 0' }}>OR</div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your full name"
                            className="ds-input"
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="reg-email">Email Address</label>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="ds-input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="At least 8 characters"
                            className="ds-input"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="ds-btn ds-btn-primary"
                        style={{ width: '100%', padding: '11px', marginTop: '6px', justifyContent: 'center', fontSize: '13.5px' }}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="ds-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff' }} />
                                <span>Creating Account…</span>
                            </div>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Create Free Account <ArrowRight size={15} />
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p style={{ marginTop: '22px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link
                        to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                        style={{ color: 'var(--g-blue)', textDecoration: 'none', fontWeight: 600 }}
                    >
                        Sign in
                    </Link>
                </p>

                {/* Ambient Decorative Bar */}
                <div
                    style={{
                        marginTop: '26px',
                        height: '2px',
                        borderRadius: '99px',
                        background: 'linear-gradient(90deg, var(--g-green), var(--g-blue), var(--g-red), var(--g-yellow))',
                        opacity: 0.4,
                    }}
                />
            </div>
        </div>
    );
}

export default RegisterPage;