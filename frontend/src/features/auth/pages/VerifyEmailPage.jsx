import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../authApi';

const LOGO_LETTERS = ['D','o','c','S','p','h','e','r','e'];

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found.');
            return;
        }

        const runVerification = async () => {
            try {
                const result = await verifyEmail(token);
                setStatus('success');
                setMessage(result.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed.');
            }
        };

        runVerification();
    }, [token]);

    return (
        <div className="auth-bg">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                {/* Logo */}
                <div
                    className="docsphere-logo"
                    style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        lineHeight: 1,
                        userSelect: 'none',
                        marginBottom: '28px',
                    }}
                >
                    {LOGO_LETTERS.map((letter, i) => (
                        <span key={i}>{letter}</span>
                    ))}
                </div>

                {status === 'verifying' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div className="ds-spinner" style={{ width: '32px', height: '32px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Verifying your email…
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        {/* Green checkmark */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--success-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                        }}>
                            ✓
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--g-green)' }}>
                            Email Verified!
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</p>
                        <Link
                            to="/login"
                            className="ds-btn ds-btn-primary"
                            style={{ textDecoration: 'none', marginTop: '8px' }}
                        >
                            Go to Sign In
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        {/* Red X */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--danger-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            color: 'var(--g-red)',
                        }}>
                            ✕
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--g-red)' }}>
                            Verification Failed
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</p>
                    </div>
                )}

                {/* Color bar */}
                <div style={{
                    marginTop: '32px',
                    height: '3px',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, var(--g-blue), var(--g-red), var(--g-yellow), var(--g-green))',
                    opacity: 0.5,
                }} />
            </div>
        </div>
    );
}

export default VerifyEmailPage;