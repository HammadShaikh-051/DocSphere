package com.docsphere.search;

import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.document.Document;
import com.docsphere.document.DocumentRepository;
import com.docsphere.folder.Folder;
import com.docsphere.folder.FolderRepository;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.search.dto.SearchResultDto;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import com.docsphere.workspace.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final FolderRepository folderRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SearchResultDto> search(UUID workspaceId, String query) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        return searchWithinWorkspace(workspace, query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SearchResultDto> globalSearch(UUID userId, String query) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<WorkspaceMember> memberships = memberRepository.findByUser(user);
        List<SearchResultDto> results = new ArrayList<>();

        for (WorkspaceMember membership : memberships) {
            results.addAll(searchWithinWorkspace(membership.getWorkspace(), query));
        }

        return results;
    }

    private List<SearchResultDto> searchWithinWorkspace(Workspace workspace, String query) {
        List<SearchResultDto> results = new ArrayList<>();

        List<Folder> folders = folderRepository
                .findByWorkspaceAndNameContainingIgnoreCaseAndDeletedAtIsNull(workspace, query);

        for (Folder folder : folders) {
            results.add(SearchResultDto.builder()
                    .id(folder.getId())
                    .name(folder.getName())
                    .type("FOLDER")
                    .workspaceId(workspace.getId())
                    .workspaceName(workspace.getName())
                    .path(buildFolderPath(workspace, folder))
                    .build());
        }

        List<Document> documents = documentRepository
                .findByWorkspaceAndTitleContainingIgnoreCaseAndDeletedAtIsNull(workspace, query);

        for (Document document : documents) {
            results.add(SearchResultDto.builder()
                    .id(document.getId())
                    .name(document.getTitle())
                    .type("DOCUMENT")
                    .folderId(document.getFolder() != null ? document.getFolder().getId() : null)
                    .workspaceId(workspace.getId())
                    .workspaceName(workspace.getName())
                    .path(buildDocumentPath(workspace, document))
                    .build());
        }

        return results;
    }

    private String buildFolderPath(Workspace workspace, Folder folder) {
        List<String> parts = new ArrayList<>();
        // Traverse parent chain (excluding the folder itself)
        Folder current = folder.getParentFolder();
        while (current != null) {
            parts.add(0, current.getName());
            current = current.getParentFolder();
        }
        parts.add(0, workspace.getName());
        return String.join(" › ", parts);
    }

    private String buildDocumentPath(Workspace workspace, Document document) {
        List<String> parts = new ArrayList<>();
        Folder current = document.getFolder();
        while (current != null) {
            parts.add(0, current.getName());
            current = current.getParentFolder();
        }
        parts.add(0, workspace.getName());
        return String.join(" › ", parts);
    }
}