package com.docsphere.member;

import com.docsphere.member.dto.MemberDto;
import com.docsphere.member.dto.UpdateRoleRequest;

import java.util.List;
import java.util.UUID;

public interface WorkspaceMemberService {

    List<MemberDto> getWorkspaceMembers(UUID workspaceId);

    MemberDto updateMemberRole(UUID workspaceId, UUID memberUserId, UUID requesterId, UpdateRoleRequest request);

    void removeMember(UUID workspaceId, UUID memberUserId, UUID requesterId);
}