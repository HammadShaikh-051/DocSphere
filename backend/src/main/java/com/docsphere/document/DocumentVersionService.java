package com.docsphere.document;

import com.docsphere.document.dto.DocumentDto;
import com.docsphere.document.dto.DocumentVersionDto;
import com.docsphere.user.User;

import java.util.List;
import java.util.UUID;

public interface DocumentVersionService {

    List<DocumentVersionDto> getVersions(UUID documentId, UUID requesterId);

    DocumentVersionDto getVersion(UUID documentId, UUID versionId, UUID requesterId);

    DocumentDto restoreVersion(UUID documentId, UUID versionId, UUID requesterId);

    void createVersionInternal(Document document, User actor);
}
