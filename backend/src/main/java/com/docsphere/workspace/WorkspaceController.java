package com.docsphere.workspace;

import com.docsphere.common.ApiResponse;
import com.docsphere.user.CustomUserDetails;
import com.docsphere.workspace.dto.CreateWorkspaceRequest;
import com.docsphere.workspace.dto.UpdateWorkspaceRequest;
import com.docsphere.workspace.dto.WorkspaceDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceDto>> createWorkspace(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody CreateWorkspaceRequest request
    ) {
        WorkspaceDto workspace = workspaceService.createWorkspace(
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Workspace created successfully", workspace));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceDto>>> getMyWorkspaces(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<WorkspaceDto> workspaces = workspaceService.getUserWorkspaces(currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Workspaces fetched successfully", workspaces));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<WorkspaceDto>> getWorkspace(
            @PathVariable UUID workspaceId
    ) {
        WorkspaceDto workspace = workspaceService.getWorkspaceById(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace fetched successfully", workspace));
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<WorkspaceDto>> updateWorkspace(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody UpdateWorkspaceRequest request
    ) {
        WorkspaceDto updatedWorkspace = workspaceService.updateWorkspace(
                workspaceId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Workspace updated successfully", updatedWorkspace));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkspace(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId
    ) {
        workspaceService.deleteWorkspace(workspaceId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Workspace deleted successfully"));
    }
}