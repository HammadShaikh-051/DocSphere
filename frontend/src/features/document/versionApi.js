import api from '../../lib/axios';

export const getDocumentVersions = async (documentId) => {
    const response = await api.get(`/documents/${documentId}/versions`);
    return response.data;
};

export const getDocumentVersion = async (documentId, versionId) => {
    const response = await api.get(`/documents/${documentId}/versions/${versionId}`);
    return response.data;
};

export const restoreDocumentVersion = async (documentId, versionId) => {
    const response = await api.post(`/documents/${documentId}/versions/${versionId}/restore`);
    return response.data;
};
