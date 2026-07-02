package com.docsphere.workspace;

import com.docsphere.user.UserMapper;
import com.docsphere.workspace.dto.WorkspaceDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface WorkspaceMapper {
    WorkspaceDto toDto(Workspace workspace);
}
