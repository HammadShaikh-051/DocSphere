package com.docsphere.document;

import com.docsphere.common.ApiResponse;
import com.docsphere.document.dto.CreateDocumentRequest;
import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.UpdateDocumentRequest;
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
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/api/workspaces/{workspaceId}/documents")
    public ResponseEntity<ApiResponse<DocumentDto>> createDocument(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateDocumentRequest request
    ) {
        DocumentDto document = documentService.createDocument(
                workspaceId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Document created successfully", document));
    }

    @GetMapping("/api/workspaces/{workspaceId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getWorkspaceDocuments(
            @PathVariable UUID workspaceId
    ) {
        List<DocumentDto> documents = documentService.getWorkspaceDocuments(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
    }

    @GetMapping("/api/workspaces/{workspaceId}/documents/root")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getRootDocuments(
            @PathVariable UUID workspaceId
    ) {
        List<DocumentDto> documents = documentService.getRootDocuments(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Root documents fetched successfully", documents));
    }

    @GetMapping("/api/folders/{folderId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getFolderDocuments(
            @PathVariable UUID folderId
    ) {
        List<DocumentDto> documents = documentService.getFolderDocuments(folderId);
        return ResponseEntity.ok(ApiResponse.success("Folder documents fetched successfully", documents));
    }

    @GetMapping("/api/documents/{documentId}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocument(
            @PathVariable UUID documentId
    ) {
        DocumentDto document = documentService.getDocumentById(documentId);
        return ResponseEntity.ok(ApiResponse.success("Document fetched successfully", document));
    }

    @PutMapping("/api/documents/{documentId}")
    public ResponseEntity<ApiResponse<DocumentDto>> updateDocument(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID documentId,
            @Valid @RequestBody UpdateDocumentRequest request
    ) {
        DocumentDto updatedDocument = documentService.updateDocument(
                documentId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Document updated successfully", updatedDocument));
    }

    @DeleteMapping("/api/documents/{documentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID documentId
    ) {
        documentService.deleteDocument(documentId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully"));
    }
}