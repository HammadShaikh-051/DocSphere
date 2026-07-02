package com.docsphere.activity;

import com.docsphere.activity.dto.ActivityLogDto;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;

import java.util.List;
import java.util.UUID;

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
}