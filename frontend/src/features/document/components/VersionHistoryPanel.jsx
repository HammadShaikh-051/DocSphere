import { useState } from 'react';
import { History, Eye, RotateCcw, Clock } from 'lucide-react';
import { useDocumentVersions, useRestoreVersion } from '../useVersion';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';
import VersionPreviewModal from './VersionPreviewModal';

function VersionHistoryPanel({ documentId, onRestore }) {
    const { data, isLoading } = useDocumentVersions(documentId);
    const restoreMutation = useRestoreVersion(documentId);

    const [previewVersionId, setPreviewVersionId] = useState(null);
    const [restoreStatus, setRestoreStatus] = useState(null);

    const versions = data?.data || [];

    const handleRestore = (version) => {
        const confirmed = window.confirm(
            `Restore to Version ${version.versionNumber}?\n\n` +
            `The current document state will be saved as a new version before restoring. ` +
            `No history will be lost.`
        );

        if (!confirmed) return;

        setRestoreStatus(null);

        restoreMutation.mutate(version.id, {
            onSuccess: (responseData) => {
                const updatedDoc = responseData?.data;
                if (updatedDoc && onRestore) {
                    onRestore(updatedDoc);
                }
                setRestoreStatus({
                    type: 'success',
                    message: `✓ Restored to Version ${version.versionNumber}`,
                });
                setTimeout(() => setRestoreStatus(null), 4000);
            },
            onError: (error) => {
                const message = error?.response?.data?.message || 'Restore failed. Please try again.';
                setRestoreStatus({ type: 'error', message: `✕ ${message}` });
                setTimeout(() => setRestoreStatus(null), 5000);
            },
        });
    };

    return (
        <div
            style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={16} style={{ color: 'var(--g-blue)' }} />
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Version History
                    </h3>
                    <span className="ds-badge ds-badge-blue" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {versions.length}
                    </span>
                </div>
            </div>

            {restoreStatus && (
                <div
                    className={`ds-alert ${restoreStatus.type === 'success' ? 'ds-alert-green' : 'ds-alert-red'}`}
                    style={{ marginBottom: '16px', fontSize: '13px' }}
                >
                    {restoreStatus.message}
                </div>
            )}

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '16px 0' }}>
                    <div className="ds-spinner" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px' }}>Loading history…</span>
                </div>
            ) : versions.length === 0 ? (
                <div
                    style={{
                        padding: '24px 20px',
                        backgroundColor: 'var(--surface-2)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        No versions saved yet
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Click <strong>Save Version</strong> above to create a named snapshot of your work.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {versions.map((version, index) => (
                        <div
                            key={version.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '14px',
                                padding: '12px 16px',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.15s ease',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
                                <div
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: index === 0 ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface-3)',
                                        border: index === 0 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)',
                                        color: index === 0 ? 'var(--g-blue)' : 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}
                                >
                                    v{version.versionNumber}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span
                                            style={{
                                                fontSize: '13.5px',
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            {version.createdByName}
                                        </span>
                                        {index === 0 && (
                                            <span className="ds-badge ds-badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                                Current Head
                                            </span>
                                        )}
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Clock size={11} />
                                            {formatRelativeTime(version.createdAt)}
                                        </span>
                                    </div>
                                    {version.description && (
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: 'var(--text-secondary)',
                                                marginTop: '3px',
                                                fontStyle: 'italic',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            "{version.description}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <button
                                    id={`version-view-${version.id}`}
                                    onClick={() => setPreviewVersionId(version.id)}
                                    className="ds-btn ds-btn-ghost"
                                    style={{
                                        fontSize: '12px',
                                        padding: '5px 10px',
                                        gap: '5px',
                                        height: '30px',
                                    }}
                                    title={`Preview Version ${version.versionNumber}`}
                                >
                                    <Eye size={13} />
                                    Preview
                                </button>
                                <button
                                    id={`version-restore-${version.id}`}
                                    onClick={() => handleRestore(version)}
                                    disabled={restoreMutation.isPending}
                                    className="ds-btn ds-btn-primary"
                                    style={{
                                        fontSize: '12px',
                                        padding: '5px 12px',
                                        gap: '5px',
                                        height: '30px',
                                    }}
                                    title={`Restore to Version ${version.versionNumber}`}
                                >
                                    <RotateCcw size={13} />
                                    Restore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <VersionPreviewModal
                isOpen={!!previewVersionId}
                onClose={() => setPreviewVersionId(null)}
                documentId={documentId}
                versionId={previewVersionId}
            />
        </div>
    );
}

export default VersionHistoryPanel;
