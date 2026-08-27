import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentDetail, useUpdateDocument } from '../useDocument';
import DocumentEditor from '../components/DocumentEditor';
import AttachmentPanel from '../../attachment/components/AttachmentPanel';

function DocumentPage() {
    const { documentId } = useParams();

    const { data, isLoading } = useDocumentDetail(documentId);
    const updateDocumentMutation = useUpdateDocument(documentId);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);
    const [saveStatus, setSaveStatus] = useState('saved');

    const debounceTimer = useRef(null);
    const isFirstLoad = useRef(true);
    // tracks whether the user changed content during this session
    const wasEdited = useRef(false);
    // always holds the latest title/content so the close handler can read them
    const latestTitle = useRef('');
    const latestContent = useRef(null);
    // stable ref to the mutation so effects with [] can still call the latest version
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

    // flushRef always holds the latest flush logic; updated every render.
    // Using a ref means the [] effects below never need it as a dependency,
    // so cleanup only fires on actual unmount / actual visibilitychange.
    const flushRef = useRef(null);
    flushRef.current = () => {
        if (!wasEdited.current) return;
        wasEdited.current = false; // clear first to prevent double-fire
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

    // SPA navigation unmount — fires ONLY when component actually unmounts
    useEffect(() => {
        return () => { flushRef.current?.(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Tab switch / window minimise / browser close — registered once
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
        wasEdited.current = true; // mark that content was actually changed
        scheduleSave(title, newContent);
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
            {/* Title + Save Status */}
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
            </div>

            {/* Editor */}
            <DocumentEditor content={content} onUpdate={handleContentChange} />

            {/* Attachments */}
            <AttachmentPanel documentId={documentId} />
        </div>
    );
}

export default DocumentPage;