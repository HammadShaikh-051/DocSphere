import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useWorkspaces, useDeleteWorkspace } from '../useWorkspace';

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: 'var(--text-primary)',
    textAlign: 'left',
};

function WorkspaceListPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useWorkspaces();

    const workspaces = data?.data || [];

    const [openMenuId, setOpenMenuId] = useState(null);
    const deleteWorkspaceMutation = useDeleteWorkspace();

    const handleDelete = (e, workspace) => {
        e.stopPropagation();
        setOpenMenuId(null);
        if (confirm(`Delete "${workspace.name}"? This cannot be undone.`)) {
            deleteWorkspaceMutation.mutate(workspace.id);
        }
    };

    const toggleMenu = (e, workspaceId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === workspaceId ? null : workspaceId);
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
                            style={{ paddingLeft: '20px', position: 'relative' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                    <FolderOpen size={18} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                    <h3 style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                                        {workspace.name}
                                    </h3>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => toggleMenu(e, workspace.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                        }}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {openMenuId === workspace.id && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: '100%',
                                                marginTop: '4px',
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                minWidth: '140px',
                                                zIndex: 10,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setOpenMenuId(null);
                                                    navigate(`/workspaces/${workspace.id}`);
                                                }}
                                                style={menuItemStyle}
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, workspace)}
                                                style={{ ...menuItemStyle, color: 'var(--text-red, #dc2626)' }}
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {workspace.description || 'No description'}
                            </p>
                            {workspace.owner && (
                                <span className="ds-badge ds-badge-blue" style={{ marginTop: '10px' }}>
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