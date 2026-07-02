package com.docsphere.member;

import com.docsphere.common.ApiResponse;
import com.docsphere.member.dto.MemberDto;
import com.docsphere.member.dto.UpdateRoleRequest;
import com.docsphere.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/members")
@RequiredArgsConstructor
public class WorkspaceMemberController {

    private final WorkspaceMemberService memberService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MemberDto>>> getMembers(
            @PathVariable UUID workspaceId
    ) {
        List<MemberDto> members = memberService.getWorkspaceMembers(workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Members fetched successfully", members));
    }

    @PutMapping("/{memberUserId}/role")
    public ResponseEntity<ApiResponse<MemberDto>> updateRole(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberUserId,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        MemberDto updatedMember = memberService.updateMemberRole(
                workspaceId,
                memberUserId,
                currentUser.getUser().getId(),
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Member role updated successfully", updatedMember));
    }

    @DeleteMapping("/{memberUserId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberUserId
    ) {
        memberService.removeMember(workspaceId, memberUserId, currentUser.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully"));
    }
}