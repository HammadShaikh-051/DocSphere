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
public class DocumentVersionDto {
    private UUID id;
    private UUID documentId;
    private Integer versionNumber;
    private String title;
    private Map<String, Object> content;

    private UUID createdById;
    private String createdByName;

    private LocalDateTime createdAt;
}
