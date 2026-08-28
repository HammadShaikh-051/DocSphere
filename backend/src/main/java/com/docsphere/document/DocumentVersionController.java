package com.docsphere.document;

import com.docsphere.common.ApiResponse;
import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.DocumentVersionDto;
import com.docsphere.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class DocumentVersionController {

        private final DocumentVersionService versionService;

        @GetMapping("/api/documents/{documentId}/versions")
        public ResponseEntity<ApiResponse<List<DocumentVersionDto>>> getVersions(
                        @AuthenticationPrincipal CustomUserDetails currentUser,
                        @PathVariable UUID documentId) {
                List<DocumentVersionDto> versions = versionService.getVersions(
                                documentId,
                                currentUser.getUser().getId());
                return ResponseEntity.ok(ApiResponse.success("Versions fetched successfully", versions));
        }

        @GetMapping("/api/documents/{documentId}/versions/{versionId}")
        public ResponseEntity<ApiResponse<DocumentVersionDto>> getVersion(
                        @AuthenticationPrincipal CustomUserDetails currentUser,
                        @PathVariable UUID documentId,
                        @PathVariable UUID versionId) {
                DocumentVersionDto version = versionService.getVersion(
                                documentId,
                                versionId,
                                currentUser.getUser().getId());
                return ResponseEntity.ok(ApiResponse.success("Version fetched successfully", version));
        }

        @PostMapping("/api/documents/{documentId}/versions/{versionId}/restore")
        public ResponseEntity<ApiResponse<DocumentDto>> restoreVersion(
                        @AuthenticationPrincipal CustomUserDetails currentUser,
                        @PathVariable UUID documentId,
                        @PathVariable UUID versionId) {
                DocumentDto updatedDocument = versionService.restoreVersion(
                                documentId,
                                versionId,
                                currentUser.getUser().getId());
                return ResponseEntity.ok(ApiResponse.success("Version restored successfully", updatedDocument));
        }
}
