package com.docsphere.activity;

import com.docsphere.common.BaseEntity;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityEntityType entityType;

    @Column(nullable = false)
    private UUID entityId;

    @Column(length = 255)
    private String entityName;
}
