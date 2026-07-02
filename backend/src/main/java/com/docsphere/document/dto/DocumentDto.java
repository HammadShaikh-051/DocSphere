package com.docsphere.document.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private UUID id;
    private String title;
    private Map<String, Object> content;
    private UUID workspaceId;
    private UUID folderId;
    private UUID createdBy;
    private UUID lastUpdatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
