import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    History,
    BookmarkPlus,
    Check,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    FileText,
    Sun,
    Moon,
    MessageSquare,
    Paperclip,
    Clock,
    X,
    Calendar,
} from 'lucide-react';
import { useDocumentDetail, useUpdateDocument } from '../useDocument';
import { useSaveVersion } from '../useVersion';
import { useTheme } from '../../../context/ThemeContext';
import DocumentEditor from '../components/DocumentEditor';
import AttachmentPanel from '../../attachment/components/AttachmentPanel';
import CommentPanel from '../../comment/components/CommentPanel';
import VersionHistoryPanel from '../components/VersionHistoryPanel';
import Modal from '../../../components/ui/Modal';

function DocumentPage() {
    const { documentId } = useParams();
    const { theme, toggleTheme } = useTheme();

    const { data, isLoading } = useDocumentDetail(documentId);
    const updateDocumentMutation = useUpdateDocument(documentId);
    const saveVersionMutation = useSaveVersion(documentId);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);
    const [saveStatus, setSaveStatus] = useState('saved');
    const [stats, setStats] = useState({ words: 0, chars: 0 });

    // ── Version History panel visibility
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    // ── Save Version UI state
    const [showSaveVersionBox, setShowSaveVersionBox] = useState(false);
    const [versionDescription, setVersionDescription] = useState('');
    const [versionSaveStatus, setVersionSaveStatus] = useState(null);

    const debounceTimer = useRef(null);
    const isFirstLoad = useRef(true);
    const wasEdited = useRef(false);
    const latestTitle = useRef('');
    const latestContent = useRef(null);
    const mutationRef = useRef(null);
    mutationRef.current = updateDocumentMutation;

    const document = data?.data;

    useEffect(() => {
        if (document && isFirstLoad.current) {
            setTitle(document.title);
            setContent(document.content);
            latestTitle.current = document.title;
            latestContent.current = document.content;
            isFirstLoad.current = false;
        }
    }, [document]);

    const flushRef = useRef(null);
    flushRef.current = () => {
        if (!wasEdited.current) return;
        wasEdited.current = false;
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        mutationRef.current.mutate(
            { title: latestTitle.current, content: latestContent.current, logEdit: true },
            {
                onSuccess: () => setSaveStatus('saved'),
                onError: () => setSaveStatus('error'),
            }
        );
    };

    useEffect(() => {
        return () => { flushRef.current?.(); };
    }, []);

    useEffect(() => {
        const handler = () => {
            if (window.document.visibilityState === 'hidden') {
                flushRef.current?.();
            }
        };
        window.document.addEventListener('visibilitychange', handler);
        return () => window.document.removeEventListener('visibilitychange', handler);
    }, []);

    const saveDocument = (newTitle, newContent, opts = {}) => {
        setSaveStatus('saving');
        updateDocumentMutation.mutate(
            { title: newTitle, content: newContent, ...(opts.logEdit ? { logEdit: true } : {}) },
            {
                onSuccess: () => setSaveStatus('saved'),
                onError: () => setSaveStatus('error'),
            }
        );
    };

    const scheduleSave = (newTitle, newContent) => {
        setSaveStatus('unsaved');
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            saveDocument(newTitle, newContent);
        }, 1000);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        latestTitle.current = newTitle;
        scheduleSave(newTitle, content);
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
        latestContent.current = newContent;
        wasEdited.current = true;
        scheduleSave(title, newContent);
    };

    const handleVersionRestore = (updatedDoc) => {
        if (!updatedDoc) return;

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        wasEdited.current = false;

        setTitle(updatedDoc.title);
        setContent(updatedDoc.content);
        latestTitle.current = updatedDoc.title;
        latestContent.current = updatedDoc.content;
        setSaveStatus('saved');
    };

    const handleSaveVersion = () => {
        if (wasEdited.current || debounceTimer.current) {
            flushRef.current?.();
            setTimeout(() => doSaveVersion(), 650);
        } else {
            doSaveVersion();
        }
    };

    const doSaveVersion = () => {
        const desc = versionDescription.trim() || undefined;

        saveVersionMutation.mutate(
            { description: desc },
            {
                onSuccess: (responseData) => {
                    const versionNum = responseData?.data?.versionNumber;
                    setVersionSaveStatus({
                        type: 'success',
                        message: `✓ Version ${versionNum ?? ''} snapshot saved`,
                    });
                    setVersionDescription('');
                    setShowSaveVersionBox(false);
                    setShowVersionHistory(true);
                    setTimeout(() => setVersionSaveStatus(null), 4000);
                },
                onError: (error) => {
                    const msg = error?.response?.data?.message || 'Failed to save version snapshot.';
                    setVersionSaveStatus({ type: 'error', message: `✕ ${msg}` });
                    setTimeout(() => setVersionSaveStatus(null), 5000);
                },
            }
        );
    };

    const scrollToSection = (id) => {
        const el = window.document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading || !document) {
        return (
            <div className="doc-editor-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                    <div className="ds-spinner" style={{ width: 24, height: 24 }} />
                    <span style={{ fontSize: 14 }}>Opening document in workspace…</span>
                </div>
            </div>
        );
    }

    const backUrl = document?.folderId && document?.workspaceId
        ? `/workspaces/${document.workspaceId}/folders/${document.folderId}`
        : document?.workspaceId
        ? `/workspaces/${document.workspaceId}`
        : '/workspaces';

    const formattedDate = document?.updatedAt
        ? new Date(document.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <div className="doc-editor-shell">
            {/* ── 1. DEDICATED FULLSCREEN TOPBAR ─────────────────────────────── */}
            <header className="doc-editor-header">
                {/* Left: Back Link & Document Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <Link
                        to={backUrl}
                        className="ds-btn ds-btn-ghost"
                        style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            gap: '6px',
                            color: 'var(--text-primary)',
                            flexShrink: 0,
                        }}
                        title="Back to workspace"
                        id="editor-back-btn"
                    >
                        <ArrowLeft size={15} />
                        <span style={{ fontWeight: 500 }} className="editor-back-text">
                            {document.workspaceName || 'Workspace'}
                        </span>
                    </Link>

                    <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            minWidth: 0,
                        }}
                    >
                        <FileText size={14} style={{ color: 'var(--g-blue)', flexShrink: 0 }} />
                        <span
                            style={{
                                maxWidth: '240px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                            }}
                        >
                            {title || 'Untitled Document'}
                        </span>
                    </div>
                </div>

                {/* Right: Autosave Status, Snapshot, History, Comments, Theme */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {/* Live Autosave Indicator Pill */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            background:
                                saveStatus === 'saved'
                                    ? 'rgba(16, 185, 129, 0.12)'
                                    : saveStatus === 'saving'
                                    ? 'rgba(59, 130, 246, 0.12)'
                                    : saveStatus === 'unsaved'
                                    ? 'rgba(245, 158, 11, 0.14)'
                                    : 'rgba(239, 68, 68, 0.12)',
                            border: `1px solid ${
                                saveStatus === 'saved'
                                    ? 'rgba(16, 185, 129, 0.25)'
                                    : saveStatus === 'saving'
                                    ? 'rgba(59, 130, 246, 0.25)'
                                    : saveStatus === 'unsaved'
                                    ? 'rgba(245, 158, 11, 0.3)'
                                    : 'rgba(239, 68, 68, 0.25)'
                            }`,
                            fontSize: '12px',
                            fontWeight: 500,
                            color:
                                saveStatus === 'saved'
                                    ? 'var(--g-green)'
                                    : saveStatus === 'saving'
                                    ? 'var(--g-blue)'
                                    : saveStatus === 'unsaved'
                                    ? 'var(--g-yellow)'
                                    : 'var(--g-red)',
                        }}
                    >
                        {saveStatus === 'saved' && <Check size={12} />}
                        {saveStatus === 'saving' && <RefreshCw size={12} className="ds-spinner" style={{ border: 'none' }} />}
                        {saveStatus === 'unsaved' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--g-yellow)' }} />}
                        {saveStatus === 'error' && <AlertCircle size={12} />}
                        <span className="editor-status-label" style={{ textTransform: 'capitalize' }}>
                            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving…' : saveStatus === 'unsaved' ? 'Unsaved' : 'Save failed'}
                        </span>
                    </div>

                    {/* Snapshot Button */}
                    <button
                        id="save-version-btn"
                        onClick={() => {
                            setShowSaveVersionBox(true);
                            setVersionSaveStatus(null);
                        }}
                        title="Save a named version snapshot"
                        className="ds-btn ds-btn-ghost"
                        style={{ fontSize: '12.5px', padding: '6px 10px', gap: '6px' }}
                    >
                        <BookmarkPlus size={14} />
                        <span className="editor-btn-text">Save Version</span>
                    </button>

                    {/* Version History Button */}
                    <button
                        id="version-history-toggle"
                        onClick={() => setShowVersionHistory((prev) => !prev)}
                        title={showVersionHistory ? 'Hide Version History' : 'View Version History'}
                        className={`ds-btn ${showVersionHistory ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
                        style={{
                            fontSize: '12.5px',
                            padding: '6px 10px',
                            gap: '6px',
                        }}
                    >
                        <History size={14} />
                        <span className="editor-btn-text">History</span>
                    </button>

                    {/* Quick Jump to Comments */}
                    <button
                        onClick={() => scrollToSection('editor-comments-section')}
                        title="Jump to Comments"
                        className="ds-btn ds-btn-ghost"
                        style={{ padding: '6px 9px', fontSize: '12.5px' }}
                    >
                        <MessageSquare size={14} />
                    </button>

                    {/* Quick Jump to Attachments */}
                    <button
                        onClick={() => scrollToSection('editor-attachments-section')}
                        title="Jump to Attachments"
                        className="ds-btn ds-btn-ghost"
                        style={{ padding: '6px 9px', fontSize: '12.5px' }}
                    >
                        <Paperclip size={14} />
                    </button>

                    {/* Theme Toggle in Editor */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        className="theme-toggle"
                        style={{ width: '32px', height: '32px' }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    </button>
                </div>
            </header>

            {/* Version Save Toast Notification */}
            {versionSaveStatus && (
                <div
                    style={{
                        position: 'fixed',
                        top: '68px',
                        right: '24px',
                        zIndex: 60,
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: versionSaveStatus.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-lg)',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backdropFilter: 'blur(8px)',
                        animation: 'slideDown 0.2s ease',
                    }}
                >
                    {versionSaveStatus.message}
                </div>
            )}

            {/* ── 2. SAVE VERSION SNAPSHOT MODAL ────────────────────────────── */}
            <Modal
                isOpen={showSaveVersionBox}
                onClose={() => {
                    setShowSaveVersionBox(false);
                    setVersionDescription('');
                }}
                title="Create Version Snapshot"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        Save a named checkpoint of this document. You can preview and restore back to this snapshot at any time.
                    </p>

                    <div className="form-group">
                        <label className="ds-label" htmlFor="version-description" style={{ fontSize: '12.5px' }}>
                            Snapshot Description <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                        </label>
                        <input
                            id="version-description"
                            type="text"
                            value={versionDescription}
                            onChange={(e) => setVersionDescription(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveVersion();
                                if (e.key === 'Escape') setShowSaveVersionBox(false);
                            }}
                            placeholder="e.g. Completed section 2 and added API specifications"
                            maxLength={500}
                            autoFocus
                            className="ds-input"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowSaveVersionBox(false);
                                setVersionDescription('');
                            }}
                            className="ds-btn ds-btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveVersion}
                            disabled={saveVersionMutation.isPending}
                            className="ds-btn ds-btn-primary"
                        >
                            {saveVersionMutation.isPending ? 'Saving…' : 'Save Version Snapshot'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ── 3. WORKSPACE AREA & CENTRED DOCUMENT CANVAS ────────────────── */}
            <main className="doc-editor-workspace">
                <article className="doc-editor-canvas">
                    {/* Top Canvas Header: Document Title & Metadata */}
                    <div className="doc-editor-canvas-header">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="doc-editor-canvas-title"
                            placeholder="Untitled Document"
                            aria-label="Document Title"
                        />

                        {/* Metadata line: Word count, characters, timestamp */}
                        <div className="doc-editor-meta">
                            <span className="doc-editor-meta-item">
                                <FileText size={12} style={{ color: 'var(--g-blue)' }} />
                                {stats.words} {stats.words === 1 ? 'word' : 'words'}
                            </span>
                            <span className="doc-editor-meta-item">
                                {stats.chars} characters
                            </span>
                            {formattedDate && (
                                <span className="doc-editor-meta-item">
                                    <Clock size={12} />
                                    Updated {formattedDate}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Integrated Rich Text Editor (Toolbar + ProseMirror) */}
                    <DocumentEditor
                        content={content}
                        onUpdate={handleContentChange}
                        onStatsChange={setStats}
                    />
                </article>

                {/* ── 4. LOWER SECTIONS: VERSION HISTORY, ATTACHMENTS & COMMENTS ── */}
                <div className="doc-editor-bottom-section">
                    {/* Version History Drawer/Section */}
                    {showVersionHistory && (
                        <div
                            style={{
                                background: 'var(--doc-canvas-bg)',
                                border: '1px solid var(--doc-canvas-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '24px',
                                boxShadow: 'var(--doc-canvas-shadow)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <History size={18} style={{ color: 'var(--g-blue)' }} />
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--doc-prose-heading)' }}>
                                        Version History
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowVersionHistory(false)}
                                    className="ds-btn ds-btn-ghost"
                                    style={{ padding: '4px 8px' }}
                                    title="Close version history"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                            <VersionHistoryPanel
                                documentId={documentId}
                                onRestore={handleVersionRestore}
                            />
                        </div>
                    )}

                    {/* Attachments Section */}
                    <div
                        id="editor-attachments-section"
                        style={{
                            background: 'var(--doc-canvas-bg)',
                            border: '1px solid var(--doc-canvas-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            boxShadow: 'var(--doc-canvas-shadow)',
                        }}
                    >
                        <AttachmentPanel documentId={documentId} />
                    </div>

                    {/* Comments & Discussion Section */}
                    <div
                        id="editor-comments-section"
                        style={{
                            background: 'var(--doc-canvas-bg)',
                            border: '1px solid var(--doc-canvas-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            boxShadow: 'var(--doc-canvas-shadow)',
                        }}
                    >
                        <CommentPanel documentId={documentId} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DocumentPage;