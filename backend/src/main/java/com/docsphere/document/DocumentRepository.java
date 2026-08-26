package com.docsphere.document;

import com.docsphere.folder.Folder;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByWorkspaceAndDeletedAtIsNull(Workspace workspace);

    List<Document> findByFolderAndDeletedAtIsNull(Folder folder);

    List<Document> findByWorkspaceAndFolderIsNullAndDeletedAtIsNull(Workspace workspace);

    List<Document> findByWorkspaceOrderByUpdatedAtDesc(Workspace workspace);

    List<Document> findByCreatedBy(User user);

    List<Document> findByWorkspaceAndDeletedAtIsNotNullOrderByDeletedAtDesc(Workspace workspace);

    List<Document> findByFolder(Folder folder);

    List<Document> findByDeletedAtBefore(LocalDateTime cutoff);

    List<Document> findByWorkspaceAndTitleContainingIgnoreCaseAndDeletedAtIsNull(Workspace workspace, String title);
}
