import api from '../../lib/axios';

export const uploadAttachment = async (documentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/documents/${documentId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getDocumentAttachments = async (documentId) => {
    const response = await api.get(`/documents/${documentId}/attachments`);
    return response.data;
};

export const deleteAttachment = async (attachmentId) => {
    const response = await api.delete(`/attachments/${attachmentId}`);
    return response.data;
};