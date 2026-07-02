package com.docsphere.invitation.dto;

import com.docsphere.invitation.InvitationStatus;
import com.docsphere.member.WorkspaceRole;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationDto {
    private UUID id;
    private UUID workspaceId;
    private String workspaceName;
    private String invitedEmail;
    private WorkspaceRole role;
    private InvitationStatus status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
