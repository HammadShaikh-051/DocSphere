package com.docsphere.folder;

import com.docsphere.common.ApiResponse;
import com.docsphere.folder.dto.CreateFolderRequest;
import com.docsphere.folder.dto.FolderDto;
import com.docsphere.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @PostMapping("/api/workspaces/{workspaceId}/folders")
    public ResponseEntity<ApiResponse<FolderDto>> createFolder(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateFolderRequest request
    ) {
        FolderDto folder = folderService.createFolder(
                workspaceId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Folder created successfully", folder));
    }

    @GetMapping("/api/workspaces/{workspaceId}/folders/root")
    public ResponseEntity<ApiResponse<List<FolderDto>>> getRootFolders(
            @PathVariable UUID workspaceId
    ) {
        List<FolderDto> folders = folderService.getRootFolders(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Root folders fetched successfully", folders));
    }

    @GetMapping("/api/folders/{folderId}")
    public ResponseEntity<ApiResponse<FolderDto>> getFolder(
            @PathVariable UUID folderId
    ) {
        FolderDto folder = folderService.getFolderById(folderId);
        return ResponseEntity.ok(ApiResponse.success("Folder fetched successfully", folder));
    }

    @GetMapping("/api/folders/{folderId}/subfolders")
    public ResponseEntity<ApiResponse<List<FolderDto>>> getSubFolders(
            @PathVariable UUID folderId
    ) {
        List<FolderDto> folders = folderService.getSubFolders(folderId);
        return ResponseEntity.ok(ApiResponse.success("Subfolders fetched successfully", folders));
    }

    @PutMapping("/api/folders/{folderId}")
    public ResponseEntity<ApiResponse<FolderDto>> renameFolder(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID folderId,
            @RequestBody Map<String, String> body
    ) {
        FolderDto updatedFolder = folderService.renameFolder(
                folderId,
                currentUser.getUser().getId(),
                body.get("name")
        );
        return ResponseEntity.ok(ApiResponse.success("Folder renamed successfully", updatedFolder));
    }

    @DeleteMapping("/api/folders/{folderId}")
    public ResponseEntity<ApiResponse<Void>> deleteFolder(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID folderId
    ) {
        folderService.deleteFolder(folderId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Folder deleted successfully"));
    }
}