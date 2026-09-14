import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

function DocumentEditor({ content, onUpdate, onStatsChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content || '',
        onUpdate: ({ editor }) => {
            onUpdate(editor.getJSON());
            if (onStatsChange) {
                const text = editor.getText();
                const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                const chars = text.length;
                onStatsChange({ words, chars });
            }
        },
    });

    useEffect(() => {
        if (editor && content) {
            const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content);
            if (!isSame) {
                editor.commands.setContent(content);
            }
            if (onStatsChange) {
                const text = editor.getText();
                const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                const chars = text.length;
                onStatsChange({ words, chars });
            }
        }
    }, [content, editor]);

    return (
        <div style={{ position: 'relative' }}>
            <EditorToolbar editor={editor} />
            <div className="doc-editor-prose">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default DocumentEditor;