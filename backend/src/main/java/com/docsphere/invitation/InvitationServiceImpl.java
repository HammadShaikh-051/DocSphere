package com.docsphere.invitation;

import com.docsphere.activity.ActivityAction;
import com.docsphere.activity.ActivityEntityType;
import com.docsphere.activity.ActivityLogService;
import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.email.EmailService;
import com.docsphere.invitation.dto.InvitationDto;
import com.docsphere.invitation.dto.SendInvitationRequest;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import com.docsphere.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final InvitationMapper invitationMapper;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public InvitationDto sendInvitation(UUID workspaceId, UUID inviterId, SendInvitationRequest request) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);
        User inviter = getUserOrThrow(inviterId);

        verifyOwnerOrAdmin(workspace, inviter);

        if (request.getRole() == WorkspaceRole.OWNER) {
            throw new BadRequestException("Cannot invite someone as owner");
        }

        boolean alreadyMember = userRepository.findByEmail(request.getEmail())
                .map(user -> memberRepository.existsByWorkspaceAndUser(workspace, user))
                .orElse(false);

        if (alreadyMember) {
            throw new BadRequestException("This user is already a member of the workspace");
        }

        boolean alreadyInvited = invitationRepository.existsByWorkspaceAndInvitedEmailAndStatus(
                workspace, request.getEmail(), InvitationStatus.PENDING
        );

        if (alreadyInvited) {
            throw new BadRequestException("An invitation has already been sent to this email");
        }

        Invitation invitation = Invitation.builder()
                .workspace(workspace)
                .invitedBy(inviter)
                .invitedEmail(request.getEmail())
                .role(request.getRole())
                .token(UUID.randomUUID().toString())
                .status(InvitationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        Invitation savedInvitation = invitationRepository.save(invitation);

        activityLogService.logActivity(
                workspace,
                inviter,
                ActivityAction.INVITED,
                ActivityEntityType.MEMBER,
                savedInvitation.getId(),
                request.getEmail()
        );

        emailService.sendInvitationEmail(
                request.getEmail(),
                inviter.getName(),
                workspace.getName(),
                savedInvitation.getToken()
        );

        return invitationMapper.toDto(savedInvitation);
    }

    @Override
    public List<InvitationDto> getWorkspaceInvitations(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return invitationRepository.findByWorkspace(workspace).stream()
                .map(invitationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvitationDto> getMyPendingInvitations(String email) {
        return invitationRepository.findByInvitedEmail(email).stream()
                .filter(invitation -> invitation.getStatus() == InvitationStatus.PENDING)
                .map(invitationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void acceptInvitation(String token, UUID userId) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid invitation token"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("This invitation is no longer valid");
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new BadRequestException("This invitation has expired");
        }

        User user = getUserOrThrow(userId);

        if (!user.getEmail().equalsIgnoreCase(invitation.getInvitedEmail())) {
            throw new UnauthorizedException("This invitation was not sent to your account");
        }

        boolean alreadyMember = memberRepository.existsByWorkspaceAndUser(invitation.getWorkspace(), user);

        if (alreadyMember) {
            throw new BadRequestException("You are already a member of this workspace");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(invitation.getWorkspace())
                .user(user)
                .role(invitation.getRole())
                .joinedAt(LocalDateTime.now())
                .build();

        memberRepository.save(member);

        activityLogService.logActivity(
                invitation.getWorkspace(),
                user,
                ActivityAction.JOINED,
                ActivityEntityType.MEMBER,
                user.getId(),
                user.getName()
        );

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);
    }

    @Override
    @Transactional
    public void cancelInvitation(UUID invitationId, UUID requesterId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        User requester = getUserOrThrow(requesterId);

        verifyOwnerOrAdmin(invitation.getWorkspace(), requester);

        invitationRepository.delete(invitation);
    }

    private void verifyOwnerOrAdmin(Workspace workspace, User requester) {
        WorkspaceMember requesterMembership = memberRepository.findByWorkspaceAndUser(workspace, requester)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (requesterMembership.getRole() != WorkspaceRole.OWNER
                && requesterMembership.getRole() != WorkspaceRole.ADMIN) {
            throw new UnauthorizedException("Only owners and admins can manage invitations");
        }
    }

    private Workspace getWorkspaceOrThrow(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}