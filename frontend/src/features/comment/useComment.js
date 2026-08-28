import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment, getDocumentComments, deleteComment } from './commentApi';

export const useDocumentComments = (documentId) => {
    return useQuery({
        queryKey: ['comments', documentId],
        queryFn: () => getDocumentComments(documentId),
        enabled: !!documentId,
    });
};

export const useAddComment = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content) => addComment(documentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
        },
    });
};

export const useDeleteComment = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
        },
    });
};