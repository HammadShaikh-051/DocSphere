import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRootFolders, createFolder, getFolderById, getSubFolders } from './folderApi';

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