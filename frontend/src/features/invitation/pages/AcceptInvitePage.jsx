import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useParams } from 'react-router-dom';
import { useAcceptInvitation } from '../useInvitation';
import { useAuthStore } from '../../../store/authStore';
import { CheckCircle2, AlertCircle, LogIn, Mail, ArrowRight } from 'lucide-react';
import DocSphereLogo from '../../../components/ui/DocSphereLogo';

function AcceptInvitePage() {
    const { token: pathToken } = useParams();
    const [searchParams] = useSearchParams();
    const queryToken = searchParams.get('token');
    const token = pathToken || queryToken;

    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    const acceptInvitationMutation = useAcceptInvitation();

    const [status, setStatus] = useState('accepting');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No invitation token was found in the link.');
            return;
        }

        if (!isAuthenticated) {
            setStatus('needs-login');
            return;
        }

        acceptInvitationMutation.mutate(token, {
            onSuccess: (result) => {
                setStatus('success');
                setMessage(result.message || 'Invitation accepted successfully!');
                setTimeout(() => navigate('/dashboard'), 1800);
            },
            onError: (err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to accept workspace invitation.');
            },
        });
    }, [token, isAuthenticated]);

    return (
        <div className="auth-bg">
            <div className="auth-card" style={{ textAlign: 'center', maxWidth: '440px' }}>
                {/* Brand Logo */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <DocSphereLogo size={42} layout="vertical" wordmarkSize="24px" />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        Workspace Invitation
                    </p>
                </div>

                {/* State: Accepting / Loading */}
                {status === 'accepting' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
                        <div className="ds-spinner" style={{ width: '36px', height: '36px' }} />
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                                Accepting invitation…
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                Adding you to the workspace…
                            </p>
                        </div>
                    </div>
                )}

                {/* State: Needs Login */}
                {status === 'needs-login' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: 'rgba(59, 130, 246, 0.12)',
                                border: '1px solid rgba(59, 130, 246, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--g-blue)',
                            }}
                        >
                            <LogIn size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                                Sign in to accept
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                You must be signed into your DocSphere account to join this workspace.
                            </p>
                        </div>
                        <Link
                            to={`/login?redirect=${encodeURIComponent(`/invite/accept?token=${token}`)}`}
                            className="ds-btn ds-btn-primary"
                            style={{ width: '100%', padding: '11px', marginTop: '8px', textDecoration: 'none' }}
                        >
                            Sign In to Continue
                            <ArrowRight size={15} />
                        </Link>
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
                                Welcome to the Workspace!
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                                {message}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                Redirecting to your dashboard in a moment…
                            </p>
                        </div>
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
                                Invitation Expired or Invalid
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                                {message}
                            </p>
                        </div>
                        <Link
                            to="/dashboard"
                            className="ds-btn ds-btn-primary"
                            style={{ width: '100%', padding: '11px', textDecoration: 'none' }}
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                )}

                {/* Ambient Bottom Line */}
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

export default AcceptInvitePage;