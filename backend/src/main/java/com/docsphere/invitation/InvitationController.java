package com.docsphere.invitation;

import com.docsphere.common.ApiResponse;
import com.docsphere.invitation.dto.InvitationDto;
import com.docsphere.invitation.dto.SendInvitationRequest;
import com.docsphere.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    @PostMapping("/api/workspaces/{workspaceId}/invitations")
    public ResponseEntity<ApiResponse<InvitationDto>> sendInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody SendInvitationRequest request
    ) {
        InvitationDto invitation = invitationService.sendInvitation(
                workspaceId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Invitation sent successfully", invitation));
    }

    @GetMapping("/api/workspaces/{workspaceId}/invitations")
    public ResponseEntity<ApiResponse<List<InvitationDto>>> getWorkspaceInvitations(
            @PathVariable UUID workspaceId
    ) {
        List<InvitationDto> invitations = invitationService.getWorkspaceInvitations(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Invitations fetched successfully", invitations));
    }

    @GetMapping("/api/invitations/me")
    public ResponseEntity<ApiResponse<List<InvitationDto>>> getMyInvitations(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<InvitationDto> invitations = invitationService.getMyPendingInvitations(
                currentUser.getUser().getEmail()
        );
        return ResponseEntity.ok(ApiResponse.success("Pending invitations fetched successfully", invitations));
    }

    @PostMapping("/api/invitations/accept")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam String token
    ) {
        invitationService.acceptInvitation(token, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Invitation accepted successfully"));
    }

    @DeleteMapping("/api/invitations/{invitationId}")
    public ResponseEntity<ApiResponse<Void>> cancelInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID invitationId
    ) {
        invitationService.cancelInvitation(invitationId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Invitation cancelled successfully"));
    }
}