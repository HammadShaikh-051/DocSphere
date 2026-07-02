import api from '../../lib/axios';

export const getWorkspaceInvitations = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/invitations`);
    return response.data;
};

export const sendInvitation = async (workspaceId, invitationData) => {
    const response = await api.post(`/workspaces/${workspaceId}/invitations`, invitationData);
    return response.data;
};

export const cancelInvitation = async (invitationId) => {
    const response = await api.delete(`/invitations/${invitationId}`);
    return response.data;
};

export const getMyPendingInvitations = async () => {
    const response = await api.get('/invitations/me');
    return response.data;
};

export const acceptInvitation = async (token) => {
    const response = await api.post(`/invitations/accept?token=${token}`);
    return response.data;
};