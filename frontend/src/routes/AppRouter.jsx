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
import ActivityPage from '../features/activity/pages/ActivityPage';
import LandingPage from '../features/landing/pages/LandingPage';

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}

function DocumentEditorProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function PublicOnlyRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function RootRoute() {
    const isAuthenticated = useAuthStore((state) => !!state.accessToken);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <LandingPage />;
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRoute />} />
                <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
                <Route path="/signup" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
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
                        <DocumentEditorProtectedRoute>
                            <DocumentPage />
                        </DocumentEditorProtectedRoute>
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

                <Route
                    path="/workspaces/:workspaceId/trash"
                    element={<ProtectedRoute><TrashPage /></ProtectedRoute>}
                />

                <Route
                    path="/activity"
                    element={<ProtectedRoute><ActivityPage /></ProtectedRoute>}
                />

                <Route
                    path="/workspaces/:workspaceId/activity"
                    element={<ProtectedRoute><ActivityPage /></ProtectedRoute>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;