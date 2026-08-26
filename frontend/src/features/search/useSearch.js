import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchWorkspace, searchGlobal } from './searchApi';

export const useWorkspaceSearch = (workspaceId, rawQuery) => {
    const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(rawQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [rawQuery]);

    return useQuery({
        queryKey: ['search', workspaceId, debouncedQuery],
        queryFn: () => searchWorkspace(workspaceId, debouncedQuery),
        enabled: !!workspaceId && debouncedQuery.trim().length > 0,
    });
};

export const useGlobalSearch = (rawQuery) => {
    const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(rawQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [rawQuery]);

    return useQuery({
        queryKey: ['search', 'global', debouncedQuery],
        queryFn: () => searchGlobal(debouncedQuery),
        enabled: debouncedQuery.trim().length > 0,
    });
};