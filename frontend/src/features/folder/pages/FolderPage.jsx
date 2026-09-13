import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Folder, FileText, ChevronRight, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useFolderDetail, useSubFolders, useCreateSubFolder, useDeleteFolder, useRenameFolder } from '../useFolder';
import { useFolderDocuments, useCreateDocumentInFolder, useDeleteDocument, useRenameDocument } from '../../document/useDocument';

const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
    padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '13px', color: 'var(--text-primary)', textAlign: 'left',
};

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

    const toggleMenu = (e, folderId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === folderId ? null : folderId);
    };

    const handleDeleteSubFolder = (e, sub) => {
        e.stopPropagation();
        setOpenMenuId(null);
        if (confirm(`Move "${folder.name}" to trash?`)) {
            deleteFolderMutation.mutate(sub.id);
        }
    };

    const startRename = (e, sub) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setRenamingId(sub.id);
        setRenameValue(sub.name);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <div className="ds-spinner" /> Loading folder…
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="breadcrumb" style={{ marginBottom: '20px' }}>
                <Link to={`/workspaces/${workspaceId}`}>Workspace</Link>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{folder?.name}</span>
            </div>

            {/* Folder title */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Folder size={24} style={{ color: 'var(--g-yellow)' }} />
                    <h1 className="page-title">{folder?.name}</h1>
                </div>
                <div style={{
                    marginTop: '12px',
                    height: '2px',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, var(--g-yellow), var(--g-blue))',
                    opacity: 0.4,
                    width: '120px',
                }} />
            </div>

            {/* ── Subfolders ── */}
            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Subfolders
                    </h2>
                    <button
                        onClick={() => setShowFolderForm(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '13px', color: 'var(--g-blue)', fontWeight: 500,
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: 'inherit', padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)', transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Plus size={14} />
                        New Folder
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                    {subFolders.map((sub) => (
                        <div
                            key={sub.id}
                            className="item-card item-card-folder"
                            onClick={() => renamingId !== sub.id && navigate(`/workspaces/${workspaceId}/folders/${sub.id}`)}
                            style={{ position: 'relative' }}
                        >
                            <Folder size={18} style={{ color: 'var(--g-yellow)', flexShrink: 0 }} />

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
                                        style={{ flex: 1, fontSize: '13px', padding: '2px 6px' }}
                                        autoFocus
                                        onBlur={() => setRenamingId(null)}
                                    />
                                </form>
                            ) : (
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                    {sub.name}
                                </span>
                            )}

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={(e) => toggleMenu(e, sub.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', display: 'flex' }}
                                >
                                    <MoreVertical size={14} />
                                </button>

                                {openMenuId === sub.id && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                                            background: 'var(--surface)', border: '1px solid var(--border)',
                                            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            minWidth: '130px', zIndex: 10, overflow: 'hidden',
                                        }}
                                    >
                                        <button onClick={(e) => startRename(e, sub)} style={menuItemStyle}>
                                            <Pencil size={14} />
                                            Rename
                                        </button>
                                        <button onClick={(e) => handleDeleteSubFolder(e, sub)} style={{ ...menuItemStyle, color: '#dc2626' }}>
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {showFolderForm && (
                    <form onSubmit={handleCreateSubFolder} className="inline-form" style={{ marginBottom: '14px' }}>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name…"
                            required
                            className="ds-input"
                            style={{ flex: 1 }}
                            autoFocus
                        />
                        <button type="submit" className="ds-btn ds-btn-primary" disabled={createSubFolderMutation.isPending}>
                            {createSubFolderMutation.isPending ? 'Creating…' : 'Create'}
                        </button>
                        <button type="button" className="ds-btn ds-btn-ghost" onClick={() => { setShowFolderForm(false); setNewFolderName(''); }}>
                            Cancel
                        </button>
                    </form>
                )}
            </section>

            {/* ── Documents ── */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Documents
                    </h2>
                    <button
                        onClick={handleCreateDocument}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '13px', color: 'var(--g-blue)', fontWeight: 500,
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: 'inherit', padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)', transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Plus size={14} />
                        New Document
                    </button>
                </div>

                {isDocumentsLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <div className="ds-spinner" /> Loading…
                    </div>
                ) : documents.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No documents yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="item-card item-card-document"
                                onClick={() => renamingDocId !== document.id && navigate(`/documents/${document.id}`)}
                                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                    <FileText size={17} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
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
                                                style={{ flex: 1, fontSize: '13px', padding: '2px 6px' }}
                                                autoFocus
                                                onBlur={() => setRenamingDocId(null)}
                                            />
                                        </form>
                                    ) : (
                                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {document.title}
                                        </span>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => toggleDocMenu(e, document.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', display: 'flex' }}
                                        title="Document options"
                                    >
                                        <MoreVertical size={14} />
                                    </button>

                                    {openDocMenuId === document.id && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                                                background: 'var(--surface)', border: '1px solid var(--border)',
                                                borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                minWidth: '130px', zIndex: 10, overflow: 'hidden',
                                            }}
                                        >
                                            <button onClick={(e) => startRenameDoc(e, document)} style={menuItemStyle}>
                                                <Pencil size={14} />
                                                Rename
                                            </button>
                                            <button onClick={(e) => handleDeleteDoc(e, document)} style={{ ...menuItemStyle, color: '#dc2626' }}>
                                                <Trash2 size={14} />
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
        </div>
    );
}

export default FolderPage;