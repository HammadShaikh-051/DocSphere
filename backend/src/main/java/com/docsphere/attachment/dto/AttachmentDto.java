package com.docsphere.attachment.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentDto {
    private UUID id;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private long fileSize;
    private UUID documentId;
    private String uploadedByName;
    private LocalDateTime createdAt;
}
