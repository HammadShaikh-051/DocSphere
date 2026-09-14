import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Folder,
    FileText,
    Users,
    Settings,
    Trash2,
    MoreVertical,
    Pencil,
    Activity as ActivityIcon,
    FolderPlus,
    FilePlus,
    ArrowRight,
} from 'lucide-react';
import { useWorkspaceDetail, useUpdateWorkspace, useDeleteWorkspace } from '../useWorkspace';
import { useRootFolders, useCreateFolder, useDeleteFolder, useRenameFolder } from '../../folder/useFolder';
import { useRootDocuments, useCreateDocument, useDeleteDocument, useRenameDocument } from '../../document/useDocument';
import Modal from '../../../components/ui/Modal';

function WorkspacePage() {
    const { workspaceId } = useParams();
    const navigate = useNavigate();

    const { data: workspaceData, isLoading: isWorkspaceLoading } = useWorkspaceDetail(workspaceId);
    const { data: foldersData, isLoading: isFoldersLoading } = useRootFolders(workspaceId);
    const { data: documentsData, isLoading: isDocumentsLoading } = useRootDocuments(workspaceId);

    const createFolderMutation = useCreateFolder(workspaceId);
    const createDocumentMutation = useCreateDocument(workspaceId);

    const [newFolderName, setNewFolderName] = useState('');
    const [showFolderForm, setShowFolderForm] = useState(false);

    const updateWorkspaceMutation = useUpdateWorkspace(workspaceId);
    const deleteWorkspaceMutation = useDeleteWorkspace();

    const [showSettings, setShowSettings] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const openSettings = () => {
        setEditName(workspace?.name || '');
        setEditDescription(workspace?.description || '');
        setShowSettings(true);
    };

    const handleUpdateWorkspace = (e) => {
        e.preventDefault();
        updateWorkspaceMutation.mutate(
            { name: editName, description: editDescription },
            { onSuccess: () => setShowSettings(false) }
        );
    };

    const handleDeleteWorkspace = () => {
        if (confirm(`Delete "${workspace?.name}"? This cannot be undone.`)) {
            deleteWorkspaceMutation.mutate(workspaceId, {
                onSuccess: () => navigate('/dashboard'),
            });
        }
    };

    const workspace = workspaceData?.data;
    const folders = foldersData?.data || [];
    const documents = documentsData?.data || [];

    const handleCreateFolder = (e) => {
        e.preventDefault();
        createFolderMutation.mutate(
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

    const toggleMenu = (e, folderId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === folderId ? null : folderId);
    };

    const handleDeleteFolder = (e, folder) => {
        e.stopPropagation();
        setOpenMenuId(null);
        if (confirm(`Move "${folder.name}" to trash?`)) {
            deleteFolderMutation.mutate(folder.id);
        }
    };

    const startRename = (e, folder) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setRenamingId(folder.id);
        setRenameValue(folder.name);
    };

    const submitRename = (e, folderId) => {
        e.preventDefault();
        e.stopPropagation();
        renameFolderMutation.mutate(
            { folderId, name: renameValue },
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

    if (isWorkspaceLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', padding: '48px 0' }}>
                <div className="ds-spinner" />
                <span style={{ fontSize: 14 }}>Loading workspace…</span>
            </div>
        );
    }

    return (
        <div>
            {/* ── Workspace Header ────────────────────────────────────────── */}
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                                {workspace?.name}
                            </h1>
                            <button
                                onClick={openSettings}
                                title="Workspace Settings"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface-2)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.borderColor = 'var(--accent)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                            >
                                <Settings size={16} />
                            </button>
                        </div>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5, maxWidth: '640px' }}>
                            {workspace?.description || (
                                <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No description provided for this workspace.</span>
                            )}
                        </p>
                    </div>

                    {/* Quick navigation buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                            to={`/workspaces/${workspaceId}/members`}
                            className="ds-btn ds-btn-ghost"
                            style={{ textDecoration: 'none', gap: '6px', fontSize: '13px' }}
                        >
                            <Users size={15} style={{ color: 'var(--g-blue)' }} />
                            Members
                        </Link>
                        <Link
                            to={`/workspaces/${workspaceId}/activity`}
                            className="ds-btn ds-btn-ghost"
                            style={{ textDecoration: 'none', gap: '6px', fontSize: '13px' }}
                        >
                            <ActivityIcon size={15} style={{ color: 'var(--g-yellow)' }} />
                            Activity
                        </Link>
                        <Link
                            to={`/workspaces/${workspaceId}/trash`}
                            className="ds-btn ds-btn-ghost"
                            style={{ textDecoration: 'none', gap: '6px', fontSize: '13px' }}
                        >
                            <Trash2 size={15} style={{ color: 'var(--g-red)' }} />
                            Trash
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Folders Section ─────────────────────────────────────────── */}
            <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Folders
                        </h2>
                        <span className="ds-badge ds-badge-yellow" style={{ fontSize: '11px', padding: '2px 8px' }}>
                            {folders.length}
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
                        onSubmit={handleCreateFolder}
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
                        <button type="submit" className="ds-btn ds-btn-primary" disabled={createFolderMutation.isPending || !newFolderName.trim()}>
                            {createFolderMutation.isPending ? 'Creating…' : 'Create'}
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

                {isFoldersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
                        <div className="ds-spinner" style={{ width: '16px', height: '16px' }} /> Loading folders…
                    </div>
                ) : folders.length === 0 ? (
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
                        No folders yet. Create folders to organize your documents neatly.
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '12px',
                        }}
                    >
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                onClick={() => renamingId !== folder.id && navigate(`/workspaces/${workspaceId}/folders/${folder.id}`)}
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

                                {renamingId === folder.id ? (
                                    <form
                                        onSubmit={(e) => submitRename(e, folder.id)}
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
                                        {folder.name}
                                    </span>
                                )}

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => toggleMenu(e, folder.id)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: openMenuId === folder.id ? 'var(--surface-3)' : 'transparent',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <MoreVertical size={15} />
                                    </button>

                                    {openMenuId === folder.id && (
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
                                                onClick={(e) => startRename(e, folder)}
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
                                                onClick={(e) => handleDeleteFolder(e, folder)}
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
                        No documents yet in this workspace. Click "+ New Document" to write your first doc.
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

            {/* ── Settings Modal ──────────────────────────────────────────── */}
            <Modal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title="Workspace Settings"
            >
                <form onSubmit={handleUpdateWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="ds-label" htmlFor="ws-settings-name">Workspace Name</label>
                        <input
                            id="ws-settings-name"
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="ds-input"
                        />
                    </div>

                    <div>
                        <label className="ds-label" htmlFor="ws-settings-desc">Description</label>
                        <textarea
                            id="ws-settings-desc"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                            className="ds-input"
                            style={{ resize: 'none', lineHeight: 1.6 }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                        <button
                            type="submit"
                            disabled={updateWorkspaceMutation.isPending || !editName.trim()}
                            className="ds-btn ds-btn-primary"
                            style={{ width: '100%' }}
                        >
                            {updateWorkspaceMutation.isPending ? 'Saving changes…' : 'Save Changes'}
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteWorkspace}
                            className="ds-btn ds-btn-danger"
                            style={{ width: '100%', gap: '6px', marginTop: '8px' }}
                        >
                            <Trash2 size={14} />
                            Delete Workspace Permanently
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default WorkspacePage;