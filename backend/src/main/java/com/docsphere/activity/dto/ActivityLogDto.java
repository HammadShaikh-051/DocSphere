package com.docsphere.activity.dto;

import com.docsphere.activity.ActivityAction;
import com.docsphere.activity.ActivityEntityType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDto {
    private UUID id;
    private UUID workspaceId;
    private UUID userId;
    private String userName;
    private ActivityAction action;
    private ActivityEntityType entityType;
    private UUID entityId;
    private String entityName;
    private LocalDateTime createdAt;
}
