import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    LayoutGrid,
    Bell,
    Layers,
    ArrowRight,
    Sparkles,
    Activity,
    Users,
    FileText,
    FolderPlus,
    Edit3,
    Trash2,
    Pencil,
    Undo2,
    UserPlus,
} from 'lucide-react';
import { useWorkspaces, useCreateWorkspace } from '../../workspace/useWorkspace';
import { useMyPendingInvitations } from '../../invitation/useInvitation';
import { useAuthStore } from '../../../store/authStore';
import { useAllWorkspacesActivity } from '../../activity/useActivity';
import { useRecentDocumentsAcrossWorkspaces } from '../../document/useDocument';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

/* ── helpers ─────────────────────────────────────────────────────────────── */
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function getFirstName(name) {
    if (!name) return '';
    return name.split(' ')[0];
}

const ACCENT_COLORS = [
    { color: 'var(--g-blue)',   bg: 'rgba(66,133,244,0.12)' },
    { color: 'var(--g-green)',  bg: 'rgba(52,168,83,0.12)' },
    { color: 'var(--g-yellow)', bg: 'rgba(251,188,4,0.14)' },
    { color: 'var(--g-red)',    bg: 'rgba(234,67,53,0.10)' },
];
function getAccent(i) { return ACCENT_COLORS[i % 4]; }

const ACTION_CONFIG = {
    CREATED:  { icon: FolderPlus, color: 'var(--g-green)',  verb: 'created' },
    UPDATED:  { icon: Edit3,      color: 'var(--g-blue)',   verb: 'edited' },
    DELETED:  { icon: Trash2,     color: 'var(--g-red)',    verb: 'deleted' },
    RENAMED:  { icon: Pencil,     color: 'var(--g-blue)',   verb: 'renamed' },
    RESTORED: { icon: Undo2,      color: 'var(--g-green)',  verb: 'restored' },
    JOINED:   { icon: UserPlus,   color: 'var(--g-blue)',   verb: 'joined' },
    INVITED:  { icon: UserPlus,   color: 'var(--g-yellow)', verb: 'invited' },
};
const ENTITY_LABEL = {
    WORKSPACE: 'workspace', FOLDER: 'folder', DOCUMENT: 'document', MEMBER: 'member',
};

