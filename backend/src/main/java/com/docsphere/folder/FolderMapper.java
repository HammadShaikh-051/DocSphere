package com.docsphere.folder;

import com.docsphere.folder.dto.FolderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FolderMapper {
    @Mapping(source = "workspace.id", target = "workspaceId")
    @Mapping(source = "parentFolder.id", target = "parentFolderId")
    @Mapping(source = "createdBy.id", target = "createdBy")
    FolderDto toDto(Folder folder);
}
