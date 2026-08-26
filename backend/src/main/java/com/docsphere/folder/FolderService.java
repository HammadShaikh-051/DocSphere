package com.docsphere.folder;

import com.docsphere.folder.dto.CreateFolderRequest;
import com.docsphere.folder.dto.FolderDto;

import java.util.List;
import java.util.UUID;

public interface FolderService {

    FolderDto createFolder(UUID workspaceId, UUID creatorId, CreateFolderRequest request);

    FolderDto getFolderById(UUID folderId);

    List<FolderDto> getRootFolders(UUID workspaceId);

    List<FolderDto> getSubFolders(UUID folderId);

    FolderDto renameFolder(UUID folderId, UUID requesterId, String newName);

    void deleteFolder(UUID folderId, UUID requesterId);

    void restoreFolder(UUID folderId, UUID requesterId);

    void permanentlyDeleteFolder(UUID folderId, UUID requesterId);

    List<FolderDto> getTrashedFolders(UUID workspaceId);
}