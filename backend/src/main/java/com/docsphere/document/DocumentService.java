package com.docsphere.document;

import com.docsphere.document.dto.CreateDocumentRequest;
import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.UpdateDocumentRequest;

import java.util.List;
import java.util.UUID;

public interface DocumentService {

    DocumentDto createDocument(UUID workspaceId, UUID creatorId, CreateDocumentRequest request);

    DocumentDto getDocumentById(UUID documentId);

    List<DocumentDto> getWorkspaceDocuments(UUID workspaceId);

    List<DocumentDto> getFolderDocuments(UUID folderId);

    List<DocumentDto> getRootDocuments(UUID workspaceId);

    DocumentDto updateDocument(UUID documentId, UUID requesterId, UpdateDocumentRequest request);

    void deleteDocument(UUID documentId, UUID requesterId);

    void restoreDocument(UUID documentId, UUID requesterId);

    void permanentlyDeleteDocument(UUID documentId, UUID requesterId);

    List<DocumentDto> getTrashedDocuments(UUID workspaceId);
}