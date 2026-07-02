package com.docsphere.email;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String userName, String verificationToken);

    void sendPasswordResetEmail(String toEmail, String userName, String resetToken);

    void sendInvitationEmail(String toEmail, String inviterName, String workspaceName, String invitationToken);
}
