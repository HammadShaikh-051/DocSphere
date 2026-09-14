import { useParams, Link } from 'react-router-dom';
import { FolderPlus, FileText, UserPlus, Edit3, Trash2, Activity as ActivityIcon, Pencil, Undo2, Clock, Sparkles } from 'lucide-react';
import { useWorkspaceActivity, useAllWorkspacesActivity } from '../useActivity';
import { formatRelativeTime, formatDateGroup } from '../../../utils/formatRelativeTime';

const ACTION_CONFIG = {
    CREATED:  { icon: FolderPlus, color: 'var(--g-green)',  bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', verb: 'created' },
    UPDATED:  { icon: Edit3,      color: 'var(--g-blue)',   bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', verb: 'edited' },
    DELETED:  { icon: Trash2,     color: 'var(--g-red)',    bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.25)',  verb: 'deleted' },
    RENAMED:  { icon: Pencil,     color: 'var(--g-blue)',   bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', verb: 'renamed' },
    RESTORED: { icon: Undo2,      color: 'var(--g-green)',  bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', verb: 'restored' },
    JOINED:   { icon: UserPlus,   color: 'var(--g-blue)',   bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', verb: 'joined the workspace' },
    INVITED:  { icon: UserPlus,   color: 'var(--g-yellow)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', verb: 'invited' },
};

const ENTITY_LABEL = {
    WORKSPACE: 'workspace',
    FOLDER: 'folder',
    DOCUMENT: 'document',
    MEMBER: 'member',
};

function groupByDate(logs) {
    const groups = [];
    let currentGroupLabel = null;
    let currentGroup = null;

    for (const log of logs) {
        const label = formatDateGroup(log.createdAt);
        if (label !== currentGroupLabel) {
            currentGroupLabel = label;
            currentGroup = { label, logs: [] };
            groups.push(currentGroup);
        }
        currentGroup.logs.push(log);
    }

    return groups;
}

function ActivityPage() {
    const { workspaceId } = useParams();
    const isWorkspaceScoped = !!workspaceId;

    const workspaceQuery = useWorkspaceActivity(workspaceId);
    const allQuery = useAllWorkspacesActivity();

    const { data, isLoading, isError, error } = isWorkspaceScoped ? workspaceQuery : allQuery;

    if (isError) {
        console.error('Activity fetch error:', error);
    }

    const logs = data?.data || [];
    const groups = groupByDate(logs);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '48px 0' }}>
                <div className="ds-spinner" />
                <span style={{ fontSize: 14 }}>Loading activity timeline…</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ maxWidth: '680px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <ActivityIcon size={22} style={{ color: 'var(--text-secondary)' }} />
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                        {isWorkspaceScoped ? 'Workspace Activity' : 'All Activity'}
                    </h1>
                </div>
                <div className="ds-alert ds-alert-red">
                    Failed to load activity logs. Please refresh the page.
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '680px' }}>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--g-yellow)',
                        }}
                    >
                        <ActivityIcon size={18} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                            {isWorkspaceScoped ? 'Workspace Activity' : 'Activity Timeline'}
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {isWorkspaceScoped
                                ? 'Audit log of actions within this workspace'
                                : 'Comprehensive real-time activity stream across all your workspaces'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Timeline ────────────────────────────────────────────────── */}
            {logs.length === 0 ? (
                <div
                    style={{
                        padding: '36px 24px',
                        background: 'var(--surface-1)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--surface-2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <Sparkles size={20} />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No activity recorded yet
                    </p>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Actions like creating folders, editing documents, and inviting team members will appear here.
                    </p>
                </div>
            ) : (
                groups.map((group) => (
                    <div key={group.label} style={{ marginBottom: '32px' }}>
                        {/* Date Group Header */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: '99px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                color: 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                marginBottom: '18px',
                            }}
                        >
                            {group.label}
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '8px' }}>
                            {/* Vertical connecting line */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '18px',
                                    top: '12px',
                                    bottom: '12px',
                                    width: '2px',
                                    background: 'var(--border)',
                                }}
                            />

                            {group.logs.map((log) => {
                                const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.CREATED;
                                const Icon = config.icon;
                                const entityLabel = ENTITY_LABEL[log.entityType] || log.entityType?.toLowerCase();

                                return (
                                    <div
                                        key={log.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '14px',
                                            marginBottom: '16px',
                                            position: 'relative',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: config.bg,
                                                border: `1px solid ${config.border}`,
                                                color: config.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                zIndex: 1,
                                                marginTop: '2px',
                                            }}
                                        >
                                            <Icon size={12} />
                                        </div>

                                        <div
                                            style={{
                                                flex: 1,
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '12px 16px',
                                                boxShadow: 'var(--shadow-card)',
                                            }}
                                        >
                                            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                                <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.userName}</strong>{' '}
                                                {log.entityType === 'MEMBER' ? (
                                                    <>
                                                        {config.verb} <strong style={{ color: 'var(--text-primary)' }}>{log.entityName}</strong>
                                                    </>
                                                ) : (
                                                    <>
                                                        {config.verb} the {entityLabel} <strong style={{ color: 'var(--text-primary)' }}>"{log.entityName}"</strong>
                                                    </>
                                                )}
                                            </p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '11.5px',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '4px',
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                {log.workspaceName && (
                                                    <Link
                                                        to={`/workspaces/${log.workspaceId}`}
                                                        style={{
                                                            color: 'var(--accent)',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        {log.workspaceName}
                                                    </Link>
                                                )}
                                                {log.workspaceName && <span>·</span>}
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <Clock size={11} />
                                                    {formatRelativeTime(log.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ActivityPage;