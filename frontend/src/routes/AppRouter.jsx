import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../components/layout/AppLayout';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import WorkspacePage from '../features/workspace/pages/WorkspacePage';
import FolderPage from '../features/folder/pages/FolderPage';
import MembersPage from '../features/member/pages/MembersPage';
import DocumentPage from '../features/document/pages/DocumentPage';
import AcceptInvitePage from '../features/invitation/pages/AcceptInvitePage';
import WorkspaceListPage from '../features/workspace/pages/WorkspaceListPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import OAuthCallbackPage from '../features/auth/pages/OAuthCallbackPage';
import TrashPage from '../features/workspace/pages/TrashPage';

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workspaces/:workspaceId"
                    element={
                        <ProtectedRoute>
                            <WorkspacePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workspaces/:workspaceId/folders/:folderId"
                    element={
                        <ProtectedRoute>
                            <FolderPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/workspaces/:workspaceId/members"
                    element={
                        <ProtectedRoute>
                            <MembersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/documents/:documentId"
                    element={
                        <ProtectedRoute>
                            <DocumentPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/invite/accept" element={<AcceptInvitePage />} />
                <Route path="/invitations/:token" element={<AcceptInvitePage />} />

                <Route
                    path="/workspaces"
                    element={
                        <ProtectedRoute>
                            <WorkspaceListPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                    path="/workspaces/:workspaceId/trash"
                    element={<ProtectedRoute><TrashPage /></ProtectedRoute>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;