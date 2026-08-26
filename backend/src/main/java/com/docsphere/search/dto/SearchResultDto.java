package com.docsphere.search.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResultDto {
    private UUID id;
    private String name;
    private String type;
    private UUID folderId;
    private UUID workspaceId;
    private String workspaceName;
    private String path;
}