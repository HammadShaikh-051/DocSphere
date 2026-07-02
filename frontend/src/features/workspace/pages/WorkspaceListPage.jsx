import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { useWorkspaces } from '../useWorkspace';

function WorkspaceListPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useWorkspaces();

    const workspaces = data?.data || [];

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
            <div style={{ marginBottom: '24px' }}>
                <h1 className="page-title">All Workspaces</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </p>
            </div>

            {workspaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text-muted)' }}>
                    <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                    <p style={{ fontWeight: 500, fontSize: '15px', color: 'var(--text-secondary)' }}>
                        No workspaces yet
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
                            {workspace.owner && (
                                <span
                                    className="ds-badge ds-badge-blue"
                                    style={{ marginTop: '10px' }}
                                >
                                    Owner
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WorkspaceListPage;