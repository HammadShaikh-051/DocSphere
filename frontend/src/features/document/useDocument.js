import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getRootDocuments,
    createDocument,
    getFolderDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getRecentDocumentsAcrossWorkspaces,
} from './documentApi';

export const useRecentDocumentsAcrossWorkspaces = () => {
    return useQuery({
        queryKey: ['documents', 'recent'],
        queryFn: getRecentDocumentsAcrossWorkspaces,
    });
};

export const useRootDocuments = (workspaceId) => {
    return useQuery({
        queryKey: ['documents', 'root', workspaceId],
        queryFn: () => getRootDocuments(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreateDocument = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentData) => createDocument(workspaceId, documentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

export const useFolderDocuments = (folderId) => {
    return useQuery({
        queryKey: ['documents', 'folder', folderId],
        queryFn: () => getFolderDocuments(folderId),
        enabled: !!folderId,
    });
};

export const useCreateDocumentInFolder = (folderId, workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentData) =>
            createDocument(workspaceId, { ...documentData, folderId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

export const useDocumentDetail = (documentId) => {
    return useQuery({
        queryKey: ['documents', documentId],
        queryFn: () => getDocumentById(documentId),
        enabled: !!documentId,
    });
};

export const useUpdateDocument = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentData) => updateDocument(documentId, documentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', documentId] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId) => deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

export const useRenameDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ documentId, title }) => updateDocument(documentId, { title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

import { restoreDocument, permanentlyDeleteDocument, getTrashedDocuments } from './documentApi';

export const useTrashedDocuments = (workspaceId) => {
    return useQuery({
        queryKey: ['documents', 'trash', workspaceId],
        queryFn: () => getTrashedDocuments(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useRestoreDocument = (workspaceId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (documentId) => restoreDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};

export const usePermanentlyDeleteDocument = (workspaceId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (documentId) => permanentlyDeleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', 'trash', workspaceId] });
            queryClient.invalidateQueries({ queryKey: ['activity'] });
        },
    });
};