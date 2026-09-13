import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getWorkspaceInvitations,
    sendInvitation,
    cancelInvitation,
    getMyPendingInvitations,
    acceptInvitation,
} from './invitationApi';

export const useWorkspaceInvitations = (workspaceId) => {
    return useQuery({
        queryKey: ['invitations', workspaceId],
        queryFn: () => getWorkspaceInvitations(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useSendInvitation = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationData) => sendInvitation(workspaceId, invitationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
        },
    });
};

export const useCancelInvitation = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId) => cancelInvitation(invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
        },
    });
};

export const useMyPendingInvitations = () => {
    return useQuery({
        queryKey: ['invitations', 'me'],
        queryFn: getMyPendingInvitations,
    });
};

export const useAcceptInvitation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (token) => acceptInvitation(token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
};