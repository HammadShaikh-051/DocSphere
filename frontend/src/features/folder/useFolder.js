import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRootFolders, createFolder, getFolderById, getSubFolders, deleteFolder, renameFolder } from './folderApi';

export const useRootFolders = (workspaceId) => {
    return useQuery({
        queryKey: ['folders', 'root', workspaceId],
        queryFn: () => getRootFolders(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreateFolder = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderData) => createFolder(workspaceId, folderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', 'root', workspaceId] });
        },
    });
};

export const useFolderDetail = (folderId) => {
    return useQuery({
        queryKey: ['folders', folderId],
        queryFn: () => getFolderById(folderId),
        enabled: !!folderId,
    });
};

export const useSubFolders = (folderId) => {
    return useQuery({
        queryKey: ['folders', 'subfolders', folderId],
        queryFn: () => getSubFolders(folderId),
        enabled: !!folderId,
    });
};

export const useCreateSubFolder = (folderId, workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderData) =>
            createFolder(workspaceId, { ...folderData, parentFolderId: folderId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', 'subfolders', folderId] });
        },
    });
};

export const useDeleteFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderId) =>
            deleteFolder(folderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};

export const useRenameFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ folderId, name }) => renameFolder(folderId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};

import { restoreFolder, permanentlyDeleteFolder, getTrashedFolders } from './folderApi';

export const useTrashedFolders = (workspaceId) => {
    return useQuery({
        queryKey: ['folders', 'trash', workspaceId],
        queryFn: () => getTrashedFolders(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useRestoreFolder = (workspaceId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (folderId) => restoreFolder(folderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};

export const usePermanentlyDeleteFolder = (workspaceId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (folderId) => permanentlyDeleteFolder(folderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', 'trash', workspaceId] });
        },
    });
};