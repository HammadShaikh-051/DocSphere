import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../authApi';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import DocSphereLogo from '../../../components/ui/DocSphereLogo';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token was provided in the confirmation link.');
            return;
        }

        const runVerification = async () => {
            try {
                const result = await verifyEmail(token);
                setStatus('success');
                setMessage(result.message || 'Your email has been verified successfully.');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Email verification link is invalid or has expired.');
            }
        };

        runVerification();
    }, [token]);

    return (
        <div className="auth-bg">
            <div className="auth-card" style={{ textAlign: 'center', maxWidth: '420px' }}>
                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <DocSphereLogo size={42} layout="vertical" wordmarkSize="24px" />
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
                        Email Confirmation
                    </p>
                </div>

                {/* State: Verifying */}
                {status === 'verifying' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
                        <div className="ds-spinner" style={{ width: '36px', height: '36px' }} />
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                                Verifying your email…
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                Confirming your credentials with DocSphere.
                            </p>
                        </div>
                    </div>
                )}

                {/* State: Success */}
                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: 'rgba(52, 168, 83, 0.12)',
                                border: '1px solid rgba(52, 168, 83, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--g-green)',
                            }}
                        >
                            <CheckCircle2 size={26} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                                Email Confirmed!
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                {message}
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="ds-btn ds-btn-primary"
                            style={{ width: '100%', padding: '11px', marginTop: '8px', textDecoration: 'none', justifyContent: 'center' }}
                        >
                            Proceed to Sign In
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}

                {/* State: Error */}
                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--g-red)',
                            }}
                        >
                            <AlertCircle size={26} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                                Verification Failed
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                {message}
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="ds-btn ds-btn-ghost"
                            style={{ width: '100%', padding: '11px', marginTop: '8px', textDecoration: 'none', justifyContent: 'center' }}
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {/* Ambient Decorative Bar */}
                <div
                    style={{
                        marginTop: '28px',
                        height: '2px',
                        borderRadius: '99px',
                        background: 'linear-gradient(90deg, var(--g-blue), var(--g-red), var(--g-yellow), var(--g-green))',
                        opacity: 0.4,
                    }}
                />
            </div>
        </div>
    );
}

export default VerifyEmailPage;