import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentVersions, getDocumentVersion, restoreDocumentVersion } from './versionApi';

export const useDocumentVersions = (documentId) => {
    return useQuery({
        queryKey: ['versions', documentId],
        queryFn: () => getDocumentVersions(documentId),
        enabled: !!documentId,
    });
};

export const useDocumentVersion = (documentId, versionId) => {
    return useQuery({
        queryKey: ['versions', documentId, versionId],
        queryFn: () => getDocumentVersion(documentId, versionId),
        enabled: !!documentId && !!versionId,
    });
};

export const useRestoreVersion = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (versionId) => restoreDocumentVersion(documentId, versionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', documentId] });
            queryClient.invalidateQueries({ queryKey: ['versions', documentId] });
        },
    });
};
