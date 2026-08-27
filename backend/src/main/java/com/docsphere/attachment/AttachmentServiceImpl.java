package com.docsphere.attachment;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.docsphere.attachment.dto.AttachmentDto;
import com.docsphere.common.exception.BadRequestException;
import com.docsphere.common.exception.ResourceNotFoundException;
import com.docsphere.common.exception.UnauthorizedException;
import com.docsphere.document.Document;
import com.docsphere.document.DocumentRepository;
import com.docsphere.member.WorkspaceMember;
import com.docsphere.member.WorkspaceMemberRepository;
import com.docsphere.member.WorkspaceRole;
import com.docsphere.user.User;
import com.docsphere.user.UserRepository;
import com.docsphere.workspace.Workspace;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService{

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private final AttachmentRepository attachmentRepository;
    private final DocumentRepository documentRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final AttachmentMapper attachmentMapper;
    private final Cloudinary cloudinary;

    @Override
    @Transactional
    public AttachmentDto uploadAttachment(UUID documentId, UUID uploaderId, MultipartFile file) {
        Document document = getDocumentOrThrow(documentId);
        User uploader = getUserOrThrow(uploaderId);

        verifyCanEdit(document.getWorkspace(), uploader);

        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File exceeds the maximum size of 10MB");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "docsphere/documents/" + documentId
                    )
            );

            String fileUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .fileUrl(fileUrl)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .cloudinaryPublicId(publicId)
                    .document(document)
                    .uploadedBy(uploader)
                    .build();

            Attachment savedAttachment = attachmentRepository.save(attachment);

            return attachmentMapper.toDto(savedAttachment);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public List<AttachmentDto> getDocumentAttachments(UUID documentId) {
        Document document = getDocumentOrThrow(documentId);

        return attachmentRepository.findByDocumentOrderByCreatedAtDesc(document).stream()
                .map(attachmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAttachment(UUID attachmentId, UUID requesterId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        User requester = getUserOrThrow(requesterId);

        verifyCanEdit(attachment.getDocument().getWorkspace(), requester);

        try {
            cloudinary.uploader().destroy(attachment.getCloudinaryPublicId(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from storage: " + e.getMessage());
        }

        attachmentRepository.delete(attachment);
    }

    private void verifyCanEdit(Workspace workspace, User user) {
        WorkspaceMember member = memberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this workspace"));

        if (member.getRole() == WorkspaceRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot upload or delete attachments");
        }
    }

    private Document getDocumentOrThrow(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
