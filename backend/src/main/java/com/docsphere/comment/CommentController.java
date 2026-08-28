package com.docsphere.comment;

import com.docsphere.comment.dto.CommentDto;
import com.docsphere.comment.dto.CreateCommentRequest;
import com.docsphere.common.ApiResponse;
import com.docsphere.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/documents/{documentId}/comments")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID documentId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        CommentDto comment = commentService.addComment(documentId, currentUser.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", comment));
    }

    @GetMapping("/api/documents/{documentId}/comments")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(
            @PathVariable UUID documentId
    ) {
        List<CommentDto> comments = commentService.getDocumentComments(documentId);
        return ResponseEntity.ok(ApiResponse.success("Comments fetched successfully", comments));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID commentId
    ) {
        commentService.deleteComment(commentId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully"));
    }
}