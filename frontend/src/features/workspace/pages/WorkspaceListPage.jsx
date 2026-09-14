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
} from 'lucide-react';
import { useWorkspaces, useDeleteWorkspace, useCreateWorkspace } from '../useWorkspace';

/* ── WorkspaceCard ────────────────────────────────────────────────────────── */
const ACCENT_COLORS = [
    { color: 'var(--g-blue)',   bg: 'rgba(66,133,244,0.10)' },
    { color: 'var(--g-green)',  bg: 'rgba(52,168,83,0.10)' },
    { color: 'var(--g-yellow)', bg: 'rgba(251,188,4,0.12)' },
    { color: 'var(--g-red)',    bg: 'rgba(234,67,53,0.10)' },
];

function getAccent(index) {
    return ACCENT_COLORS[index % 4];
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
        >
            {/* Top row: letter avatar + menu */}
            <div className="ws-rich-card-header">
                <div
                    className="ws-letter-avatar"
                    style={{ backgroundColor: accent.bg, color: accent.color }}
                >
                    {workspace.name.charAt(0).toUpperCase()}
                </div>

                {/* Three-dot menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        id={`workspace-menu-btn-${workspace.id}`}
                        className="ws-ctx-btn"
                        onClick={handleMenuToggle}
                        aria-label="Workspace options"
                    >
                        <MoreVertical size={15} />
                    </button>

                    {menuOpen && (
                        <div
                            className="ws-ctx-menu"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="ws-ctx-menu-item" onClick={handleOpen}>
                                <FolderOpen size={13} />
                                Open workspace
                            </button>
                            <button
                                id={`workspace-delete-btn-${workspace.id}`}
                                className="ws-ctx-menu-item danger"
                                onClick={handleDelete}
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Name */}
            <p className="ws-rich-card-name">{workspace.name}</p>

            {/* Description */}
            <p className="ws-rich-card-desc">
                {workspace.description || (
                    <span style={{ fontStyle: 'italic', opacity: 0.55 }}>No description added</span>
                )}
            </p>

            {/* Footer */}
            <div className="ws-rich-card-footer">
                <span className={`ds-badge ${workspace.owner ? 'ds-badge-blue' : 'ds-badge-green'}`}>
                    {workspace.owner ? 'Owner' : 'Member'}
                </span>
                <span className="ws-rich-card-open-hint">
                    Open <ArrowRight size={11} />
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
        <form className="ws-create-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: -2 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Create new workspace
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: 18, lineHeight: 1,
                        padding: '2px 6px',
                    }}
                >
                    ×
                </button>
            </div>
            <div>
                <label className="ds-label" htmlFor="ws-create-name">Workspace name</label>
                <input
                    id="ws-create-name"
                    type="text"
                    className="ds-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marketing Q3"
                    required
                    autoFocus
                />
            </div>
            <div>
                <label className="ds-label" htmlFor="ws-create-desc">
                    Description <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
                </label>
                <textarea
                    id="ws-create-desc"
                    className="ds-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this workspace for?"
                    rows={2}
                    style={{ resize: 'none', lineHeight: 1.6 }}
                />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
                <button
                    type="submit"
                    className="ds-btn ds-btn-primary"
                    disabled={createWorkspaceMutation.isPending}
                    id="ws-create-submit-btn"
                >
                    {createWorkspaceMutation.isPending ? 'Creating…' : 'Create Workspace'}
                </button>
                <button type="button" onClick={onClose} className="ds-btn ds-btn-ghost">
                    Cancel
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

    // Close menus when clicking outside
    const handlePageClick = () => {
        // Menus are managed by individual cards; no global state needed
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '40px 0' }}>
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
            <div className="ws-list-header">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="ws-list-title">Workspaces</h1>
                        <p className="ws-list-subtitle">
                            {workspaces.length === 0
                                ? 'No workspaces yet — create your first one.'
                                : `${workspaces.length} workspace${workspaces.length !== 1 ? 's' : ''} in your account`}
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
                <div className="ws-list-toolbar">
                    <div className="ws-list-search-wrap">
                        <Search size={14} />
                        <input
                            id="ws-search-input"
                            type="search"
                            className="ws-list-search"
                            placeholder="Search workspaces…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    {query && (
                        <>
                            <button
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    fontSize: 12, color: 'var(--text-muted)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '6px 8px',
                                }}
                                onClick={() => setQuery('')}
                            >
                                <X size={12} />
                                Clear
                            </button>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
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
                        <FolderOpen size={22} style={{ color: 'var(--g-blue)' }} />
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
                        Try a different search term or clear the filter.
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
                        gap: 20,
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