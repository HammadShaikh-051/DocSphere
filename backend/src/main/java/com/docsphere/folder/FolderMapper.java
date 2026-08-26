package com.docsphere.folder;

import com.docsphere.folder.dto.FolderDto;
import org.springframework.stereotype.Component;

@Component
public class FolderMapper {

    public FolderDto toDto(Folder folder) {
        if (folder == null) return null;

        return FolderDto.builder()
                .id(folder.getId())
                .name(folder.getName())
                .workspaceId(folder.getWorkspace() != null ? folder.getWorkspace().getId() : null)
                .parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getId() : null)
                .createdBy(folder.getCreatedBy() != null ? folder.getCreatedBy().getId() : null)
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .deletedAt(folder.getDeletedAt())
                .build();
    }
}
