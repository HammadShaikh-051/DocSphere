package com.docsphere.folder;

import com.docsphere.common.BaseEntity;
import com.docsphere.user.User;
import com.docsphere.workspace.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "folders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Folder extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = true)
    private LocalDateTime deletedAt;
}
