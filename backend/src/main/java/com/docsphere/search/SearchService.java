package com.docsphere.search;

import com.docsphere.search.dto.SearchResultDto;

import java.util.List;
import java.util.UUID;

public interface SearchService {
    List<SearchResultDto> search(UUID workspaceId, String query);
    List<SearchResultDto> globalSearch(UUID userId, String query);
}