import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { getCurrentUser } from '../../profile/profileApi';

function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const setTokens = useAuthStore((state) => state.setTokens);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (!accessToken || !refreshToken) {
            navigate('/login');
            return;
        }

        setTokens(accessToken, refreshToken);

        getCurrentUser()
            .then((result) => {
                setUser(result.data);
                navigate('/dashboard');
            })
            .catch(() => {
                navigate('/login');
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Logging you in...</p>
        </div>
    );
}

export default OAuthCallbackPage;