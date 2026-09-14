package com.docsphere.activity;

import com.docsphere.activity.dto.ActivityLogDto;
import com.docsphere.common.ApiResponse;
import com.docsphere.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping("/api/workspaces/{workspaceId}/activity")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getWorkspaceActivity(
            @PathVariable UUID workspaceId
    ) {
        List<ActivityLogDto> logs = activityLogService.getWorkspaceActivity(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Activity log fetched successfully", logs));
    }

    @GetMapping("/api/workspaces/{workspaceId}/activity/recent")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getRecentActivity(
            @PathVariable UUID workspaceId
    ) {
        List<ActivityLogDto> logs = activityLogService.getRecentWorkspaceActivity(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Recent activity fetched successfully", logs));
    }

    @GetMapping("/api/activity/recent")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getRecentActivityAcrossWorkspaces(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<ActivityLogDto> logs = activityLogService.getRecentActivityAcrossWorkspaces(
                currentUser.getUser().getId()
        );
        return ResponseEntity.ok(ApiResponse.success("Recent activity fetched successfully", logs));
    }
}