import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkspaceMembers, updateMemberRole, removeMember } from './memberApi';

export const useWorkspaceMembers = (workspaceId) => {
    return useQuery({
        queryKey: ['members', workspaceId],
        queryFn: () => getWorkspaceMembers(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useUpdateMemberRole = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ memberUserId, role }) => updateMemberRole(workspaceId, memberUserId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', workspaceId] });
        },
    });
};

export const useRemoveMember = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberUserId) => removeMember(workspaceId, memberUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', workspaceId] });
        },
    });
};