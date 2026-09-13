import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { registerUser } from '../authApi';

const LOGO_LETTERS = ['D', 'o', 'c', 'S', 'p', 'h', 'e', 'r', 'e'];

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
            setSuccessMessage(result.message);
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card">
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div
                        className="docsphere-logo"
                        style={{
                            fontSize: '28px',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            lineHeight: 1,
                            userSelect: 'none',
                            marginBottom: '6px',
                        }}
                    >
                        {LOGO_LETTERS.map((letter, i) => (
                            <span key={i}>{letter}</span>
                        ))}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Create your free account
                    </p>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="ds-alert ds-alert-red" style={{ marginBottom: '16px' }}>
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="ds-alert ds-alert-green" style={{ marginBottom: '16px' }}>
                        {successMessage}
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
                    Continue with Google
                </button>

                <div className="or-divider" style={{ margin: '20px 0' }}>OR</div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="ds-label" htmlFor="reg-name">Full name</label>
                        <input
                            id="reg-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your name"
                            className="ds-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="reg-email">Email address</label>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="ds-input"
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
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="ds-btn ds-btn-primary"
                        style={{ width: '100%', padding: '11px', marginTop: '4px' }}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                {/* Footer */}
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link
                        to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                        style={{ color: 'var(--g-blue)', textDecoration: 'none', fontWeight: 500 }}
                    >
                        Sign in
                    </Link>
                </p>

                {/* Google color bar */}
                <div style={{
                    marginTop: '24px',
                    height: '3px',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, var(--g-green), var(--g-blue), var(--g-red), var(--g-yellow))',
                    opacity: 0.5,
                }} />
            </div>
        </div>
    );
}

export default RegisterPage;