package com.docsphere.document;

import com.docsphere.activity.ActivityAction;
import com.docsphere.activity.ActivityEntityType;
import com.docsphere.activity.ActivityLogService;
import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.document.dto.CreateDocumentRequest;
import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.UpdateDocumentRequest;
import com.docsphere.folder.Folder;
import com.docsphere.folder.FolderRepository;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final WorkspaceRepository workspaceRepository;
    private final FolderRepository folderRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final DocumentMapper documentMapper;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public DocumentDto createDocument(UUID workspaceId, UUID creatorId, CreateDocumentRequest request) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);
        User creator = getUserOrThrow(creatorId);

        verifyCanEdit(workspace, creator);

        Folder folder = null;
        if (request.getFolderId() != null) {
            folder = folderRepository.findById(request.getFolderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

            if (!folder.getWorkspace().getId().equals(workspaceId)) {
                throw new BadRequestException("Folder does not belong to this workspace");
            }
        }

        Document document = Document.builder()
                .title(request.getTitle())
                .content(null)
                .workspace(workspace)
                .folder(folder)
                .createdBy(creator)
                .lastUpdatedBy(creator)
                .build();

        Document savedDocument = documentRepository.save(document);

        activityLogService.logActivity(
                workspace,
                creator,
                ActivityAction.CREATED,
                ActivityEntityType.DOCUMENT,
                savedDocument.getId(),
                savedDocument.getTitle()
        );

        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDto getDocumentById(UUID documentId) {
        Document document = getDocumentOrThrow(documentId);
        return documentMapper.toDto(document);
    }

    @Override
    public List<DocumentDto> getWorkspaceDocuments(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return documentRepository.findByWorkspaceOrderByUpdatedAtDesc(workspace).stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> getFolderDocuments(UUID folderId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        return documentRepository.findByFolder(folder).stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> getRootDocuments(UUID workspaceId) {
        Workspace workspace = getWorkspaceOrThrow(workspaceId);

        return documentRepository.findByWorkspaceAndFolderIsNull(workspace).stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DocumentDto updateDocument(UUID documentId, UUID requesterId, UpdateDocumentRequest request) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(document.getWorkspace(), requester);

        document.setTitle(request.getTitle());

        if (request.getContent() != null) {
            document.setContent(request.getContent());
        }

        document.setLastUpdatedBy(requester);

        Document updatedDocument = documentRepository.save(document);

        return documentMapper.toDto(updatedDocument);
    }

    @Override
    @Transactional
    public void deleteDocument(UUID documentId, UUID requesterId) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(document.getWorkspace(), requester);

        documentRepository.delete(document);
    }

    private void verifyCanEdit(Workspace workspace, User user) {
        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (member.getRole() == WorkspaceRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot create or modify documents");
        }
    }

    private Workspace getWorkspaceOrThrow(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }

    private Document getDocumentOrThrow(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}