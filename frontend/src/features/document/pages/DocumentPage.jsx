import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { History, BookmarkPlus } from 'lucide-react';
import { useDocumentDetail, useUpdateDocument } from '../useDocument';
import { useSaveVersion } from '../useVersion';
import DocumentEditor from '../components/DocumentEditor';
import AttachmentPanel from '../../attachment/components/AttachmentPanel';
import CommentPanel from '../../comment/components/CommentPanel';
import VersionHistoryPanel from '../components/VersionHistoryPanel';

function DocumentPage() {
    const { documentId } = useParams();

    const { data, isLoading } = useDocumentDetail(documentId);
    const updateDocumentMutation = useUpdateDocument(documentId);
    const saveVersionMutation = useSaveVersion(documentId);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);
    const [saveStatus, setSaveStatus] = useState('saved');

    // ── Version History panel visibility
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    // ── Save Version UI state
    // showSaveVersionBox: whether the inline "Save Version" form is open
    const [showSaveVersionBox, setShowSaveVersionBox] = useState(false);
    // description typed by the user (optional)
    const [versionDescription, setVersionDescription] = useState('');
    // feedback shown after a save attempt: null | { type: 'success'|'error', message: string }
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handler = () => {
            if (window.document.visibilityState === 'hidden') {
                flushRef.current?.();
            }
        };
        window.document.addEventListener('visibilitychange', handler);
        return () => window.document.removeEventListener('visibilitychange', handler);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    /**
     * handleSaveVersion
     *
     * Called when the user confirms the Save Version action.
     *
     * Flow:
     * 1. If there is a pending autosave (debounce timer still running),
     *    flush it immediately before creating the version.
     *    Why? The backend creates the version from what's in the database.
     *    If the latest edits haven't been autosaved yet, the version would
     *    not include those edits. Flushing first ensures the DB is current.
     * 2. Call the saveVersionMutation with the description.
     * 3. Show inline success/error feedback.
     * 4. Auto-open the Version History panel so the user can see the new version.
     */
    const handleSaveVersion = () => {
        // Flush any pending autosave before versioning
        if (wasEdited.current || debounceTimer.current) {
            flushRef.current?.();
            // Give autosave ~600ms to land before versioning.
            // The backend creates the version from the current DB state —
            // if autosave hasn't committed yet, the version would miss the last edits.
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
                        message: `✓ Version ${versionNum ?? ''} saved`,
                    });
                    setVersionDescription('');
                    setShowSaveVersionBox(false);
                    // Auto-open history panel so the user sees the new version immediately
                    setShowVersionHistory(true);
                    setTimeout(() => setVersionSaveStatus(null), 4000);
                },
                onError: (error) => {
                    const msg = error?.response?.data?.message || 'Failed to save version.';
                    setVersionSaveStatus({ type: 'error', message: `✕ ${msg}` });
                    setTimeout(() => setVersionSaveStatus(null), 5000);
                },
            }
        );
    };

    const saveBadgeClass = {
        saved: 'save-badge save-badge-saved',
        saving: 'save-badge save-badge-saving',
        unsaved: 'save-badge save-badge-unsaved',
        error: 'save-badge save-badge-error',
    };
    const saveLabel = {
        saved: '✓ Saved',
        saving: '⟳ Saving…',
        unsaved: '● Unsaved',
        error: '✕ Failed',
    };

    if (isLoading || !document) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <div className="ds-spinner" /> Loading document…
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {/* ── Document Header ─────────────────────────────────────────── */}
            <div className="document-header">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    style={{
                        flex: 1,
                        fontSize: '26px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        lineHeight: 1.3,
                    }}
                    placeholder="Untitled Document"
                />
                <span className={saveBadgeClass[saveStatus]}>
                    {saveLabel[saveStatus]}
                </span>

                {/* Save Version button */}
                <button
                    id="save-version-btn"
                    onClick={() => {
                        setShowSaveVersionBox((prev) => !prev);
                        setVersionSaveStatus(null);
                    }}
                    title="Save a named version snapshot"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: showSaveVersionBox ? 'white' : 'var(--text-secondary)',
                        background: showSaveVersionBox ? 'var(--g-blue)' : 'var(--surface-2)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, color 0.2s',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <BookmarkPlus size={13} />
                    Save Version
                </button>

                {/* Version History toggle */}
                <button
                    id="version-history-toggle"
                    onClick={() => setShowVersionHistory((prev) => !prev)}
                    title={showVersionHistory ? 'Hide Version History' : 'View Version History'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: showVersionHistory ? 'var(--g-blue)' : 'var(--text-secondary)',
                        background: showVersionHistory ? 'var(--accent-light)' : 'var(--surface-2)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, color 0.2s',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <History size={13} />
                    History
                </button>
            </div>

            {/* ── Save Version inline form ─────────────────────────────── */}
            {showSaveVersionBox && (
                <div className="save-version-box">
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        Save a snapshot of the document's current state.
                    </p>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label
                            htmlFor="version-description"
                            style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}
                        >
                            Description <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
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
                            placeholder="e.g. Completed intro section"
                            maxLength={500}
                            autoFocus
                            className="ds-input"
                            style={{ fontSize: '13px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            id="save-version-cancel"
                            onClick={() => { setShowSaveVersionBox(false); setVersionDescription(''); }}
                            className="ds-btn ds-btn-ghost"
                            style={{ fontSize: '13px' }}
                        >
                            Cancel
                        </button>
                        <button
                            id="save-version-confirm"
                            onClick={handleSaveVersion}
                            disabled={saveVersionMutation.isPending}
                            className="ds-btn ds-btn-primary"
                            style={{ fontSize: '13px' }}
                        >
                            {saveVersionMutation.isPending ? '⟳ Saving…' : 'Save Version'}
                        </button>
                    </div>
                </div>
            )}

            {/* Version save feedback (shown briefly after save/error) */}
            {versionSaveStatus && (
                <div
                    className={`ds-alert ${versionSaveStatus.type === 'success' ? 'ds-alert-green' : 'ds-alert-red'}`}
                    style={{ marginBottom: '12px', fontSize: '13px' }}
                >
                    {versionSaveStatus.message}
                </div>
            )}

            {/* ── Editor ──────────────────────────────────────────────── */}
            <DocumentEditor content={content} onUpdate={handleContentChange} />

            {/* ── Version History Panel ───────────────────────────────── */}
            {showVersionHistory && (
                <VersionHistoryPanel
                    documentId={documentId}
                    onRestore={handleVersionRestore}
                />
            )}

            {/* ── Attachments + Comments ──────────────────────────────── */}
            <AttachmentPanel documentId={documentId} />
            <CommentPanel documentId={documentId} />
        </div>
    );
}

export default DocumentPage;