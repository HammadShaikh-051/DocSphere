package com.docsphere.workspace.dto;

import com.docsphere.user.dto.UserDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceDto {
    private UUID id;
    private String name;
    private String description;
    private UserDto owner;
    private LocalDateTime createdAt;
}
