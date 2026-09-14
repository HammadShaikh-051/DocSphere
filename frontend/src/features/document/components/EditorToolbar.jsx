import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Quote, Minus } from 'lucide-react';

function ToolbarButton({ icon: Icon, isActive, onClick, title }) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? 'var(--g-blue)' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-3)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }
            }}
        >
            <Icon size={15} />
        </button>
    );
}

function Separator() {
    return (
        <div
            style={{
                width: '1px',
                height: '18px',
                backgroundColor: 'var(--border)',
                margin: '0 4px',
                flexShrink: 0,
            }}
        />
    );
}

function EditorToolbar({ editor }) {
    if (!editor) return null;

    return (
        <div className="doc-editor-canvas-toolbar">
            {/* Text formatting */}
            <ToolbarButton
                icon={Bold}
                title="Bold (Ctrl+B)"
                isActive={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
                icon={Italic}
                title="Italic (Ctrl+I)"
                isActive={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
                icon={Code}
                title="Inline code"
                isActive={editor.isActive('code')}
                onClick={() => editor.chain().focus().toggleCode().run()}
            />

            <Separator />

            {/* Headings */}
            <ToolbarButton
                icon={Heading1}
                title="Heading 1"
                isActive={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            />
            <ToolbarButton
                icon={Heading2}
                title="Heading 2"
                isActive={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />

            <Separator />

            {/* Lists */}
            <ToolbarButton
                icon={List}
                title="Bullet list"
                isActive={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
                icon={ListOrdered}
                title="Numbered list"
                isActive={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
                icon={Quote}
                title="Blockquote"
                isActive={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />

            <Separator />

            {/* Horizontal rule */}
            <ToolbarButton
                icon={Minus}
                title="Divider line"
                isActive={false}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />
        </div>
    );
}

export default EditorToolbar;