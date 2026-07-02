package com.docsphere.document;

import com.docsphere.folder.Folder;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByWorkspace(Workspace workspace);

    List<Document> findByFolder(Folder folder);

    List<Document> findByWorkspaceAndFolderIsNull(Workspace workspace);

    List<Document> findByCreatedBy(User user);

    List<Document> findByWorkspaceOrderByUpdatedAtDesc(Workspace workspace);
}
