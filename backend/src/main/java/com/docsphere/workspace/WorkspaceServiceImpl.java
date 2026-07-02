package com.docsphere.workspace;

import com.docsphere.activity.ActivityAction;
import com.docsphere.activity.ActivityEntityType;
import com.docsphere.activity.ActivityLogService;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.dto.CreateWorkspaceRequest;
import com.docsphere.workspace.dto.UpdateWorkspaceRequest;
import com.docsphere.workspace.dto.WorkspaceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;
    private final WorkspaceMapper workspaceMapper;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public WorkspaceDto createWorkspace(UUID ownerId, CreateWorkspaceRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Workspace savedWorkspace = workspaceRepository.save(workspace);

        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(savedWorkspace)
                .user(owner)
                .role(WorkspaceRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();

        workspaceMemberRepository.save(member);

        activityLogService.logActivity(
                savedWorkspace,
                owner,
                ActivityAction.CREATED,
                ActivityEntityType.WORKSPACE,
                savedWorkspace.getId(),
                savedWorkspace.getName()
        );

        return workspaceMapper.toDto(savedWorkspace);
    }

    @Override
    public WorkspaceDto getWorkspaceById(UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        return workspaceMapper.toDto(workspace);
    }

    @Override
    public List<WorkspaceDto> getUserWorkspaces(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<WorkspaceMember> memberships = workspaceMemberRepository.findByUser(user);

        return memberships.stream()
                .map(member -> workspaceMapper.toDto(member.getWorkspace()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkspaceDto updateWorkspace(UUID workspaceId, UUID requesterId, UpdateWorkspaceRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        verifyAdminOrOwner(workspace, requesterId);

        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());

        Workspace updatedWorkspace = workspaceRepository.save(workspace);

        return workspaceMapper.toDto(updatedWorkspace);
    }

    @Override
    @Transactional
    public void deleteWorkspace(UUID workspaceId, UUID requesterId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (!workspace.getOwner().getId().equals(requesterId)) {
            throw new UnauthorizedException("Only the workspace owner can delete this workspace");
        }

        workspaceRepository.delete(workspace);
    }

    private void verifyAdminOrOwner(Workspace workspace, UUID requesterId) {
        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceAndUser(workspace, getUserOrThrow(requesterId))
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (member.getRole() != WorkspaceRole.OWNER && member.getRole() != WorkspaceRole.ADMIN) {
            throw new UnauthorizedException("Only owners and admins can perform this action");
        }
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}