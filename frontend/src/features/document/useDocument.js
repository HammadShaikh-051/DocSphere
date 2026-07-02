import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRootDocuments, createDocument, getFolderDocuments, getDocumentById, updateDocument } from './documentApi';


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
            queryClient.invalidateQueries({ queryKey: ['documents', 'root', workspaceId] });
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
            queryClient.invalidateQueries({ queryKey: ['documents', 'folder', folderId] });
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
        },
    });
};