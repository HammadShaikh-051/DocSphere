import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderOpen,
    MoreVertical,
    Trash2,
    Plus,
    Search,
    Layers,
    X,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { useWorkspaces, useDeleteWorkspace, useCreateWorkspace } from '../useWorkspace';

/* ── WorkspaceCard ────────────────────────────────────────────────────────── */
const ACCENT_COLORS = [
    { color: 'var(--g-blue)',   bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)' },
    { color: 'var(--g-green)',  bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
    { color: 'var(--g-yellow)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
    { color: 'var(--g-red)',    bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.25)' },
];

function getAccent(index) {
    return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

function WorkspaceCard({ workspace, index, onDelete, onNavigate }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const accent = getAccent(index);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setMenuOpen((prev) => !prev);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        onDelete(workspace);
    };

    const handleOpen = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        onNavigate(workspace.id);
    };

    return (
        <div
            className="ws-rich-card"
            onClick={() => onNavigate(workspace.id)}
            role="link"
            tabIndex={0}
            id={`workspace-card-${workspace.id}`}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(workspace.id)}
            style={{
                position: 'relative',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--shadow-card)',
            }}
        >
            {/* Top row: letter avatar + menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div
                    style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: accent.bg,
                        border: `1px solid ${accent.border}`,
                        color: accent.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        flexShrink: 0,
                    }}
                >
                    {workspace.name.charAt(0).toUpperCase()}
                </div>

                {/* Three-dot menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        id={`workspace-menu-btn-${workspace.id}`}
                        onClick={handleMenuToggle}
                        aria-label="Workspace options"
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid transparent',
                            background: menuOpen ? 'var(--surface-3)' : 'transparent',
                            color: menuOpen ? 'var(--text-primary)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--surface-3)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                        onMouseLeave={(e) => {
                            if (!menuOpen) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }
                        }}
                    >
                        <MoreVertical size={16} />
                    </button>

                    {menuOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 6px)',
                                minWidth: '160px',
                                background: 'var(--surface-2)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: '4px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 30,
                                animation: 'fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            <button
                                onClick={handleOpen}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--text-primary)',
                                    textAlign: 'left',
                                    transition: 'background 0.12s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-3)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                            >
                                <FolderOpen size={14} style={{ color: 'var(--g-blue)' }} />
                                Open workspace
                            </button>
                            <button
                                id={`workspace-delete-btn-${workspace.id}`}
                                onClick={handleDelete}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--g-red)',
                                    textAlign: 'left',
                                    transition: 'background 0.12s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Name & Description */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p
                    style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.015em',
                        lineHeight: 1.35,
                        marginBottom: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {workspace.name}
                </p>

                <p
                    style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '38px',
                    }}
                >
                    {workspace.description || (
                        <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No description added</span>
                    )}
                </p>
            </div>

            {/* Footer */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)',
                    marginTop: 'auto',
                }}
            >
                <span className={`ds-badge ${workspace.owner ? 'ds-badge-blue' : 'ds-badge-green'}`}>
                    {workspace.owner ? 'Owner' : 'Member'}
                </span>
                <span
                    style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    Open <ArrowRight size={12} />
                </span>
            </div>
        </div>
    );
}

