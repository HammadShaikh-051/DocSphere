package com.docsphere.member;

import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.member.dto.MemberDto;
import com.docsphere.member.dto.UpdateRoleRequest;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import com.docsphere.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceMemberServiceImpl implements WorkspaceMemberService {

    private final WorkspaceMemberRepository memberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WorkspaceMemberMapper memberMapper;

    @Override
    public List<MemberDto> getWorkspaceMembers(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        List<WorkspaceMember> members = memberRepository.findByWorkspace(workspace);

        return members.stream()
                .map(memberMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MemberDto updateMemberRole(
            UUID workspaceId,
            UUID memberUserId,
            UUID requesterId,
            UpdateRoleRequest request
    ) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        verifyOwnerOrAdmin(workspace, requesterId);

        User targetUser = getUserOrThrow(memberUserId);

        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not a member of the workspace"));

        if (member.getRole() == WorkspaceRole.OWNER) {
            throw new BadRequestException("Cannot change the role of the workspace owner");
        }

        if (request.getRole() == WorkspaceRole.OWNER) {
            throw new BadRequestException("Cannot promote a member to owner");
        }

        member.setRole(request.getRole());
        WorkspaceMember updatedMember = memberRepository.save(member);

        return memberMapper.toDto(updatedMember);
    }

    @Override
    @Transactional
    public void removeMember(UUID workspaceId, UUID memberUserId, UUID requesterId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        verifyOwnerOrAdmin(workspace, requesterId);

        User targetUser = getUserOrThrow(memberUserId);

        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not a member of the workspace"));

        if (member.getRole() == WorkspaceRole.OWNER) {
            throw new BadRequestException("Cannot remove the workspace owner");
        }

        memberRepository.delete(member);
    }

    private void verifyOwnerOrAdmin(Workspace workspace, UUID requesterId) {
        User requester = getUserOrThrow(requesterId);

        WorkspaceMember requesterMembership = memberRepository.findByWorkspaceAndUser(workspace, requester)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (requesterMembership.getRole() != WorkspaceRole.OWNER
                && requesterMembership.getRole() != WorkspaceRole.ADMIN) {
            throw new UnauthorizedException("Only owners and admins can manage members");
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