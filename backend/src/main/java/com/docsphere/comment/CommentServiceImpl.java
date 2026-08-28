package com.docsphere.comment;

import com.docsphere.comment.dto.CommentDto;
import com.docsphere.comment.dto.CreateCommentRequest;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.document.Document;
import com.docsphere.document.DocumentRepository;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final DocumentRepository documentRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    public CommentDto addComment(UUID documentId, UUID authorId, CreateCommentRequest request) {
        Document document = getDocumentOrThrow(documentId);
        User author = getUserOrThrow(authorId);

        verifyIsMember(document.getWorkspace(), author);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .document(document)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toDto(savedComment);
    }

    @Override
    public List<CommentDto> getDocumentComments(UUID documentId) {
        Document document = getDocumentOrThrow(documentId);

        return commentRepository.findByDocumentOrderByCreatedAtAsc(document).stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, UUID requesterId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        User requester = getUserOrThrow(requesterId);

        boolean isAuthor = comment.getAuthor().getId().equals(requesterId);
        boolean isOwnerOrAdmin = isWorkspaceOwnerOrAdmin(comment.getDocument().getWorkspace(), requester);

        if (!isAuthor && !isOwnerOrAdmin) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private boolean isWorkspaceOwnerOrAdmin(Workspace workspace, User user) {
        return memberRepository.findByWorkspaceAndUser(workspace, user)
                .map(m -> m.getRole().name().equals("OWNER") || m.getRole().name().equals("ADMIN"))
                .orElse(false);
    }

    private void verifyIsMember(Workspace workspace, User user) {
        memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));
    }

    private Document getDocumentOrThrow(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}