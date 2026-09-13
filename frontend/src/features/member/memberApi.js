import api from '../../lib/axios';

export const getWorkspaceMembers = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
};

export const updateMemberRole = async (workspaceId, memberUserId, role) => {
    const response = await api.put(
        `/workspaces/${workspaceId}/members/${memberUserId}/role`,
        { role }
    );
    return response.data;
};

export const removeMember = async (workspaceId, memberUserId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberUserId}`);
    return response.data;
};