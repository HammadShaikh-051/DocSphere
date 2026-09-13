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

/**
 * POST /api/documents/{documentId}/versions
 *
 * Manually saves a new version of the current document state.
 * description is optional — send null or empty string to omit it.
 *
 * The backend reads the current document content from the database,
 * so we do NOT send content from the frontend. This ensures the version
 * always reflects what was actually autosaved, not what might be
 * pending in the editor buffer.
 */
export const saveDocumentVersion = async (documentId, description) => {
    const response = await api.post(`/documents/${documentId}/versions`, {
        description: description || null,
    });
    return response.data;
};

