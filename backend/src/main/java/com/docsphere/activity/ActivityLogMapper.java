package com.docsphere.activity;

import com.docsphere.activity.dto.ActivityLogDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityLogMapper {
    @Mapping(source = "workspace.id", target = "workspaceId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    ActivityLogDto toDto(ActivityLog log);
}
