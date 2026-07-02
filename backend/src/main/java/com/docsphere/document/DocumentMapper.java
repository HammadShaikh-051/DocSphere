package com.docsphere.document;

import com.docsphere.document.dto.DocumentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentMapper {
    @Mapping(source = "workspace.id", target = "workspaceId")
    @Mapping(source = "folder.id", target = "folderId")
    @Mapping(source = "createdBy.id", target = "createdBy")
    @Mapping(source = "lastUpdatedBy.id", target = "lastUpdatedBy")
    DocumentDto toDto(Document document);
}
