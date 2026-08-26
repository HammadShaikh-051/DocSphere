package com.docsphere.folder;

import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {
    List<Folder> findByWorkspaceAndDeletedAtIsNull(Workspace workspace);

    List<Folder> findByWorkspaceAndParentFolderIsNullAndDeletedAtIsNull(Workspace workspace);

    List<Folder> findByParentFolderAndDeletedAtIsNull(Folder parentFolder);

    boolean existsByNameAndWorkspaceAndParentFolderAndDeletedAtIsNull(
            String name,
            Workspace workspace,
            Folder parentFolder
    );

    List<Folder> findByWorkspaceAndDeletedAtIsNotNullOrderByDeletedAtDesc(Workspace workspace);

    List<Folder> findByWorkspace(Workspace workspace);

    List<Folder> findByParentFolder(Folder parentFolder);

    List<Folder> findByDeletedAtBefore(LocalDateTime cutoff);

    List<Folder> findByWorkspaceAndNameContainingIgnoreCaseAndDeletedAtIsNull(Workspace workspace, String name);
}
