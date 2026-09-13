import api from '../../lib/axios';

export const searchWorkspace = async (workspaceId, query) => {
    const response = await api.get(`/workspaces/${workspaceId}/search`, {
        params: { query },
    });
    return response.data;
};

export const searchGlobal = async (query) => {
    const response = await api.get(`/search`, {
        params: { query },
    });
    return response.data;
};