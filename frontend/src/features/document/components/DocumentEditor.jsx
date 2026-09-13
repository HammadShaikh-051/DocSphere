import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

function DocumentEditor({ content, onUpdate }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content || '',
        onUpdate: ({ editor }) => {
            onUpdate(editor.getJSON());
        },
    });

    useEffect(() => {
        if (editor && content) {
            const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content);
            if (!isSame) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
        }}>
            <EditorToolbar editor={editor} />
            <EditorContent
                editor={editor}
                style={{
                    padding: '20px 24px',
                    minHeight: '420px',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--surface)',
                    fontSize: '15px',
                    lineHeight: 1.75,
                }}
                className="ds-editor-content"
            />
            <style>{`
                .ds-editor-content .ProseMirror {
                    outline: none;
                    color: var(--text-primary);
                    background-color: var(--surface);
                    min-height: 380px;
                }
                .ds-editor-content .ProseMirror p {
                    margin: 0 0 12px;
                    color: var(--text-primary);
                }
                .ds-editor-content .ProseMirror h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 12px;
                    line-height: 1.3;
                }
                .ds-editor-content .ProseMirror h2 {
                    font-size: 19px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 10px;
                    line-height: 1.3;
                }
                .ds-editor-content .ProseMirror h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0 0 8px;
                }
                .ds-editor-content .ProseMirror ul,
                .ds-editor-content .ProseMirror ol {
                    padding-left: 24px;
                    margin: 0 0 12px;
                    color: var(--text-primary);
                }
                .ds-editor-content .ProseMirror li {
                    margin-bottom: 4px;
                    color: var(--text-primary);
                }
                .ds-editor-content .ProseMirror strong {
                    color: var(--text-primary);
                    font-weight: 700;
                }
                .ds-editor-content .ProseMirror em {
                    color: var(--text-secondary);
                }
                .ds-editor-content .ProseMirror code {
                    background-color: var(--surface-2);
                    color: var(--g-red);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .ds-editor-content .ProseMirror pre {
                    background-color: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 16px;
                    overflow-x: auto;
                    margin: 0 0 14px;
                }
                .ds-editor-content .ProseMirror pre code {
                    background: none;
                    padding: 0;
                    color: var(--g-green);
                    font-size: 13px;
                }
                .ds-editor-content .ProseMirror blockquote {
                    border-left: 3px solid var(--g-blue);
                    padding-left: 14px;
                    color: var(--text-secondary);
                    margin: 0 0 14px;
                    font-style: italic;
                }
                .ds-editor-content .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: var(--text-muted);
                    pointer-events: none;
                    float: left;
                    height: 0;
                }
                .ds-editor-content .ProseMirror hr {
                    border: none;
                    border-top: 1px solid var(--border);
                    margin: 20px 0;
                }
            `}</style>
        </div>
    );
}

export default DocumentEditor;