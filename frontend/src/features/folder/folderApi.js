import api from '../../lib/axios';

export const getRootFolders = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/folders/root`);
    return response.data;
};

export const createFolder = async (workspaceId, folderData) => {
    const response = await api.post(`/workspaces/${workspaceId}/folders`, folderData);
    return response.data;
};

export const getFolderById = async (folderId) => {
    const response = await api.get(`/folders/${folderId}`);
    return response.data;
};

export const getSubFolders = async (folderId) => {
    const response = await api.get(`/folders/${folderId}/subfolders`);
    return response.data;
};