package com.docsphere.document;

import com.docsphere.document.dto.DocumentVersionDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentVersionMapper {

    @Mapping(source = "document.id", target = "documentId")
    @Mapping(source = "createdBy.id", target = "createdById")
    @Mapping(source = "createdBy.name", target = "createdByName")
    DocumentVersionDto toDto(DocumentVersion version);
}
