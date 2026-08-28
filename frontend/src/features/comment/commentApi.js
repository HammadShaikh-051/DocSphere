import api from '../../lib/axios';

export const addComment = async (documentId, content) => {
    const response = await api.post(`/documents/${documentId}/comments`, { content });
    return response.data;
};

export const getDocumentComments = async (documentId) => {
    const response = await api.get(`/documents/${documentId}/comments`);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
};