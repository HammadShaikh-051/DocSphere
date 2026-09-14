import { useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useDocumentComments, useAddComment, useDeleteComment } from '../useComment';
import { useAuthStore } from '../../../store/authStore';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function CommentPanel({ documentId }) {
    const currentUser = useAuthStore((state) => state.user);

    const { data, isLoading } = useDocumentComments(documentId);
    const addCommentMutation = useAddComment(documentId);
    const deleteCommentMutation = useDeleteComment(documentId);

    const [newComment, setNewComment] = useState('');

    const comments = data?.data || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        addCommentMutation.mutate(newComment, {
            onSuccess: () => setNewComment(''),
        });
    };

    const handleDelete = (comment) => {
        if (confirm('Delete this comment?')) {
            deleteCommentMutation.mutate(comment.id);
        }
    };

    return (
        <div
            style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-card)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={16} style={{ color: 'var(--g-blue)' }} />
                    <h3
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                        }}
                    >
                        Discussion
                    </h3>
                    <span className="ds-badge ds-badge-blue" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {comments.length}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment or note for the team…"
                    className="ds-input"
                    style={{ flex: 1, padding: '9px 14px', fontSize: '13.5px' }}
                />
                <button
                    type="submit"
                    disabled={addCommentMutation.isPending || !newComment.trim()}
                    className="ds-btn ds-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 16px' }}
                >
                    <Send size={14} />
                    Post
                </button>
            </form>

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '16px 0' }}>
                    <div className="ds-spinner" style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '13px' }}>Loading comments…</span>
                </div>
            ) : comments.length === 0 ? (
                <div
                    style={{
                        padding: '24px 20px',
                        backgroundColor: 'var(--surface-2)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>No comments yet.</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Start the conversation by typing your feedback above.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {comments.map((comment) => {
                        const isOwnComment = comment.authorId === currentUser?.id;

                        return (
                            <div
                                key={comment.id}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    background: 'var(--surface-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'border-color 0.15s ease',
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isOwnComment ? 'var(--g-blue)' : 'var(--surface-3)',
                                        color: isOwnComment ? '#fff' : 'var(--text-primary)',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}
                                >
                                    {getInitials(comment.authorName)}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {comment.authorName}
                                            </span>
                                            {isOwnComment && (
                                                <span className="ds-badge ds-badge-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                                    You
                                                </span>
                                            )}
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {formatRelativeTime(comment.createdAt)}
                                            </span>
                                        </div>

                                        {isOwnComment && (
                                            <button
                                                onClick={() => handleDelete(comment)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)',
                                                    padding: '4px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                title="Delete comment"
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = 'var(--g-red)';
                                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'var(--text-muted)';
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: '13.5px',
                                            color: 'var(--text-primary)',
                                            marginTop: '6px',
                                            wordBreak: 'break-word',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CommentPanel;