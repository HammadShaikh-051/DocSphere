package com.docsphere.invitation;

import com.docsphere.invitation.dto.InvitationDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvitationMapper {
    @Mapping(source = "workspace.id", target = "workspaceId")
    @Mapping(source = "workspace.name", target = "workspaceName")
    InvitationDto toDto(Invitation invitation);
}
