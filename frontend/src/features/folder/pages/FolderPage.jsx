import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Folder, FileText, ChevronRight } from 'lucide-react';
import { useFolderDetail, useSubFolders, useCreateSubFolder } from '../useFolder';
import { useFolderDocuments, useCreateDocumentInFolder } from '../../document/useDocument';

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

                {isSubFoldersLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        <div className="ds-spinner" /> Loading…
                    </div>
                ) : subFolders.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No subfolders yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                        {subFolders.map((sub) => (
                            <div
                                key={sub.id}
                                className="item-card item-card-folder"
                                onClick={() => navigate(`/workspaces/${workspaceId}/folders/${sub.id}`)}
                            >
                                <Folder size={18} style={{ color: 'var(--g-yellow)', flexShrink: 0 }} />
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {sub.name}
                                </span>
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
                                onClick={() => navigate(`/documents/${document.id}`)}
                            >
                                <FileText size={17} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {document.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default FolderPage;