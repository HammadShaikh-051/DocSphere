package com.docsphere.activity;

import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByWorkspaceOrderByCreatedAtDesc(Workspace workspace);

    List<ActivityLog> findTop10ByWorkspaceOrderByCreatedAtDesc(Workspace workspace);

    List<ActivityLog> findTop20ByWorkspaceInOrderByCreatedAtDesc(List<Workspace> workspaces);
}
