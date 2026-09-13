import api from '../../lib/axios';

export const getWorkspaceActivity = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/activity`);
    return response.data;
};