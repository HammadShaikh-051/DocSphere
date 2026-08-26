package com.docsphere.config;

import com.docsphere.document.DocumentRepository;
import com.docsphere.folder.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TrashCleanupJob {

    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;

    @Scheduled(cron = "0 0 3 * * *")
    public void purgeExpiredTrash() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        documentRepository.deleteAll(documentRepository.findByDeletedAtBefore(cutoff));
        folderRepository.deleteAll(folderRepository.findByDeletedAtBefore(cutoff));
    }
}