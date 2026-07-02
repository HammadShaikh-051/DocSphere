import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useParams } from 'react-router-dom';
import { useAcceptInvitation } from '../useInvitation';
import { useAuthStore } from '../../../store/authStore';

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
            setMessage('No invitation token found.');
            return;
        }

        if (!isAuthenticated) {
            setStatus('needs-login');
            return;
        }

        acceptInvitationMutation.mutate(token, {
            onSuccess: (result) => {
                setStatus('success');
                setMessage(result.message);
                setTimeout(() => navigate('/dashboard'), 1500);
            },
            onError: (err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to accept invitation.');
            },
        });
    }, [token, isAuthenticated]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow text-center">
                {status === 'accepting' && <p>Accepting invitation...</p>}

                {status === 'needs-login' && (
                    <>
                        <h1 className="text-xl font-bold mb-2">Log in to accept</h1>
                        <p className="text-gray-600 mb-4">
                            You need to log in first to accept this invitation.
                        </p>
                        <Link
                            to={`/login?redirect=/invite/accept?token=${token}`}
                            className="text-blue-600 hover:underline"
                        >
                            Go to login
                        </Link>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h1 className="text-xl font-bold text-green-600 mb-2">Invitation Accepted</h1>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h1 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h1>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default AcceptInvitePage;