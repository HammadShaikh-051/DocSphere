package com.docsphere.document;

import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.DocumentVersionDto;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentVersionServiceImpl implements DocumentVersionService {

    private final DocumentVersionRepository versionRepository;
    private final DocumentRepository documentRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final DocumentVersionMapper versionMapper;
    private final DocumentMapper documentMapper;

    private final ObjectMapper objectMapper;

    @Override
    public List<DocumentVersionDto> getVersions(UUID documentId, UUID requesterId) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyIsMember(document.getWorkspace(), requester);

        return versionRepository
                .findByDocumentOrderByVersionNumberDesc(document)
                .stream()
                .map(versionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentVersionDto getVersion(UUID documentId, UUID versionId, UUID requesterId) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyIsMember(document.getWorkspace(), requester);

        DocumentVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        if (!version.getDocument().getId().equals(documentId)) {
            throw new BadRequestException("Version does not belong to this document");
        }

        return versionMapper.toDto(version);
    }

    @Override
    @Transactional
    public DocumentVersionDto createVersion(UUID documentId, UUID requesterId, String description) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(document.getWorkspace(), requester);

        Optional<DocumentVersion> latestOpt = versionRepository
                .findTopByDocumentOrderByVersionNumberDesc(document);

        if (latestOpt.isPresent()) {
            DocumentVersion latest = latestOpt.get();

            boolean sameTitle = Objects.equals(document.getTitle(), latest.getTitle());

            boolean sameContent = toJsonString(document.getContent())
                    .equals(toJsonString(latest.getContent()));

            if (sameTitle && sameContent) {
                throw new BadRequestException("No changes since the last saved version.");
            }
        }

        int nextVersionNumber = latestOpt
                .map(v -> v.getVersionNumber() + 1)
                .orElse(1);

        String normalizedDescription = (description != null && !description.isBlank())
                ? description.strip()
                : null;

        DocumentVersion version = DocumentVersion.builder()
                .document(document)
                .versionNumber(nextVersionNumber)
                .title(document.getTitle())
                .content(document.getContent())
                .createdBy(requester)
                .description(normalizedDescription)
                .build();

        DocumentVersion saved = versionRepository.save(version);
        return versionMapper.toDto(saved);
    }

    @Override
    @Transactional
    public DocumentDto restoreVersion(UUID documentId, UUID versionId, UUID requesterId) {
        Document document = getDocumentOrThrow(documentId);
        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(document.getWorkspace(), requester);

        DocumentVersion targetVersion = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        if (!targetVersion.getDocument().getId().equals(documentId)) {
            throw new BadRequestException("Version does not belong to this document");
        }

        createVersionInternal(document, requester);

        document.setTitle(targetVersion.getTitle());
        document.setContent(targetVersion.getContent());
        document.setLastUpdatedBy(requester);

        Document updatedDocument = documentRepository.save(document);
        return documentMapper.toDto(updatedDocument);
    }

    @Override
    @Transactional
    public void createVersionInternal(Document document, User actor) {
        int nextVersionNumber = versionRepository
                .findTopByDocumentOrderByVersionNumberDesc(document)
                .map(v -> v.getVersionNumber() + 1)
                .orElse(1);

        DocumentVersion version = DocumentVersion.builder()
                .document(document)
                .versionNumber(nextVersionNumber)
                .title(document.getTitle())
                .content(document.getContent())
                .createdBy(actor)
                .description(null)
                .build();

        versionRepository.save(version);
    }

    private void verifyIsMember(Workspace workspace, User user) {
        memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));
    }

    private void verifyCanEdit(Workspace workspace, User user) {
        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (member.getRole() == WorkspaceRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot create or restore document versions");
        }
    }

    private Document getDocumentOrThrow(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String toJsonString(Object obj) {
        if (obj == null)
            return "null";
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return obj.toString();
        }
    }
}