/* ── CreateWorkspaceForm ──────────────────────────────────────────────────── */
function CreateWorkspaceForm({ onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createWorkspaceMutation = useCreateWorkspace();

    const handleSubmit = (e) => {
        e.preventDefault();
        createWorkspaceMutation.mutate(
            { name, description },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderLeft: '4px solid var(--g-blue)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                marginBottom: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-md)',
                animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        Create New Workspace
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Workspaces group folders, documents, and team members together
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface-2)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            </div>
            <div>
                <label className="ds-label" htmlFor="ws-create-name">Workspace Name</label>
                <input
                    id="ws-create-name"
                    type="text"
                    className="ds-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Engineering, Design Systems, Marketing Q3"
                    required
                    autoFocus
                />
            </div>
            <div>
                <label className="ds-label" htmlFor="ws-create-desc">
                    Description <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                </label>
                <textarea
                    id="ws-create-desc"
                    className="ds-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this workspace used for?"
                    rows={2}
                    style={{ resize: 'none', lineHeight: 1.6 }}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button type="button" onClick={onClose} className="ds-btn ds-btn-ghost">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="ds-btn ds-btn-primary"
                    disabled={createWorkspaceMutation.isPending || !name.trim()}
                    id="ws-create-submit-btn"
                >
                    {createWorkspaceMutation.isPending ? 'Creating…' : 'Create Workspace'}
                </button>
            </div>
        </form>
    );
}

/* ── WorkspaceListPage ────────────────────────────────────────────────────── */
function WorkspaceListPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useWorkspaces();
    const deleteWorkspaceMutation = useDeleteWorkspace();

    const [query, setQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const workspaces = data?.data || [];

    const handlePageClick = () => {
        // Handled by card menus
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return workspaces;
        return workspaces.filter(
            (ws) =>
                ws.name.toLowerCase().includes(q) ||
                (ws.description || '').toLowerCase().includes(q)
        );
    }, [workspaces, query]);

    const handleDelete = (workspace) => {
        if (confirm(`Delete "${workspace.name}"? This cannot be undone.`)) {
            deleteWorkspaceMutation.mutate(workspace.id);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '48px 0' }}>
                <div className="ds-spinner" />
                <span style={{ fontSize: 14 }}>Loading workspaces…</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="dash-empty" style={{ maxWidth: 480 }}>
                <div className="dash-empty-icon">
                    <Layers size={22} style={{ color: 'var(--g-red)' }} />
                </div>
                <p className="dash-empty-title">Failed to load workspaces</p>
                <p className="dash-empty-desc">There was a problem connecting to the server. Please refresh.</p>
                <button className="ds-btn ds-btn-ghost" onClick={() => window.location.reload()}>
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div onClick={handlePageClick}>
            {/* ── Page header ────────────────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                                Workspaces
                            </h1>
                            <span className="ds-badge ds-badge-blue" style={{ fontSize: '12px' }}>
                                {workspaces.length}
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {workspaces.length === 0
                                ? 'No workspaces yet — create your first one.'
                                : 'Manage and collaborate across all your team hubs.'}
                        </p>
                    </div>
                    <button
                        id="create-workspace-btn"
                        className="ds-btn ds-btn-primary"
                        onClick={() => setShowCreateForm((v) => !v)}
                    >
                        <Plus size={15} />
                        New Workspace
                    </button>
                </div>
            </div>

            {/* ── Create form ────────────────────────────────────────────── */}
            {showCreateForm && (
                <CreateWorkspaceForm onClose={() => setShowCreateForm(false)} />
            )}

            {/* ── Toolbar: search ────────────────────────────────────────── */}
            {workspaces.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
                        <Search
                            size={15}
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                pointerEvents: 'none',
                            }}
                        />
                        <input
                            id="ws-search-input"
                            type="search"
                            className="ds-input"
                            placeholder="Search workspaces by name or description…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ paddingLeft: '36px' }}
                        />
                    </div>
                    {query && (
                        <>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: 'var(--text-muted)',
                                    background: 'var(--surface-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    padding: '7px 10px',
                                }}
                                onClick={() => setQuery('')}
                            >
                                <X size={12} />
                                Clear filter
                            </button>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                {filtered.length} workspace{filtered.length !== 1 ? 's' : ''} found
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* ── Workspace grid ─────────────────────────────────────────── */}
            {workspaces.length === 0 ? (
                /* Global empty state */
                <div className="dash-empty">
                    <div className="dash-empty-icon">
                        <Sparkles size={22} style={{ color: 'var(--g-blue)' }} />
                    </div>
                    <p className="dash-empty-title">No workspaces yet</p>
                    <p className="dash-empty-desc">
                        Workspaces help you organize your documents and collaborate with your team.
                        Create your first one to get started.
                    </p>
                    <button
                        id="ws-empty-create-btn"
                        className="ds-btn ds-btn-primary"
                        onClick={() => setShowCreateForm(true)}
                    >
                        <Plus size={14} />
                        Create Workspace
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                /* Search empty state */
                <div className="dash-empty">
                    <div className="dash-empty-icon">
                        <Search size={22} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p className="dash-empty-title">No workspaces match "{query}"</p>
                    <p className="dash-empty-desc">
                        Try checking for typos or searching for a different keyword.
                    </p>
                    <button className="ds-btn ds-btn-ghost" onClick={() => setQuery('')}>
                        Clear search
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {filtered.map((workspace, index) => (
                        <WorkspaceCard
                            key={workspace.id}
                            workspace={workspace}
                            index={index}
                            onDelete={handleDelete}
                            onNavigate={(id) => navigate(`/workspaces/${id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WorkspaceListPage;