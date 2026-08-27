package com.docsphere.attachment;

import com.docsphere.attachment.dto.AttachmentDto;
import com.docsphere.common.ApiResponse;
import com.docsphere.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AttachmentController {
    private final AttachmentService attachmentService;

    @PostMapping("/api/documents/{documentId}/attachments")
    public ResponseEntity<ApiResponse<AttachmentDto>> uploadAttachment(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID documentId,
            @RequestParam("file")MultipartFile file
            ) {
        AttachmentDto attachment = attachmentService.uploadAttachment(
                documentId,
                currentUser.getUser().getId(),
                file
        );
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", attachment));
    }

    @GetMapping("/api/documents/{documentId}/attachments")
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> getAttachments(
            @PathVariable UUID documentId
    ) {
        List<AttachmentDto> attachments = attachmentService.getDocumentAttachments(documentId);
        return ResponseEntity.ok(ApiResponse.success("Attachments fetched successfully", attachments));
    }

    @DeleteMapping("/api/attachments/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID attachmentId
    ) {
        attachmentService.deleteAttachment(attachmentId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Attachment deleted successfully"));
    }
}
