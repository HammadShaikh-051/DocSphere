package com.docsphere.folder;

import com.docsphere.activity.ActivityAction;
import com.docsphere.activity.ActivityEntityType;
import com.docsphere.activity.ActivityLogService;
import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.document.Document;
import com.docsphere.document.DocumentRepository;
import com.docsphere.folder.dto.CreateFolderRequest;
import com.docsphere.folder.dto.FolderDto;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import com.docsphere.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final FolderMapper folderMapper;
    private final ActivityLogService activityLogService;
    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public FolderDto createFolder(UUID workspaceId, UUID creatorId, CreateFolderRequest request) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);
        User creator = getUserOrThrow(creatorId);

        verifyCanEdit(workspace, creator);

        Folder parentFolder = null;
        if (request.getParentFolderId() != null) {
            parentFolder = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));

            if (!parentFolder.getWorkspace().getId().equals(workspaceId)) {
                throw new BadRequestException("Parent folder does not belong to this workspace");
            }
        }

        boolean nameExists = folderRepository.existsByNameAndWorkspaceAndParentFolderAndDeletedAtIsNull(
                request.getName(), workspace, parentFolder
        );

        if (nameExists) {
            throw new BadRequestException("A folder with this name already exists here");
        }

        Folder folder = Folder.builder()
                .name(request.getName())
                .workspace(workspace)
                .parentFolder(parentFolder)
                .createdBy(creator)
                .build();

        Folder savedFolder = folderRepository.save(folder);

        activityLogService.logActivity(
                workspace,
                creator,
                ActivityAction.CREATED,
                ActivityEntityType.FOLDER,
                savedFolder.getId(),
                savedFolder.getName()
        );

        return folderMapper.toDto(savedFolder);
    }

    @Override
    public FolderDto getFolderById(UUID folderId) {
        Folder folder = getFolderOrThrow(folderId);
        return folderMapper.toDto(folder);
    }

    @Override
    public List<FolderDto> getRootFolders(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return folderRepository.findByWorkspaceAndParentFolderIsNullAndDeletedAtIsNull(workspace).stream()
                .map(folderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FolderDto> getSubFolders(UUID folderId) {
        Folder parentFolder = getFolderOrThrow(folderId);

        return folderRepository.findByParentFolderAndDeletedAtIsNull(parentFolder).stream()
                .map(folderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FolderDto renameFolder(UUID folderId, UUID requesterId, String newName) {
        Folder folder = getFolderOrThrow(folderId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(folder.getWorkspace(), requester);

        boolean nameExists = folderRepository.existsByNameAndWorkspaceAndParentFolderAndDeletedAtIsNull(
                newName, folder.getWorkspace(), folder.getParentFolder()
        );

        if (nameExists) {
            throw new BadRequestException("A folder with this name already exists here");
        }

        folder.setName(newName);
        Folder updatedFolder = folderRepository.save(folder);

        return folderMapper.toDto(updatedFolder);
    }

    @Override
    @Transactional
    public void deleteFolder(UUID folderId, UUID requesterId) {
        Folder folder = getFolderOrThrow(folderId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(folder.getWorkspace(), requester);

        softDeleteFolderRecursively(folder);
    }

    private void softDeleteFolderRecursively(Folder folder) {
        LocalDateTime now = LocalDateTime.now();

        List<Folder> subFolders = folderRepository.findByParentFolder(folder);
        for (Folder subFolder : subFolders) {
            softDeleteFolderRecursively(subFolder);
        }

        List<Document> documents = documentRepository.findByFolder(folder);
        for (Document doc : documents) {
            doc.setDeletedAt(now);
            documentRepository.save(doc);
        }

        folder.setDeletedAt(now);
        folderRepository.save(folder);
    }

    @Override
    @Transactional
    public void restoreFolder(UUID folderId, UUID requesterId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(folder.getWorkspace(), requester);

        restoreFolderRecursively(folder);
    }

    private void restoreFolderRecursively(Folder folder) {
        folder.setDeletedAt(null);
        folderRepository.save(folder);

        List<Folder> subFolders = folderRepository.findByParentFolder(folder);
        for (Folder sub : subFolders) {
            restoreFolderRecursively(sub);
        }

        List<Document> documents = documentRepository.findByFolder(folder);
        for (Document doc : documents) {
            doc.setDeletedAt(null);
            documentRepository.save(doc);
        }
    }

    @Override
    @Transactional
    public void permanentlyDeleteFolder(UUID folderId, UUID requesterId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(folder.getWorkspace(), requester);

        hardDeleteFolderRecursively(folder);
    }

    private void hardDeleteFolderRecursively(Folder folder) {
        List<Folder> subFolders = folderRepository.findByParentFolder(folder);
        for (Folder subFolder : subFolders) {
            hardDeleteFolderRecursively(subFolder);
        }

        documentRepository.deleteAll(documentRepository.findByFolder(folder));
        documentRepository.flush();

        folderRepository.delete(folder);
        folderRepository.flush();
    }

    @Override
    public List<FolderDto> getTrashedFolders(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        List<Folder> trashed = folderRepository.findByWorkspaceAndDeletedAtIsNotNullOrderByDeletedAtDesc(workspace);

        return trashed.stream()
                .filter(folder -> folder.getParentFolder() == null || folder.getParentFolder().getDeletedAt() == null)
                .map(folderMapper::toDto)
                .collect(Collectors.toList());
    }

    private void verifyCanEdit(Workspace workspace, User user) {
        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (member.getRole() == WorkspaceRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot create or modify folders");
        }
    }

    private Workspace getWorkspaceOrThrow(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }

    private Folder getFolderOrThrow(UUID folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}