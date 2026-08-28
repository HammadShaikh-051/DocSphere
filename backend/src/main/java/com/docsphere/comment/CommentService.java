package com.docsphere.comment;

import com.docsphere.comment.dto.CommentDto;
import com.docsphere.comment.dto.CreateCommentRequest;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentDto addComment(UUID documentId, UUID authorId, CreateCommentRequest request);

    List<CommentDto> getDocumentComments(UUID documentId);

    void deleteComment(UUID commentId, UUID requesterId);
}
