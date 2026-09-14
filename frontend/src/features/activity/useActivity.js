import { useQuery } from '@tanstack/react-query';
import { getWorkspaceActivity, getAllWorkspacesRecentActivity } from './activityApi';

export const useWorkspaceActivity = (workspaceId) => {
    return useQuery({
        queryKey: ['activity', workspaceId],
        queryFn: () => getWorkspaceActivity(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useAllWorkspacesActivity = () => {
    return useQuery({
        queryKey: ['activity', 'all'],
        queryFn: getAllWorkspacesRecentActivity,
    });
};