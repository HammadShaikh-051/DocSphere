package com.docsphere.activity;

import com.docsphere.activity.dto.ActivityLogDto;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public interface ActivityLogService {

    void logActivity(
            Workspace workspace,
            User user,
            ActivityAction action,
            ActivityEntityType entityType,
            UUID entityId,
            String entityName
    );

    List<ActivityLogDto> getWorkspaceActivity(UUID workspaceId);

    List<ActivityLogDto> getRecentWorkspaceActivity(UUID workspaceId);

    List<ActivityLogDto> getRecentActivityAcrossWorkspaces(UUID userId);
}