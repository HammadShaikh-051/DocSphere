package com.docsphere.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendVerificationEmail(String toEmail, String userName, String verificationToken) {
        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;

        String subject = "Verify your DocSphere account";

        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Welcome to DocSphere, %s!</h2>
                    <p>Please verify your email address to activate your account.</p>
                    <p>
                        <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
                            Verify Email
                        </a>
                    </p>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p>%s</p>
                </div>
                """.formatted(userName, verificationLink, verificationLink);

        sendHtmlEmail(toEmail, subject, body);
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        String subject = "Reset your DocSphere password";

        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Hi %s,</h2>
                    <p>We received a request to reset your password. This link will expire in 30 minutes.</p>
                    <p>
                        <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
                            Reset Password
                        </a>
                    </p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
                """.formatted(userName, resetLink);

        sendHtmlEmail(toEmail, subject, body);
    }

    @Override
    @Async
    public void sendInvitationEmail(String toEmail, String inviterName, String workspaceName, String invitationToken) {
        String invitationLink = frontendUrl + "/invite/accept?token=" + invitationToken;

        String subject = inviterName + " invited you to join \"" + workspaceName + "\" on DocSphere";

        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>You've been invited!</h2>
                    <p><strong>%s</strong> has invited you to collaborate on <strong>%s</strong> in DocSphere.</p>
                    <p>
                        <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
                            Accept Invitation
                        </a>
                    </p>
                    <p>This invitation expires in 7 days.</p>
                </div>
                """.formatted(inviterName, workspaceName, invitationLink);
        
        sendHtmlEmail(toEmail, subject, body);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
