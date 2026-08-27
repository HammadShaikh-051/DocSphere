import { useQuery } from '@tanstack/react-query';
import { getWorkspaceActivity } from './activityApi';

export const useWorkspaceActivity = (workspaceId) => {
    return useQuery({
        queryKey: ['activity', workspaceId],
        queryFn: () => getWorkspaceActivity(workspaceId),
        enabled: !!workspaceId,
    });
};