/* ── StatCard ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
    return (
        <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ backgroundColor: iconBg }}>
                <Icon size={17} style={{ color: iconColor }} />
            </div>
            <div>
                <div className="dash-stat-value">{value}</div>
                <div className="dash-stat-label">{label}</div>
            </div>
        </div>
    );
}

/* ── CreateWorkspaceModal ─────────────────────────────────────────────────── */
function CreateWorkspaceModal({ onClose }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createWorkspaceMutation = useCreateWorkspace();

    const handleSubmit = (e) => {
        e.preventDefault();
        createWorkspaceMutation.mutate({ name, description }, { onSuccess: onClose });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
                <div className="modal-header">
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        New Workspace
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1, padding: '2px 6px' }}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label className="ds-label" htmlFor="dash-ws-name">Workspace name</label>
                            <input id="dash-ws-name" type="text" className="ds-input" value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Marketing Q3" required autoFocus />
                        </div>
                        <div>
                            <label className="ds-label" htmlFor="dash-ws-desc">
                                Description <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
                            </label>
                            <textarea id="dash-ws-desc" className="ds-input" value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's this workspace for?" rows={2}
                                style={{ resize: 'none', lineHeight: 1.6 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button type="button" onClick={onClose} className="ds-btn ds-btn-ghost">Cancel</button>
                            <button type="submit" className="ds-btn ds-btn-primary" disabled={createWorkspaceMutation.isPending}>
                                {createWorkspaceMutation.isPending ? 'Creating…' : 'Create Workspace'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ── ActivityPreview — cross-workspace, real data ────────────────────────── */
function ActivityPreview({ onViewAll }) {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useAllWorkspacesActivity();

    if (isError) {
        console.error('Recent activity fetch error:', error);
    }

    const logs = (data?.data || []).slice(0, 10);

    return (
        <div className="dash-section-block">
            <div className="dash-section-block-head">
                <span className="dash-section-block-title">
                    <Activity size={13} />
                    Recent Activity
                </span>
                <button onClick={onViewAll} className="dash-section-block-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View all <ArrowRight size={11} />
                </button>
            </div>

            {isLoading ? (
                <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                    <div className="ds-spinner" /> Loading…
                </div>
            ) : isError ? (
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--g-red)' }}>
                    <span>Failed to load recent activity.</span>
                    <button onClick={() => refetch()} className="ds-btn ds-btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>
                        Retry
                    </button>
                </div>
            ) : logs.length === 0 ? (
                <div style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                    No activity yet across your workspaces.
                </div>
            ) : (
                <div className="dash-activity-list">
                    {logs.map((log) => {
                        const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.UPDATED;
                        const Icon = config.icon;
                        const entityLabel = ENTITY_LABEL[log.entityType] || log.entityType?.toLowerCase();
                        return (
                            <div key={log.id} className="dash-activity-item">
                                <div className="dash-activity-dot" style={{ borderColor: config.color }}>
                                    <Icon size={11} style={{ color: config.color }} />
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p className="dash-activity-text">
                                        <strong>{log.userName}</strong>{' '}
                                        {log.entityType === 'MEMBER' ? (
                                            <>{config.verb} <strong>{log.entityName}</strong></>
                                        ) : (
                                            <>{config.verb} the {entityLabel} <strong>"{log.entityName}"</strong></>
                                        )}
                                    </p>
                                    <p className="dash-activity-time">
                                        {log.workspaceName && (
                                            <>
                                                <span
                                                    style={{
                                                        color: 'var(--text-secondary)',
                                                        fontWeight: 600,
                                                        cursor: log.workspaceId ? 'pointer' : 'default',
                                                    }}
                                                    onClick={() => log.workspaceId && navigate(`/workspaces/${log.workspaceId}`)}
                                                >
                                                    {log.workspaceName}
                                                </span>
                                                {' · '}
                                            </>
                                        )}
                                        {formatRelativeTime(log.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── RecentDocumentsPreview (cross-workspace, real data) ──────────────────── */
function RecentDocumentsPreview({ workspacesCount }) {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useRecentDocumentsAcrossWorkspaces();

    if (isError) {
        console.error('Recent documents fetch error:', error);
    }

    const docs = (data?.data || []).slice(0, 8);

    const sectionTitle = workspacesCount > 1
        ? 'Recent Documents · All Workspaces'
        : 'Recent Documents';

    return (
        <div className="dash-section-block">
            <div className="dash-section-block-head">
                <span className="dash-section-block-title">
                    <FileText size={13} />
                    {sectionTitle}
                </span>
                <Link to="/workspaces" className="dash-section-block-link">
                    All workspaces <ArrowRight size={11} />
                </Link>
            </div>

            {isLoading ? (
                <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                    <div className="ds-spinner" /> Loading…
                </div>
            ) : isError ? (
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--g-red)' }}>
                    <span>Failed to load recent documents.</span>
                    <button onClick={() => refetch()} className="ds-btn ds-btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>
                        Retry
                    </button>
                </div>
            ) : docs.length === 0 ? (
                <div style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                    No documents yet across your workspaces.
                </div>
            ) : (
                <div className="dash-doc-list">
                    {docs.map((doc) => (
                        <div
                            key={doc.id}
                            className="dash-doc-item"
                            onClick={() => navigate(`/documents/${doc.id}`)}
                            role="link"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && navigate(`/documents/${doc.id}`)}
                        >
                            <div className="dash-doc-icon">
                                <FileText size={13} style={{ color: 'var(--g-blue)' }} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p className="dash-doc-title">{doc.title || 'Untitled Document'}</p>
                                <p className="dash-doc-ws">
                                    {doc.workspaceName || 'Workspace'}
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                                        {' · '}
                                        {formatRelativeTime(doc.updatedAt || doc.createdAt)}
                                    </span>
                                </p>
                            </div>
                            <ArrowRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: 'auto' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── DashboardPage ────────────────────────────────────────────────────────── */
function DashboardPage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { data, isLoading, isError } = useWorkspaces();
    const { data: invitationsData } = useMyPendingInvitations();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const workspaces = data?.data || [];
    const pendingInvitations = invitationsData?.data || [];
    const ownedCount = workspaces.filter((ws) => ws.owner).length;

    // Primary workspace for previewing activity + documents
    const primaryWs = workspaces[0] || null;

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '48px 0' }}>
                <div className="ds-spinner" />
                <span style={{ fontSize: 14 }}>Loading your workspace…</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="dash-empty" style={{ maxWidth: 480 }}>
                <div className="dash-empty-icon">
                    <Layers size={22} style={{ color: 'var(--g-red)' }} />
                </div>
                <p className="dash-empty-title">Unable to load your data</p>
                <p className="dash-empty-desc">There was a problem connecting to the server. Please refresh the page.</p>
                <button className="ds-btn ds-btn-ghost" onClick={() => window.location.reload()}>Refresh</button>
            </div>
        );
    }

    const firstName = getFirstName(user?.name);
    const greeting = getGreeting();
    const isNewUser = workspaces.length === 0;

    return (
        <>
            {/* ── Welcome header ─────────────────────────────────────────── */}
            <div className="dash-welcome">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="dash-welcome-title">
                            {greeting}{firstName ? `, ${firstName}` : ''} 👋
                        </h1>
                        <p className="dash-welcome-subtitle">
                            {isNewUser
                                ? 'Welcome to DocSphere — create your first workspace to get started.'
                                : `Here's a summary of your DocSphere account.`}
                        </p>
                    </div>
                    <button id="dashboard-create-workspace-btn" className="ds-btn ds-btn-primary"
                        onClick={() => setShowCreateModal(true)} style={{ flexShrink: 0 }}>
                        <Plus size={15} />
                        New Workspace
                    </button>
                </div>
            </div>

            {/* ── Stats strip ────────────────────────────────────────────── */}
            <div className="dash-stat-grid" style={{ marginBottom: 24 }}>
                <StatCard icon={Layers} iconBg="rgba(66,133,244,0.10)" iconColor="var(--g-blue)"
                    value={workspaces.length} label="Total Workspaces" />
                <StatCard icon={Users} iconBg="rgba(52,168,83,0.10)" iconColor="var(--g-green)"
                    value={ownedCount} label="Owned by You" />
                <StatCard icon={Bell} iconBg="rgba(251,188,4,0.12)" iconColor="var(--g-yellow)"
                    value={pendingInvitations.length} label="Pending Invitations" />
            </div>

            {/* ── New user empty state ────────────────────────────────────── */}
            {isNewUser ? (
                <div className="dash-empty">
                    <div className="dash-empty-icon">
                        <Sparkles size={22} style={{ color: 'var(--g-blue)' }} />
                    </div>
                    <p className="dash-empty-title">Create your first workspace</p>
                    <p className="dash-empty-desc">
                        Workspaces help you organize documents and collaborate with your team.
                        Create one now to get started.
                    </p>
                    <button id="dash-empty-create-ws" className="ds-btn ds-btn-primary"
                        onClick={() => setShowCreateModal(true)}>
                        <Plus size={14} />
                        Create Workspace
                    </button>
                </div>
            ) : (
                /* ── Two-column layout ─────────────────────────────────────── */
                <div className="dash-layout">

                    {/* ── Main column ─────────────────────────────────────── */}
                    <div>
                        {/* Jump back in */}
                        <div className="dash-section-block">
                            <div className="dash-section-block-head">
                                <span className="dash-section-block-title">Jump back in</span>
                                {workspaces.length > 4 && (
                                    <Link to="/workspaces" className="dash-section-block-link">
                                        All workspaces <ArrowRight size={11} />
                                    </Link>
                                )}
                            </div>
                            <div className="dash-ws-list">
                                {workspaces.slice(0, 4).map((ws, i) => {
                                    const accent = getAccent(i);
                                    return (
                                        <div key={ws.id} className="dash-ws-list-item"
                                            onClick={() => navigate(`/workspaces/${ws.id}`)}
                                            role="link" tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && navigate(`/workspaces/${ws.id}`)}>
                                            <div className="dash-ws-list-avatar"
                                                style={{ backgroundColor: accent.bg, color: accent.color }}>
                                                {ws.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <p className="dash-ws-list-name">{ws.name}</p>
                                                {ws.description && (
                                                    <p className="dash-ws-list-meta">{ws.description}</p>
                                                )}
                                            </div>
                                            <span className={`ds-badge ${ws.owner ? 'ds-badge-blue' : 'ds-badge-green'}`}>
                                                {ws.owner ? 'Owner' : 'Member'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Documents across all workspaces */}
                        <RecentDocumentsPreview workspacesCount={workspaces.length} />

                        {/* Activity preview — across all workspaces */}
                        <ActivityPreview
                            onViewAll={() => navigate('/activity')}
                        />
                    </div>

                    {/* ── Sidebar ─────────────────────────────────────────── */}
                    <div>
                        {/* Pending invitations */}
                        {pendingInvitations.length > 0 && (
                            <div className="dash-sidebar-section" style={{ marginBottom: 16 }}>
                                <div className="dash-sidebar-section-head">
                                    <span className="dash-sidebar-section-title">Invitations</span>
                                    <span className="ds-badge ds-badge-yellow">{pendingInvitations.length}</span>
                                </div>
                                <div style={{ padding: '14px 16px' }}>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        You have {pendingInvitations.length} pending workspace invitation{pendingInvitations.length > 1 ? 's' : ''}.
                                        Check your email to accept.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Quick actions */}
                        <div className="dash-sidebar-section">
                            <div className="dash-sidebar-section-head">
                                <span className="dash-sidebar-section-title">Quick Actions</span>
                            </div>

                            <button id="dash-sidebar-new-ws" className="dash-sidebar-action"
                                onClick={() => setShowCreateModal(true)}>
                                <div className="dash-sidebar-action-icon" style={{ backgroundColor: 'rgba(66,133,244,0.10)' }}>
                                    <Plus size={14} style={{ color: 'var(--g-blue)' }} />
                                </div>
                                New Workspace
                            </button>

                            <Link to="/workspaces" id="dash-sidebar-browse-ws" className="dash-sidebar-action">
                                <div className="dash-sidebar-action-icon" style={{ backgroundColor: 'rgba(52,168,83,0.10)' }}>
                                    <LayoutGrid size={14} style={{ color: 'var(--g-green)' }} />
                                </div>
                                Manage Workspaces
                            </Link>

                            <button id="dash-sidebar-activity" className="dash-sidebar-action"
                                onClick={() => navigate('/activity')}>
                                <div className="dash-sidebar-action-icon" style={{ backgroundColor: 'rgba(251,188,4,0.12)' }}>
                                    <Activity size={14} style={{ color: 'var(--g-yellow)' }} />
                                </div>
                                Full Activity Log
                            </button>

                            {primaryWs && (
                                <button id="dash-sidebar-members" className="dash-sidebar-action"
                                    onClick={() => navigate(`/workspaces/${primaryWs.id}/members`)}>
                                    <div className="dash-sidebar-action-icon" style={{ backgroundColor: 'rgba(234,67,53,0.08)' }}>
                                        <Users size={14} style={{ color: 'var(--g-red)' }} />
                                    </div>
                                    Workspace Members
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Create workspace modal ─────────────────────────────────── */}
            {showCreateModal && (
                <CreateWorkspaceModal onClose={() => setShowCreateModal(false)} />
            )}
        </>
    );
}

export default DashboardPage;