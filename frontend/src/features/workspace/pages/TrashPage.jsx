import { useParams } from 'react-router-dom';
import { Folder, FileText, RotateCcw, Trash2 } from 'lucide-react';
import { useTrashedFolders, useRestoreFolder, usePermanentlyDeleteFolder } from '../../folder/useFolder';
import { useTrashedDocuments, useRestoreDocument, usePermanentlyDeleteDocument } from '../../document/useDocument';

function daysLeft(deletedAt) {
    let deleted;
    if (Array.isArray(deletedAt)) {
        // Java LocalDateTime serialized as [year, month, day, hour, min, sec, nano]
        // JS Date months are 0-indexed, Java's are 1-indexed
        deleted = new Date(deletedAt[0], deletedAt[1] - 1, deletedAt[2],
            deletedAt[3] || 0, deletedAt[4] || 0, deletedAt[5] || 0);
    } else {
        deleted = new Date(deletedAt);
    }
    if (isNaN(deleted.getTime())) return 30; // fallback: just-deleted
    const expiry = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const diff = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}

function TrashPage() {
    const { workspaceId } = useParams();

    const { data: foldersData, isLoading: isFoldersLoading } = useTrashedFolders(workspaceId);
    const { data: documentsData, isLoading: isDocumentsLoading } = useTrashedDocuments(workspaceId);

    const restoreFolderMutation = useRestoreFolder(workspaceId);
    const deleteFolderMutation = usePermanentlyDeleteFolder(workspaceId);
    const restoreDocumentMutation = useRestoreDocument(workspaceId);
    const deleteDocumentMutation = usePermanentlyDeleteDocument(workspaceId);

    const folders = foldersData?.data || [];
    const documents = documentsData?.data || [];

    const handlePermanentDeleteFolder = (folder) => {
        if (confirm(`Permanently delete "${folder.name}" and everything inside it? This cannot be undone.`)) {
            deleteFolderMutation.mutate(folder.id);
        }
    };

    const handlePermanentDeleteDocument = (document) => {
        if (confirm(`Permanently delete "${document.title}"? This cannot be undone.`)) {
            deleteDocumentMutation.mutate(document.id);
        }
    };

    return (
        <div>
            <h1 className="page-title" style={{ marginBottom: '8px' }}>Trash</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Items are permanently deleted 30 days after being trashed.
            </p>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Folders
                </h2>

                {isFoldersLoading ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</p>
                ) : folders.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No folders in trash.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Folder size={18} style={{ color: 'var(--g-yellow)' }} />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{folder.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {daysLeft(folder.deletedAt)} days left
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => restoreFolderMutation.mutate(folder.id)}
                                        className="ds-btn ds-btn-ghost"
                                        style={{ gap: '4px' }}
                                    >
                                        <RotateCcw size={14} />
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDeleteFolder(folder)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#dc2626', fontSize: '13px', padding: '4px 8px',
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Delete forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Documents
                </h2>

                {isDocumentsLoading ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading…</p>
                ) : documents.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No documents in trash.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FileText size={18} style={{ color: 'var(--g-blue)' }} />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{document.title}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {daysLeft(document.deletedAt)} days left
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => restoreDocumentMutation.mutate(document.id)}
                                        className="ds-btn ds-btn-ghost"
                                        style={{ gap: '4px' }}
                                    >
                                        <RotateCcw size={14} />
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDeleteDocument(document)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#dc2626', fontSize: '13px', padding: '4px 8px',
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Delete forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default TrashPage;