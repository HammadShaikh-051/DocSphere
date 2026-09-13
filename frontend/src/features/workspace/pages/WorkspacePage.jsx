import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Folder, FileText, Users, Settings, Trash2, MoreVertical, Pencil } from 'lucide-react';
import { useWorkspaceDetail, useUpdateWorkspace, useDeleteWorkspace } from '../useWorkspace';
import { useRootFolders, useCreateFolder, useDeleteFolder, useRenameFolder } from '../../folder/useFolder';
import { useRootDocuments, useCreateDocument, useDeleteDocument, useRenameDocument } from '../../document/useDocument';
import Modal from '../../../components/ui/Modal';
import { Activity as ActivityIcon } from 'lucide-react';

const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
    padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '13px', color: 'var(--text-primary)', textAlign: 'left',
};

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
            console.log('About to delete folder:', folder.id);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <div className="ds-spinner" /> Loading workspace…
            </div>
        );
    }

    return (
        <div>
            {/* Workspace Header */}
            <div style={{ marginBottom: '28px' }}>
                <div className="workspace-header">
                    {/* <div>
                        <h1 className="page-title">{workspace?.name}</h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {workspace?.description || 'No description'}
                        </p>
                    </div> */}
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{workspace?.name}</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {workspace?.description || 'No description'}
                            </p>
                        </div>

                        <button
                            onClick={openSettings}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                    <Link
                        to={`/workspaces/${workspaceId}/members`}
                        className="ds-btn ds-btn-ghost"
                        style={{ textDecoration: 'none', gap: '6px' }}
                    >
                        <Users size={15} />
                        Manage Members
                    </Link>
                    <Link to={`/workspaces/${workspaceId}/trash`} className="ds-btn ds-btn-ghost" style={{ textDecoration: 'none', gap: '6px' }}>
                        <Trash2 size={15} />
                        Trash
                    </Link>
                    <Link to={`/workspaces/${workspaceId}/activity`} className="ds-btn ds-btn-ghost" style={{ textDecoration: 'none', gap: '6px' }}>
                        <ActivityIcon size={15} />
                        Activity
                    </Link>
                </div>
                {/* Google color accent line */}
                <div style={{
                    marginTop: '14px',
                    height: '2px',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, var(--g-blue), var(--g-red), var(--g-yellow), var(--g-green))',
                    opacity: 0.4,
                }} />
            </div>

            {/* ── Folders ── */}
            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Folders
                    </h2>
                    <button
                        onClick={() => setShowFolderForm(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: 'var(--g-blue)',
                            fontWeight: 500,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Plus size={14} />
                        New Folder
                    </button>
                </div>

                {showFolderForm && (
                    <form
                        onSubmit={handleCreateFolder}
                        className="inline-form"
                        style={{ marginBottom: '14px' }}
                    >
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
                        <button type="submit" className="ds-btn ds-btn-primary" disabled={createFolderMutation.isPending}>
                            {createFolderMutation.isPending ? 'Creating…' : 'Create'}
                        </button>
                        <button type="button" className="ds-btn ds-btn-ghost" onClick={() => { setShowFolderForm(false); setNewFolderName(''); }}>
                            Cancel
                        </button>
                    </form>
                )}

                {isFoldersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <div className="ds-spinner" /> Loading folders…
                    </div>
                ) : folders.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No folders yet. Create one to organize your documents.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="item-card item-card-folder"
                                onClick={() => renamingId !== folder.id && navigate(`/workspaces/${workspaceId}/folders/${folder.id}`)}
                                style={{ position: 'relative' }}
                            >
                                <Folder size={18} style={{ color: 'var(--g-yellow)', flexShrink: 0 }} />

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
                                            style={{ flex: 1, fontSize: '13px', padding: '2px 6px' }}
                                            autoFocus
                                            onBlur={() => setRenamingId(null)}
                                        />
                                    </form>
                                ) : (
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                        {folder.name}
                                    </span>
                                )}

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => toggleMenu(e, folder.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', display: 'flex' }}
                                    >
                                        <MoreVertical size={14} />
                                    </button>

                                    {openMenuId === folder.id && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                                                background: 'var(--surface)', border: '1px solid var(--border)',
                                                borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                minWidth: '130px', zIndex: 10, overflow: 'hidden',
                                            }}
                                        >
                                            <button onClick={(e) => startRename(e, folder)} style={menuItemStyle}>
                                                <Pencil size={14} />
                                                Rename
                                            </button>
                                            <button onClick={(e) => handleDeleteFolder(e, folder)} style={{ ...menuItemStyle, color: '#dc2626' }}>
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

            {/* ── Documents ── */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Documents
                    </h2>
                    <button
                        onClick={handleCreateDocument}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: 'var(--g-blue)',
                            fontWeight: 500,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background-color 0.15s',
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
                        <div className="ds-spinner" /> Loading documents…
                    </div>
                ) : documents.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No documents yet. Create your first document.</p>
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

            <Modal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title="Workspace settings"
            >
                <form onSubmit={handleUpdateWorkspace} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={updateWorkspaceMutation.isPending}
                        className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updateWorkspaceMutation.isPending ? 'Saving...' : 'Save changes'}
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteWorkspace}
                        className="w-full flex items-center justify-center gap-2 text-red-600 border border-red-200 py-2 rounded-md text-sm hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                        Delete workspace
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default WorkspacePage;