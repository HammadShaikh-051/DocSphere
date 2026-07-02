import api from '../../lib/axios';

export const getMyWorkspaces = async () => {
    const response = await api.get('/workspaces');
    return response.data;
};

export const createWorkspace = async (workspaceData) => {
    const response = await api.post('/workspaces', workspaceData);
    return response.data;
};

export const getWorkspaceById = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
};

export const updateWorkspace = async (workspaceId, data) => {
    const response = await api.put(`/workspaces/${workspaceId}`, data);
    return response.data;
};

export const deleteWorkspace = async (workspaceId) => {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
};