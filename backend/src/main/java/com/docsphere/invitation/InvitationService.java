package com.docsphere.invitation;

import com.docsphere.invitation.dto.InvitationDto;
import com.docsphere.invitation.dto.SendInvitationRequest;

import java.util.List;
import java.util.UUID;

public interface InvitationService {

    InvitationDto sendInvitation(UUID workspaceId, UUID inviterId, SendInvitationRequest request);

    List<InvitationDto> getWorkspaceInvitations(UUID workspaceId);

    List<InvitationDto> getMyPendingInvitations(String email);

    void acceptInvitation(String token, UUID userId);

    void cancelInvitation(UUID invitationId, UUID requesterId);
}