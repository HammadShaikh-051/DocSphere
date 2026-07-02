package com.docsphere.workspace;

import com.docsphere.workspace.dto.CreateWorkspaceRequest;
import com.docsphere.workspace.dto.UpdateWorkspaceRequest;
import com.docsphere.workspace.dto.WorkspaceDto;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {

    WorkspaceDto createWorkspace(UUID ownerId, CreateWorkspaceRequest request);

    WorkspaceDto getWorkspaceById(UUID workspaceId);

    List<WorkspaceDto> getUserWorkspaces(UUID userId);

    WorkspaceDto updateWorkspace(UUID workspaceId, UUID requesterId, UpdateWorkspaceRequest request);

    void deleteWorkspace(UUID workspaceId, UUID requesterId);
}
