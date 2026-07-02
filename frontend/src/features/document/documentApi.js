import api from '../../lib/axios';

export const getRootDocuments = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/documents/root`);
    return response.data;
};

export const createDocument = async (workspaceId, documentData) => {
    const response = await api.post(`/workspaces/${workspaceId}/documents`, documentData);
    return response.data;
};

export const getFolderDocuments = async (folderId) => {
    const response = await api.get(`/folders/${folderId}/documents`);
    return response.data;
};

export const getDocumentById = async (documentId) => {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
};

export const updateDocument = async (documentId, documentData) => {
    const response = await api.put(`/documents/${documentId}`, documentData);
    return response.data;
};