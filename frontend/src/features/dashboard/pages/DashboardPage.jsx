import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Bell } from 'lucide-react';
import { useWorkspaces, useCreateWorkspace } from '../../workspace/useWorkspace';
import { useMyPendingInvitations, useAcceptInvitation } from '../../invitation/useInvitation';

function DashboardPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useWorkspaces();
    const createWorkspaceMutation = useCreateWorkspace();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

    const workspaces = data?.data || [];

    const handleCreateWorkspace = (e) => {
        e.preventDefault();

        createWorkspaceMutation.mutate(
            { name: newWorkspaceName, description: newWorkspaceDescription },
            {
                onSuccess: () => {
                    setNewWorkspaceName('');
                    setNewWorkspaceDescription('');
                    setShowCreateForm(false);
                },
            }
        );
    };

    const { data: invitationsData } = useMyPendingInvitations();
    const acceptInvitationMutation = useAcceptInvitation();
    const pendingInvitations = invitationsData?.data || [];

    const handleAcceptFromDashboard = (token) => {
        acceptInvitationMutation.mutate(token);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <div className="ds-spinner" /> Loading workspaces…
            </div>
        );
    }

    if (isError) {
        return <p className="ds-alert ds-alert-red">Failed to load workspaces.</p>;
    }

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
            }}>
                <div>
                    <h1 className="page-title">Your Workspaces</h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="ds-btn ds-btn-primary"
                    id="create-workspace-btn"
                >
                    <Plus size={16} />
                    New Workspace
                </button>
            </div>

            {/* Pending Invitations Banner */}
            {pendingInvitations.length > 0 && (
                <div className="ds-alert ds-alert-yellow" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={16} />
                    <div>
                        <p style={{ fontWeight: 600, fontSize: '13px' }}>
                            You have {pendingInvitations.length} pending invitation{pendingInvitations.length > 1 ? 's' : ''}
                        </p>
                        <p style={{ fontSize: '12px', marginTop: '2px', opacity: 0.85 }}>
                            Check your email to accept and join the workspace.
                        </p>
                    </div>
                </div>
            )}

            {/* Create form */}
            {showCreateForm && (
                <form
                    onSubmit={handleCreateWorkspace}
                    className="ds-card"
                    style={{ padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                    <div>
                        <label className="ds-label" htmlFor="ws-name">Workspace name</label>
                        <input
                            id="ws-name"
                            type="text"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="e.g. Marketing Q3"
                            required
                            className="ds-input"
                        />
                    </div>
                    <div>
                        <label className="ds-label" htmlFor="ws-desc">Description <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span></label>
                        <textarea
                            id="ws-desc"
                            value={newWorkspaceDescription}
                            onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                            placeholder="What's this workspace for?"
                            rows={2}
                            className="ds-input"
                            style={{ resize: 'none', lineHeight: 1.6 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={createWorkspaceMutation.isPending}
                            className="ds-btn ds-btn-primary"
                        >
                            {createWorkspaceMutation.isPending ? 'Creating…' : 'Create Workspace'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="ds-btn ds-btn-ghost"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Workspace Grid */}
            {workspaces.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '64px 24px',
                    color: 'var(--text-muted)',
                }}>
                    <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                    <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        No workspaces yet
                    </p>
                    <p style={{ fontSize: '13px' }}>
                        Create your first workspace to get started.
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '16px',
                }}>
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            className="ws-card"
                            onClick={() => navigate(`/workspaces/${workspace.id}`)}
                            style={{ paddingLeft: '20px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <FolderOpen size={18} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                <h3 style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                                    {workspace.name}
                                </h3>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {workspace.description || 'No description'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;