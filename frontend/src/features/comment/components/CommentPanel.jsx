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
        <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <MessageSquare size={15} style={{ color: 'var(--text-secondary)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Comments {comments.length > 0 && `(${comments.length})`}
                </h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment…"
                    className="ds-input"
                    style={{ flex: 1 }}
                />
                <button
                    type="submit"
                    disabled={addCommentMutation.isPending || !newComment.trim()}
                    className="ds-btn ds-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Send size={14} />
                    Post
                </button>
            </form>

            {isLoading ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading comments…</p>
            ) : comments.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No comments yet. Start the discussion.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {comments.map((comment) => {
                        const isOwnComment = comment.authorId === currentUser?.id;

                        return (
                            <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'var(--g-blue)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 600, flexShrink: 0,
                                }}>
                                    {getInitials(comment.authorName)}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {comment.authorName}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {formatRelativeTime(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-word' }}>
                                        {comment.content}
                                    </p>
                                </div>

                                {isOwnComment && (
                                    <button
                                        onClick={() => handleDelete(comment)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', flexShrink: 0, height: 'fit-content' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CommentPanel;