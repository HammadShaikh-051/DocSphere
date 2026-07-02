package com.docsphere.invitation;

import com.docsphere.workspace.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    Optional<Invitation> findByToken(String token);

    List<Invitation> findByInvitedEmail(String email);

    List<Invitation> findByWorkspace(Workspace workspace);

    boolean existsByWorkspaceAndInvitedEmailAndStatus(
            Workspace workspace,
            String invitedEmail,
            InvitationStatus status
    );

    Optional<Invitation> findByWorkspaceAndInvitedEmail(
            Workspace workspace,
            String invitedEmail
    );
}
