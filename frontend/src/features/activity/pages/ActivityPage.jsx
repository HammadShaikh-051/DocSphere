import { useParams } from 'react-router-dom';
import { FolderPlus, FileText, UserPlus, UserMinus, Edit3, Trash2, Activity as ActivityIcon, Pencil, Undo2 } from 'lucide-react';
import { useWorkspaceActivity } from '../useActivity';
import { formatRelativeTime, formatDateGroup } from '../../../utils/formatRelativeTime';

const ACTION_CONFIG = {
    CREATED:  { icon: FolderPlus, color: 'var(--g-green)',  verb: 'created' },
    UPDATED:  { icon: Edit3,      color: 'var(--g-blue)',   verb: 'edited' },
    DELETED:  { icon: Trash2,     color: 'var(--g-red)',    verb: 'deleted' },
    RENAMED:  { icon: Pencil,     color: 'var(--g-blue)',   verb: 'renamed' },
    RESTORED: { icon: Undo2,      color: 'var(--g-green)',  verb: 'restored' },
    JOINED:   { icon: UserPlus,   color: 'var(--g-blue)',   verb: 'joined the workspace' },
    INVITED:  { icon: UserPlus,   color: 'var(--g-yellow)', verb: 'invited' },
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
    const { data, isLoading } = useWorkspaceActivity(workspaceId);

    const logs = data?.data || [];
    const groups = groupByDate(logs);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <div className="ds-spinner" /> Loading activity…
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <ActivityIcon size={20} style={{ color: 'var(--text-secondary)' }} />
                <h1 className="page-title">Activity</h1>
            </div>

            {logs.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No activity yet.</p>
            ) : (
                groups.map((group) => (
                    <div key={group.label} style={{ marginBottom: '28px' }}>
                        <h2 style={{
                            fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)',
                            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px',
                        }}>
                            {group.label}
                        </h2>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', left: '11px', top: '8px', bottom: '8px',
                                width: '2px', background: 'var(--border)',
                            }} />

                            {group.logs.map((log) => {
                                const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.CREATED;
                                const Icon = config.icon;
                                const entityLabel = ENTITY_LABEL[log.entityType] || log.entityType.toLowerCase();

                                return (
                                    <div key={log.id} style={{ display: 'flex', gap: '14px', marginBottom: '18px', position: 'relative' }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            background: 'var(--surface)', border: `2px solid ${config.color}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, zIndex: 1,
                                        }}>
                                            <Icon size={12} style={{ color: config.color }} />
                                        </div>

                                        <div style={{ paddingTop: '2px' }}>
                                            <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                                                <strong>{log.userName}</strong>{' '}
                                                {log.entityType === 'MEMBER' ? (
                                                    <>
                                                        {config.verb} <strong>{log.entityName}</strong>
                                                    </>
                                                ) : (
                                                    <>
                                                        {config.verb} the {entityLabel} <strong>"{log.entityName}"</strong>
                                                    </>
                                                )}
                                            </p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                {formatRelativeTime(log.createdAt)}
                                            </p>
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