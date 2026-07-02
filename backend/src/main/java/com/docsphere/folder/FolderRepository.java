package com.docsphere.folder;

import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {
    List<Folder> findByWorkspace(Workspace workspace);

    List<Folder> findByWorkspaceAndParentFolderIsNull(Workspace workspace);

    List<Folder> findByParentFolder(Folder parentFolder);

    boolean existsByNameAndWorkspaceAndParentFolder(
            String name,
            Workspace workspace,
            Folder parentFolder
    );
}
