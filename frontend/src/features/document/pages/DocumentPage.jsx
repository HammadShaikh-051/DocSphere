import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentDetail, useUpdateDocument } from '../useDocument';
import DocumentEditor from '../components/DocumentEditor';

function DocumentPage() {
    const { documentId } = useParams();

    const { data, isLoading } = useDocumentDetail(documentId);
    const updateDocumentMutation = useUpdateDocument(documentId);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);
    const [saveStatus, setSaveStatus] = useState('saved');

    const debounceTimer = useRef(null);
    const isFirstLoad = useRef(true);

    const document = data?.data;

    useEffect(() => {
        if (document && isFirstLoad.current) {
            setTitle(document.title);
            setContent(document.content);
            isFirstLoad.current = false;
        }
    }, [document]);

    const saveDocument = (newTitle, newContent) => {
        setSaveStatus('saving');
        updateDocumentMutation.mutate(
            { title: newTitle, content: newContent },
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
        scheduleSave(newTitle, content);
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
        scheduleSave(title, newContent);
    };

    const saveBadgeClass = {
        saved:   'save-badge save-badge-saved',
        saving:  'save-badge save-badge-saving',
        unsaved: 'save-badge save-badge-unsaved',
        error:   'save-badge save-badge-error',
    };
    const saveLabel = {
        saved:   '✓ Saved',
        saving:  '⟳ Saving…',
        unsaved: '● Unsaved',
        error:   '✕ Failed',
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
        </div>
    );
}

export default DocumentPage;