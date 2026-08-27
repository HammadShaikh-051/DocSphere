package com.docsphere.attachment;

import com.docsphere.attachment.dto.AttachmentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {

    @Mapping(source = "document.id", target="documentId")
    @Mapping(source = "uploadedBy.name", target="uploadedByName")
    AttachmentDto toDto(Attachment attachment);
}