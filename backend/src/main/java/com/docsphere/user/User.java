package com.docsphere.user;

import com.docsphere.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(length = 255)
    private String emailVerificationToken;

    @Column(length = 255)
    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiresAt;

    @Column(length = 20)
    private String authProvider;
}
