import { useState } from 'react';
import { History, Eye, RotateCcw } from 'lucide-react';
import { useDocumentVersions, useRestoreVersion } from '../useVersion';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';
import VersionPreviewModal from './VersionPreviewModal';

function VersionHistoryPanel({ documentId, onRestore }) {
    const { data, isLoading } = useDocumentVersions(documentId);
    const restoreMutation = useRestoreVersion(documentId);

    const [previewVersionId, setPreviewVersionId] = useState(null);

    const [restoreStatus, setRestoreStatus] = useState(null); // { type: 'success'|'error', message: string }

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
        <div className="version-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <History size={15} style={{ color: 'var(--text-secondary)' }} />
                <h3 style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}>
                    Version History {versions.length > 0 && `(${versions.length})`}
                </h3>
            </div>

            {restoreStatus && (
                <div
                    className={`ds-alert ${restoreStatus.type === 'success' ? 'ds-alert-green' : 'ds-alert-red'}`}
                    style={{ marginBottom: '14px', fontSize: '13px' }}
                >
                    {restoreStatus.message}
                </div>
            )}

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <div className="ds-spinner" />
                    <span style={{ fontSize: '13px' }}>Loading history…</span>
                </div>
            ) : versions.length === 0 ? (
                <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        No versions saved yet.
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Versions are created when you finish editing a session.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {versions.map((version, index) => (
                        <div key={version.id} className="version-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: index === 0
                                        ? 'var(--g-blue)'
                                        : 'var(--surface-3)',
                                    color: index === 0 ? 'white' : 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}>
                                    {version.versionNumber}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {version.createdByName}
                                        </span>
                                        {index === 0 && (
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                color: 'var(--g-blue)',
                                                backgroundColor: 'var(--accent-light)',
                                                padding: '1px 6px',
                                                borderRadius: '99px',
                                            }}>
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {formatRelativeTime(version.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="version-item-actions">
                                <button
                                    id={`version-view-${version.id}`}
                                    onClick={() => setPreviewVersionId(version.id)}
                                    className="ds-btn"
                                    style={{
                                        fontSize: '12px',
                                        padding: '4px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        height: '28px',
                                    }}
                                    title={`Preview Version ${version.versionNumber}`}
                                >
                                    <Eye size={12} />
                                    View
                                </button>
                                <button
                                    id={`version-restore-${version.id}`}
                                    onClick={() => handleRestore(version)}
                                    disabled={restoreMutation.isPending}
                                    className="ds-btn ds-btn-primary"
                                    style={{
                                        fontSize: '12px',
                                        padding: '4px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        height: '28px',
                                    }}
                                    title={`Restore to Version ${version.versionNumber}`}
                                >
                                    <RotateCcw size={12} />
                                    Restore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal — rendered here but only visible when previewVersionId is set */}
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
