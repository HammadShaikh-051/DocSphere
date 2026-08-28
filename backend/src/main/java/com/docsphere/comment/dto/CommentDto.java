package com.docsphere.comment.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDto {
    private UUID id;
    private String content;
    private UUID documentId;
    private UUID authorId;
    private String authorName;
    private LocalDateTime createdAt;
}
