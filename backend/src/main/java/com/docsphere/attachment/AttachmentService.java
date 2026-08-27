package com.docsphere.attachment;

import com.docsphere.attachment.dto.AttachmentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface AttachmentService {
    AttachmentDto uploadAttachment(UUID documentId, UUID uploaderId, MultipartFile file);

    List<AttachmentDto> getDocumentAttachments(UUID documentId);

    void deleteAttachment(UUID attachmentId, UUID requesterId);
}
