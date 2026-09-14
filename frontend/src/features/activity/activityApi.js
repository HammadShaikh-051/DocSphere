import api from '../../lib/axios';

export const getWorkspaceActivity = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/activity`);
    return response.data;
};

export const getAllWorkspacesRecentActivity = async () => {
    const response = await api.get('/activity/recent');
    return response.data;
};