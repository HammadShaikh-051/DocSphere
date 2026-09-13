import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyWorkspaces, createWorkspace, getWorkspaceById, updateWorkspace, deleteWorkspace } from './workspaceApi';


export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: getMyWorkspaces,
    });
};

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
};

export const useWorkspaceDetail = (workspaceId) => {
    return useQuery({
        queryKey: ['workspaces', workspaceId],
        queryFn: () => getWorkspaceById(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useUpdateWorkspace = (workspaceId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateWorkspace(workspaceId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId] });
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId) => deleteWorkspace(workspaceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
};