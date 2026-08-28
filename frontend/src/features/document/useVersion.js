import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentVersions, getDocumentVersion, restoreDocumentVersion, saveDocumentVersion } from './versionApi';

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

/**
 * useSaveVersion
 *
 * Mutation hook for the manual "Save Version" button.
 * Calls POST /api/documents/{documentId}/versions with an optional description.
 *
 * On success: invalidates the versions cache so VersionHistoryPanel
 * refetches and immediately shows the new version at the top of the list.
 *
 * Usage:
 *   const saveVersion = useSaveVersion(documentId);
 *   saveVersion.mutate({ description: 'Fixed intro paragraph' });
 */
export const useSaveVersion = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ description } = {}) => saveDocumentVersion(documentId, description),
        onSuccess: () => {
            // Refresh the version list in VersionHistoryPanel
            queryClient.invalidateQueries({ queryKey: ['versions', documentId] });
        },
    });
};

