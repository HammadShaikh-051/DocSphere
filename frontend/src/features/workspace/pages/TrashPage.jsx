import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, FileText, RotateCcw, Trash2, AlertTriangle, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { useTrashedFolders, useRestoreFolder, usePermanentlyDeleteFolder } from '../../folder/useFolder';
import { useTrashedDocuments, useRestoreDocument, usePermanentlyDeleteDocument } from '../../document/useDocument';

function daysLeft(deletedAt) {
    let deleted;
    if (Array.isArray(deletedAt)) {
        deleted = new Date(
            deletedAt[0],
            deletedAt[1] - 1,
            deletedAt[2],
            deletedAt[3] || 0,
            deletedAt[4] || 0,
            deletedAt[5] || 0
        );
    } else {
        deleted = new Date(deletedAt);
    }
    if (isNaN(deleted.getTime())) return 30;
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

    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'folders' | 'documents'

    const folders = foldersData?.data || [];
    const documents = documentsData?.data || [];
    const totalCount = folders.length + documents.length;
    const isLoading = isFoldersLoading || isDocumentsLoading;

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
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Navigation / Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <Link
                    to={`/workspaces/${workspaceId}`}
                    className="ds-btn ds-btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <ArrowLeft size={14} /> Back to Workspace
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: 'var(--g-red)',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        <ShieldAlert size={13} />
                        {totalCount} {totalCount === 1 ? 'item' : 'items'} in trash
                    </span>
                </div>
            </div>

            {/* Header Hero */}
            <div
                style={{
                    background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-30px',
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--g-red)',
                            flexShrink: 0,
                        }}
                    >
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                            Trash & Recovery
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                            Items are automatically purged 30 days after being deleted. You can restore or permanently delete them below.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`ds-btn ${activeTab === 'all' ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
                        style={{ padding: '6px 14px', fontSize: '12.5px' }}
                    >
                        All ({totalCount})
                    </button>
                    <button
                        onClick={() => setActiveTab('folders')}
                        className={`ds-btn ${activeTab === 'folders' ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
                        style={{ padding: '6px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Folder size={14} style={{ color: 'var(--g-yellow)' }} />
                        Folders ({folders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`ds-btn ${activeTab === 'documents' ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
                        style={{ padding: '6px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <FileText size={14} style={{ color: 'var(--g-blue)' }} />
                        Documents ({documents.length})
                    </button>
                </div>
            </div>

            {/* Content Lists */}
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px', color: 'var(--text-muted)' }}>
                    <div className="ds-spinner" /> Loading trashed items…
                </div>
            ) : totalCount === 0 ? (
                <div
                    style={{
                        padding: '60px 24px',
                        background: 'var(--surface)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            color: 'var(--g-blue)',
                        }}
                    >
                        <Trash2 size={22} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Trash is empty
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                        No folders or documents are currently in the trash for this workspace.
                    </p>
                    <Link to={`/workspaces/${workspaceId}`} className="ds-btn ds-btn-primary">
                        Return to Workspace
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Folders Section */}
                    {(activeTab === 'all' || activeTab === 'folders') && folders.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                                    Folders ({folders.length})
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {folders.map((folder) => {
                                    const left = daysLeft(folder.deletedAt);
                                    const isUrgent = left <= 7;
                                    return (
                                        <div
                                            key={folder.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '14px 18px',
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                gap: '16px',
                                                transition: 'border-color 0.15s ease, background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(251, 188, 4, 0.4)';
                                                e.currentTarget.style.background = 'var(--surface-2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.background = 'var(--surface)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(251, 188, 4, 0.12)',
                                                        border: '1px solid rgba(251, 188, 4, 0.2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        color: 'var(--g-yellow)',
                                                    }}
                                                >
                                                    <Folder size={18} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {folder.name}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                                        <span
                                                            style={{
                                                                fontSize: '11px',
                                                                fontWeight: 500,
                                                                color: isUrgent ? 'var(--g-red)' : 'var(--text-muted)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <Clock size={12} />
                                                            {left} {left === 1 ? 'day' : 'days'} left before permanent deletion
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                <button
                                                    onClick={() => restoreFolderMutation.mutate(folder.id)}
                                                    disabled={restoreFolderMutation.isPending}
                                                    className="ds-btn ds-btn-ghost"
                                                    style={{ gap: '6px', fontSize: '12.5px', padding: '6px 12px' }}
                                                    title="Restore folder to workspace"
                                                >
                                                    <RotateCcw size={13} />
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDeleteFolder(folder)}
                                                    disabled={deleteFolderMutation.isPending}
                                                    className="ds-btn"
                                                    style={{
                                                        gap: '6px',
                                                        fontSize: '12.5px',
                                                        padding: '6px 12px',
                                                        background: 'transparent',
                                                        color: 'var(--g-red)',
                                                        border: '1px solid rgba(239, 68, 68, 0.25)',
                                                    }}
                                                    title="Permanently delete forever"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <Trash2 size={13} />
                                                    Delete Forever
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Documents Section */}
                    {(activeTab === 'all' || activeTab === 'documents') && documents.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                                <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                                    Documents ({documents.length})
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {documents.map((document) => {
                                    const left = daysLeft(document.deletedAt);
                                    const isUrgent = left <= 7;
                                    return (
                                        <div
                                            key={document.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '14px 18px',
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                gap: '16px',
                                                transition: 'border-color 0.15s ease, background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                                e.currentTarget.style.background = 'var(--surface-2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.background = 'var(--surface)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(59, 130, 246, 0.12)',
                                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        color: 'var(--g-blue)',
                                                    }}
                                                >
                                                    <FileText size={18} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {document.title}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                                        <span
                                                            style={{
                                                                fontSize: '11px',
                                                                fontWeight: 500,
                                                                color: isUrgent ? 'var(--g-red)' : 'var(--text-muted)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <Clock size={12} />
                                                            {left} {left === 1 ? 'day' : 'days'} left before permanent deletion
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                <button
                                                    onClick={() => restoreDocumentMutation.mutate(document.id)}
                                                    disabled={restoreDocumentMutation.isPending}
                                                    className="ds-btn ds-btn-ghost"
                                                    style={{ gap: '6px', fontSize: '12.5px', padding: '6px 12px' }}
                                                    title="Restore document to workspace"
                                                >
                                                    <RotateCcw size={13} />
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDeleteDocument(document)}
                                                    disabled={deleteDocumentMutation.isPending}
                                                    className="ds-btn"
                                                    style={{
                                                        gap: '6px',
                                                        fontSize: '12.5px',
                                                        padding: '6px 12px',
                                                        background: 'transparent',
                                                        color: 'var(--g-red)',
                                                        border: '1px solid rgba(239, 68, 68, 0.25)',
                                                    }}
                                                    title="Permanently delete forever"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <Trash2 size={13} />
                                                    Delete Forever
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TrashPage;