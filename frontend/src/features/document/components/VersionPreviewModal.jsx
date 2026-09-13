import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { useDocumentVersion } from '../useVersion';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

function VersionPreviewModal({ isOpen, onClose, documentId, versionId }) {

    const { data, isLoading } = useDocumentVersion(documentId, versionId);
    const version = data?.data;

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editable: false,
    });

    useEffect(() => {
        if (editor && version?.content) {
            const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(version.content);
            if (!isSame) {
                editor.commands.setContent(version.content);
            }
        }
    }, [version?.content, editor]);

    useEffect(() => {
        if (!isOpen && editor) {
            editor.commands.setContent('');
        }
    }, [isOpen, editor]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={version ? `Version ${version.versionNumber} — Preview` : 'Version Preview'}
        >
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    <div className="ds-spinner" />
                    Loading version…
                </div>
            ) : version ? (
                <div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginBottom: '16px',
                        padding: '12px',
                        backgroundColor: 'var(--surface-2)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                    }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>Version</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                #{version.versionNumber}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>Edited by</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                {version.createdByName}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>Saved</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {formatRelativeTime(version.createdAt)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', minWidth: '70px' }}>Title</span>
                            <span style={{ color: 'var(--text-primary)' }}>{version.title}</span>
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface)',
                        maxHeight: '320px',
                        overflowY: 'auto',
                        padding: '16px 20px',
                    }}>
                        {version.content ? (
                            <EditorContent
                                editor={editor}
                                style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                }}
                                className="ds-editor-content"
                            />
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                This version has no content.
                            </p>
                        )}
                    </div>

                    <p style={{
                        marginTop: '12px',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                    }}>
                        This is a read-only preview. Click Restore in the history panel to apply this version.
                    </p>
                </div>
            ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Version not found.</p>
            )}
        </Modal>
    );
}

export default VersionPreviewModal;
