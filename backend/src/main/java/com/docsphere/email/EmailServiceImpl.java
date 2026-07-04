// package com.docsphere.email;

// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;
// import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.scheduling.annotation.Async;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class EmailServiceImpl implements EmailService {

//     private final JavaMailSender mailSender;

//     @Value("${app.frontend-url}")
//     private String frontendUrl;

//     @Value("${spring.mail.username}")
//     private String fromEmail;

//     @Override
//     @Async
//     public void sendVerificationEmail(String toEmail, String userName, String verificationToken) {
//         String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;

//         String subject = "Verify your DocSphere account";

//         String body = """
//                 <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//                     <h2>Welcome to DocSphere, %s!</h2>
//                     <p>Please verify your email address to activate your account.</p>
//                     <p>
//                         <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
//                             Verify Email
//                         </a>
//                     </p>
//                     <p>If the button doesn't work, copy and paste this link into your browser:</p>
//                     <p>%s</p>
//                 </div>
//                 """
//                 .formatted(userName, verificationLink, verificationLink);

//         sendHtmlEmail(toEmail, subject, body);
//     }

//     @Override
//     @Async
//     public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
//         String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

//         String subject = "Reset your DocSphere password";

//         String body = """
//                 <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//                     <h2>Hi %s,</h2>
//                     <p>We received a request to reset your password. This link will expire in 30 minutes.</p>
//                     <p>
//                         <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
//                             Reset Password
//                         </a>
//                     </p>
//                     <p>If you didn't request this, you can safely ignore this email.</p>
//                 </div>
//                 """
//                 .formatted(userName, resetLink);

//         sendHtmlEmail(toEmail, subject, body);
//     }

//     @Override
//     @Async
//     public void sendInvitationEmail(String toEmail, String inviterName, String workspaceName, String invitationToken) {
//         String invitationLink = frontendUrl + "/invite/accept?token=" + invitationToken;

//         String subject = inviterName + " invited you to join \"" + workspaceName + "\" on DocSphere";

//         String body = """
//                 <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//                     <h2>You've been invited!</h2>
//                     <p><strong>%s</strong> has invited you to collaborate on <strong>%s</strong> in DocSphere.</p>
//                     <p>
//                         <a href="%s" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
//                             Accept Invitation
//                         </a>
//                     </p>
//                     <p>This invitation expires in 7 days.</p>
//                 </div>
//                 """
//                 .formatted(inviterName, workspaceName, invitationLink);

//         sendHtmlEmail(toEmail, subject, body);
//     }

//     private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {

//         System.out.println("========== EMAIL DEBUG ==========");
//         System.out.println("From : " + fromEmail);
//         System.out.println("To   : " + toEmail);
//         System.out.println("Subj : " + subject);

//         try {

//             MimeMessage message = mailSender.createMimeMessage();

//             MimeMessageHelper helper = new MimeMessageHelper(message, true);

//             helper.setFrom(fromEmail);
//             helper.setTo(toEmail);
//             helper.setSubject(subject);
//             helper.setText(htmlBody, true);

//             System.out.println("Sending email...");

//             mailSender.send(message);

//             System.out.println("EMAIL SENT SUCCESSFULLY");

//         } catch (Exception e) {

//             System.out.println("EMAIL FAILED");
//             e.printStackTrace();

//         }
//     }
// }

package com.docsphere.email;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    private final RestClient restClient = RestClient.create();

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
                        <a href="%s"
                        style="background:#2563eb;color:white;padding:10px 20px;
                        text-decoration:none;border-radius:6px;">
                            Verify Email
                        </a>
                    </p>

                    <p>If the button doesn't work:</p>
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
                <div style="font-family: Arial, sans-serif; max-width:480px;margin:auto;">
                    <h2>Hi %s,</h2>

                    <p>We received a request to reset your password.</p>

                    <p>
                        <a href="%s"
                        style="background:#2563eb;color:white;padding:10px 20px;
                        text-decoration:none;border-radius:6px;">
                            Reset Password
                        </a>
                    </p>

                    <p>This link expires in 30 minutes.</p>

                </div>
                """.formatted(userName, resetLink);

        sendHtmlEmail(toEmail, subject, body);
    }

    @Override
    @Async
    public void sendInvitationEmail(String toEmail,
            String inviterName,
            String workspaceName,
            String invitationToken) {

        String invitationLink = frontendUrl + "/invite/accept?token=" + invitationToken;

        String subject = inviterName + " invited you to join \"" + workspaceName + "\" on DocSphere";

        String body = """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">

                    <h2>You've been invited!</h2>

                    <p>
                        <strong>%s</strong>
                        invited you to collaborate on
                        <strong>%s</strong>.
                    </p>

                    <p>
                        <a href="%s"
                        style="background:#2563eb;color:white;padding:10px 20px;
                        text-decoration:none;border-radius:6px;">
                            Accept Invitation
                        </a>
                    </p>

                    <p>This invitation expires in 7 days.</p>

                </div>
                """.formatted(inviterName, workspaceName, invitationLink);

        sendHtmlEmail(toEmail, subject, body);
    }

    private void sendHtmlEmail(String toEmail,
            String subject,
            String htmlBody) {

        System.out.println("========== BREVO EMAIL ==========");
        System.out.println("To      : " + toEmail);
        System.out.println("Subject : " + subject);

        try {

            Map<String, Object> payload = Map.of(

                    "sender", Map.of(
                            "name", senderName,
                            "email", senderEmail),

                    "to", List.of(
                            Map.of("email", toEmail)),

                    "subject", subject,

                    "htmlContent", htmlBody);

            String response = restClient.post()
                    .uri("https://api.brevo.com/v3/smtp/email")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", brevoApiKey)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            System.out.println("BREVO SUCCESS");
            System.out.println(response);

        } catch (org.springframework.web.client.HttpStatusCodeException ex) {

            System.out.println("========== BREVO ERROR ==========");
            System.out.println("Status : " + ex.getStatusCode());
            System.out.println("Body   : " + ex.getResponseBodyAsString());

        } catch (Exception ex) {

            System.out.println("========== BREVO ERROR ==========");
            ex.printStackTrace();

        }
    }
}