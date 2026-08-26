package com.docsphere.search;

import com.docsphere.common.ApiResponse;
import com.docsphere.search.dto.SearchResultDto;
import com.docsphere.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/api/workspaces/{workspaceId}/search")
    public ResponseEntity<ApiResponse<List<SearchResultDto>>> search(
            @PathVariable UUID workspaceId,
            @RequestParam String query
    ) {
        List<SearchResultDto> results = searchService.search(workspaceId, query);
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", results));
    }

    @GetMapping("/api/search")
    public ResponseEntity<ApiResponse<List<SearchResultDto>>> globalSearch(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam String query
    ) {
        List<SearchResultDto> results = searchService.globalSearch(
                currentUser.getUser().getId(), query
        );
        return ResponseEntity.ok(ApiResponse.success("Global search results fetched successfully", results));
    }
}