import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { useDocumentVersion } from '../useVersion';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';
import { User, Calendar, FileText } from 'lucide-react';

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
            title={version ? `Version ${version.versionNumber} Snapshot` : 'Version Preview'}
        >
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '24px 0' }}>
                    <div className="ds-spinner" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px' }}>Loading version details…</span>
                </div>
            ) : version ? (
                <div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '14px 16px',
                            backgroundColor: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '12.5px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={14} style={{ color: 'var(--g-blue)' }} />
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Author</div>
                                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{version.createdByName}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} style={{ color: 'var(--g-yellow)' }} />
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Snapshot Created</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{formatRelativeTime(version.createdAt)}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={14} style={{ color: 'var(--g-green)' }} />
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Title at Snapshot</div>
                                <div style={{ color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {version.title}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--surface-1)',
                            maxHeight: '380px',
                            overflowY: 'auto',
                            padding: '18px 24px',
                        }}
                    >
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
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                                This version has no content recorded.
                            </p>
                        )}
                    </div>

                    <p
                        style={{
                            marginTop: '14px',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                        }}
                    >
                        This is a read-only preview. To restore your document to this state, use the Restore button in the History panel.
                    </p>
                </div>
            ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Version not found.</p>
            )}
        </Modal>
    );
}

export default VersionPreviewModal;
