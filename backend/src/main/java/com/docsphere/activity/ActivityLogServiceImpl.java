package com.docsphere.activity;

import com.docsphere.activity.dto.ActivityLogDto;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;
import com.docsphere.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ActivityLogMapper activityLogMapper;

    @Override
    @Transactional
    public void logActivity(
            Workspace workspace,
            User user,
            ActivityAction action,
            ActivityEntityType entityType,
            UUID entityId,
            String entityName
    ) {
        ActivityLog log = ActivityLog.builder()
                .workspace(workspace)
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .entityName(entityName)
                .build();

        activityLogRepository.save(log);
    }

    @Override
    public List<ActivityLogDto> getWorkspaceActivity(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return activityLogRepository.findByWorkspaceOrderByCreatedAtDesc(workspace).stream()
                .map(activityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityLogDto> getRecentWorkspaceActivity(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return activityLogRepository.findTop10ByWorkspaceOrderByCreatedAtDesc(workspace).stream()
                .map(activityLogMapper::toDto)
                .collect(Collectors.toList());
    }

    private Workspace getWorkspaceOrThrow(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }
}