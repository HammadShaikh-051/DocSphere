import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAttachment, getDocumentAttachments, deleteAttachment } from './attachmentApi';

export const useDocumentAttachments = (documentId) => {
    return useQuery({
        queryKey: ['attachments', documentId],
        queryFn: () => getDocumentAttachments(documentId),
        enabled: !!documentId,
    });
};

export const useUploadAttachment = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => uploadAttachment(documentId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attachments', documentId] });
        },
    });
};

export const useDeleteAttachment = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attachmentId) => deleteAttachment(attachmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attachments', documentId] });
        },
    });
};