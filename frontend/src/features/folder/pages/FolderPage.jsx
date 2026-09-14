import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Folder,
    FileText,
    ChevronRight,
    MoreVertical,
    Pencil,
    Trash2,
    FolderPlus,
    FilePlus,
    ArrowRight,
    Home,
} from 'lucide-react';
import { useFolderDetail, useSubFolders, useCreateSubFolder, useDeleteFolder, useRenameFolder } from '../useFolder';
import { useFolderDocuments, useCreateDocumentInFolder, useDeleteDocument, useRenameDocument } from '../../document/useDocument';

function FolderPage() {
    const { workspaceId, folderId } = useParams();
    const navigate = useNavigate();

    const { data: folderData, isLoading: isFolderLoading } = useFolderDetail(folderId);
    const { data: subFoldersData, isLoading: isSubFoldersLoading } = useSubFolders(folderId);
    const { data: documentsData, isLoading: isDocumentsLoading } = useFolderDocuments(folderId);

    const createSubFolderMutation = useCreateSubFolder(folderId, workspaceId);
    const createDocumentMutation = useCreateDocumentInFolder(folderId, workspaceId);

    const [newFolderName, setNewFolderName] = useState('');
    const [showFolderForm, setShowFolderForm] = useState(false);

    const folder = folderData?.data;
    const subFolders = subFoldersData?.data || [];
    const documents = documentsData?.data || [];

    const [openMenuId, setOpenMenuId] = useState(null);
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const [openDocMenuId, setOpenDocMenuId] = useState(null);
    const [renamingDocId, setRenamingDocId] = useState(null);
    const [renameDocTitle, setRenameDocTitle] = useState('');

    const deleteFolderMutation = useDeleteFolder();
    const renameFolderMutation = useRenameFolder();
    const deleteDocMutation = useDeleteDocument();
    const renameDocMutation = useRenameDocument();

    const toggleMenu = (e, targetFolderId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === targetFolderId ? null : targetFolderId);
    };

    const handleDeleteSubFolder = (e, sub) => {
        e.stopPropagation();
        setOpenMenuId(null);
        if (confirm(`Move "${sub.name}" to trash?`)) {
            deleteFolderMutation.mutate(sub.id);
        }
    };

    const startRename = (e, sub) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setRenamingId(sub.id);
        setRenameValue(sub.name);
    };

    const submitRename = (e, targetFolderId) => {
        e.preventDefault();
        e.stopPropagation();
        renameFolderMutation.mutate(
            { folderId: targetFolderId, name: renameValue },
            { onSuccess: () => setRenamingId(null) }
        );
    };

    const toggleDocMenu = (e, docId) => {
        e.stopPropagation();
        setOpenDocMenuId(openDocMenuId === docId ? null : docId);
    };

    const handleDeleteDoc = (e, doc) => {
        e.stopPropagation();
        setOpenDocMenuId(null);
        if (confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
            deleteDocMutation.mutate(doc.id);
        }
    };

    const startRenameDoc = (e, doc) => {
        e.stopPropagation();
        setOpenDocMenuId(null);
        setRenamingDocId(doc.id);
        setRenameDocTitle(doc.title);
    };

    const submitRenameDoc = (e, docId) => {
        e.preventDefault();
        e.stopPropagation();
        renameDocMutation.mutate(
            { documentId: docId, title: renameDocTitle },
            { onSuccess: () => setRenamingDocId(null) }
        );
    };

    const handleCreateSubFolder = (e) => {
        e.preventDefault();
        createSubFolderMutation.mutate(
            { name: newFolderName },
            {
                onSuccess: () => {
                    setNewFolderName('');
                    setShowFolderForm(false);
                },
            }
        );
    };

    const handleCreateDocument = () => {
        createDocumentMutation.mutate({ title: 'Untitled Document' });
    };

    if (isFolderLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '48px 0' }}>
                <div className="ds-spinner" />
                <span style={{ fontSize: 14 }}>Loading folder…</span>
            </div>
        );
    }

    return (
        <div>
            {/* ── Breadcrumb Navigation ──────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    fontSize: '13px',
                }}
            >
                <Link
                    to={`/workspaces/${workspaceId}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                    <Home size={14} />
                    <span>Workspace</span>
                </Link>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{folder?.name}</span>
            </div>

            {/* ── Folder Header ───────────────────────────────────────────── */}
            <div
                style={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 28px',
                    marginBottom: '28px',
                    boxShadow: 'var(--shadow-card)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--g-yellow)',
                            flexShrink: 0,
                        }}
                    >
                        <Folder size={22} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                            {folder?.name}
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {subFolders.length} subfolder{subFolders.length !== 1 ? 's' : ''} · {documents.length} document{documents.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Subfolders Section ──────────────────────────────────────── */}
            <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Subfolders
                        </h2>
                        <span className="ds-badge ds-badge-yellow" style={{ fontSize: '11px', padding: '2px 8px' }}>
                            {subFolders.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowFolderForm(true)}
                        className="ds-btn ds-btn-ghost"
                        style={{ gap: '6px', fontSize: '13px', color: 'var(--accent)' }}
                    >
                        <FolderPlus size={15} />
                        New Folder
                    </button>
                </div>

                {showFolderForm && (
                    <form
                        onSubmit={handleCreateSubFolder}
                        style={{
                            background: 'var(--surface-1)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '14px 16px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            animation: 'slideDown 0.15s ease',
                        }}
                    >
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name…"
                            required
                            className="ds-input"
                            style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                            autoFocus
                        />
                        <button type="submit" className="ds-btn ds-btn-primary" disabled={createSubFolderMutation.isPending || !newFolderName.trim()}>
                            {createSubFolderMutation.isPending ? 'Creating…' : 'Create'}
                        </button>
                        <button
                            type="button"
                            className="ds-btn ds-btn-ghost"
                            onClick={() => { setShowFolderForm(false); setNewFolderName(''); }}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {isSubFoldersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
                        <div className="ds-spinner" style={{ width: '16px', height: '16px' }} /> Loading subfolders…
                    </div>
                ) : subFolders.length === 0 ? (
                    <div
                        style={{
                            background: 'var(--surface-1)',
                            border: '1px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '24px 20px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontSize: '13px',
                        }}
                    >
                        No subfolders here yet.
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '12px',
                        }}
                    >
                        {subFolders.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => renamingId !== sub.id && navigate(`/workspaces/${workspaceId}/folders/${sub.id}`)}
                                style={{
                                    position: 'relative',
                                    background: 'var(--surface-1)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '12px 14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.15s ease',
                                    boxShadow: 'var(--shadow-card)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                    e.currentTarget.style.background = 'var(--surface-2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.background = 'var(--surface-1)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: 'rgba(245, 158, 11, 0.12)',
                                        border: '1px solid rgba(245, 158, 11, 0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--g-yellow)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Folder size={16} />
                                </div>

                                {renamingId === sub.id ? (
                                    <form
                                        onSubmit={(e) => submitRename(e, sub.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ flex: 1, display: 'flex', gap: '6px' }}
                                    >
                                        <input
                                            type="text"
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            className="ds-input"
                                            style={{ flex: 1, fontSize: '13px', padding: '4px 8px' }}
                                            autoFocus
                                            onBlur={() => setRenamingId(null)}
                                        />
                                    </form>
                                ) : (
                                    <span
                                        style={{
                                            fontSize: '13.5px',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1,
                                        }}
                                    >
                                        {sub.name}
                                    </span>
                                )}

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => toggleMenu(e, sub.id)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: openMenuId === sub.id ? 'var(--surface-3)' : 'transparent',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <MoreVertical size={15} />
                                    </button>

                                    {openMenuId === sub.id && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: 'calc(100% + 4px)',
                                                minWidth: '140px',
                                                background: 'var(--surface-2)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '4px',
                                                boxShadow: 'var(--shadow-lg)',
                                                zIndex: 30,
                                            }}
                                        >
                                            <button
                                                onClick={(e) => startRename(e, sub)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    width: '100%',
                                                    padding: '7px 10px',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    color: 'var(--text-primary)',
                                                    textAlign: 'left',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-3)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                            >
                                                <Pencil size={13} />
                                                Rename
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteSubFolder(e, sub)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    width: '100%',
                                                    padding: '7px 10px',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    color: 'var(--g-red)',
                                                    textAlign: 'left',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                            >
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Documents Section ───────────────────────────────────────── */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Documents
                        </h2>
                        <span className="ds-badge ds-badge-blue" style={{ fontSize: '11px', padding: '2px 8px' }}>
                            {documents.length}
                        </span>
                    </div>
                    <button
                        onClick={handleCreateDocument}
                        className="ds-btn ds-btn-primary"
                        style={{ gap: '6px', fontSize: '13px' }}
                    >
                        <FilePlus size={15} />
                        New Document
                    </button>
                </div>

                {isDocumentsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
                        <div className="ds-spinner" style={{ width: '16px', height: '16px' }} /> Loading documents…
                    </div>
                ) : documents.length === 0 ? (
                    <div
                        style={{
                            background: 'var(--surface-1)',
                            border: '1px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '28px 20px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontSize: '13px',
                        }}
                    >
                        No documents in this folder yet. Click "+ New Document" to create one.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                onClick={() => renamingDocId !== document.id && navigate(`/documents/${document.id}`)}
                                style={{
                                    position: 'relative',
                                    background: 'var(--surface-1)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    transition: 'all 0.15s ease',
                                    boxShadow: 'var(--shadow-card)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                    e.currentTarget.style.background = 'var(--surface-2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.background = 'var(--surface-1)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: 'rgba(59, 130, 246, 0.12)',
                                            border: '1px solid rgba(59, 130, 246, 0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--g-blue)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <FileText size={16} />
                                    </div>

                                    {renamingDocId === document.id ? (
                                        <form
                                            onSubmit={(e) => submitRenameDoc(e, document.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ flex: 1, display: 'flex', gap: '6px' }}
                                        >
                                            <input
                                                type="text"
                                                value={renameDocTitle}
                                                onChange={(e) => setRenameDocTitle(e.target.value)}
                                                className="ds-input"
                                                style={{ flex: 1, fontSize: '13.5px', padding: '4px 8px' }}
                                                autoFocus
                                                onBlur={() => setRenamingDocId(null)}
                                            />
                                        </form>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {document.title}
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Open <ArrowRight size={12} />
                                    </span>

                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={(e) => toggleDocMenu(e, document.id)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: openDocMenuId === document.id ? 'var(--surface-3)' : 'transparent',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                            }}
                                            title="Document options"
                                        >
                                            <MoreVertical size={15} />
                                        </button>

                                        {openDocMenuId === document.id && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 'calc(100% + 4px)',
                                                    minWidth: '140px',
                                                    background: 'var(--surface-2)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '4px',
                                                    boxShadow: 'var(--shadow-lg)',
                                                    zIndex: 30,
                                                }}
                                            >
                                                <button
                                                    onClick={(e) => startRenameDoc(e, document)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        width: '100%',
                                                        padding: '7px 10px',
                                                        background: 'none',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        color: 'var(--text-primary)',
                                                        textAlign: 'left',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-3)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                                >
                                                    <Pencil size={13} />
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteDoc(e, document)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        width: '100%',
                                                        padding: '7px 10px',
                                                        background: 'none',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        color: 'var(--g-red)',
                                                        textAlign: 'left',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                                >
                                                    <Trash2 size={13} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default FolderPage;