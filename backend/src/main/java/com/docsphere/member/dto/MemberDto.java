package com.docsphere.member.dto;

import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.dto.UserDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {
    private UUID id;
    private UserDto user;
    private WorkspaceRole role;
    private LocalDateTime joinedAt;
}
