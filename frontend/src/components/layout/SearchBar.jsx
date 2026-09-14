import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Folder, FileText, X, Globe, ChevronRight } from 'lucide-react';
import { useWorkspaceSearch, useGlobalSearch } from '../../features/search/useSearch';

function SearchBar() {
    const { workspaceId } = useParams();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const isGlobal = !workspaceId;

    const { data: wsData, isLoading: wsLoading } = useWorkspaceSearch(
        isGlobal ? null : workspaceId,
        query
    );
    const { data: globalData, isLoading: globalLoading } = useGlobalSearch(
        isGlobal ? query : ''
    );

    const isLoading = isGlobal ? globalLoading : wsLoading;
    const rawResults = isGlobal ? (globalData?.data || []) : (wsData?.data || []);

    // Group by workspace only in global mode
    const groupedResults = isGlobal
        ? rawResults.reduce((acc, result) => {
              const key = result.workspaceId;
              if (!acc[key]) acc[key] = { workspaceName: result.workspaceName, items: [] };
              acc[key].items.push(result);
              return acc;
          }, {})
        : null;

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Global shortcut Ctrl+K / Cmd+K to focus search ──
    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleResultClick = (result) => {
        setIsOpen(false);
        setQuery('');
        if (result.type === 'FOLDER') {
            navigate(`/workspaces/${result.workspaceId}/folders/${result.id}`);
        } else {
            navigate(`/documents/${result.id}`);
        }
    };

    const placeholder = isGlobal ? 'Search all workspaces…' : 'Search workspace…';

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            {/* Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {isGlobal ? (
                    <Globe
                        size={14}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            color: 'var(--text-muted)',
                            pointerEvents: 'none',
                        }}
                    />
                ) : (
                    <Search
                        size={14}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            color: 'var(--text-muted)',
                            pointerEvents: 'none',
                        }}
                    />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="ds-input"
                    style={{
                        paddingLeft: '34px',
                        paddingRight: query ? '28px' : '48px',
                        fontSize: '13px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-2)',
                        borderColor: 'var(--border)',
                    }}
                />

                {query ? (
                    <button
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px',
                            borderRadius: '4px',
                        }}
                    >
                        <X size={13} />
                    </button>
                ) : (
                    <kbd
                        style={{
                            position: 'absolute',
                            right: '8px',
                            fontSize: '10.5px',
                            fontFamily: 'inherit',
                            fontWeight: 600,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--surface-3)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                            pointerEvents: 'none',
                            lineHeight: 1,
                        }}
                    >
                        ⌘K
                    </kbd>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && query.trim().length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        maxHeight: '380px',
                        overflowY: 'auto',
                        zIndex: 70,
                    }}
                >
                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            <div className="ds-spinner" style={{ width: '16px', height: '16px' }} />
                            <span>Searching…</span>
                        </div>
                    ) : rawResults.length === 0 ? (
                        <p style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            No matching items found.
                        </p>
                    ) : isGlobal ? (
                        // Global: grouped by workspace with sticky headers
                        Object.entries(groupedResults).map(([wsId, group]) => (
                            <div key={wsId}>
                                <div
                                    style={{
                                        padding: '7px 14px',
                                        fontSize: '10.5px',
                                        fontWeight: 700,
                                        letterSpacing: '0.06em',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        background: 'var(--surface-2)',
                                        borderBottom: '1px solid var(--border)',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    {group.workspaceName}
                                </div>
                                {group.items.map((result) => (
                                    <ResultRow
                                        key={`${result.type}-${result.id}`}
                                        result={result}
                                        onClick={handleResultClick}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        // Workspace: flat list
                        rawResults.map((result) => (
                            <ResultRow
                                key={`${result.type}-${result.id}`}
                                result={result}
                                onClick={handleResultClick}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function ResultRow({ result, onClick }) {
    const pathParts = result.path ? result.path.split(' › ') : [];
    const isFolder = result.type === 'FOLDER';

    return (
        <div
            onClick={() => onClick(result)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
            {/* Icon */}
            <div
                style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: isFolder ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {isFolder ? (
                    <Folder size={14} style={{ color: 'var(--g-yellow)' }} />
                ) : (
                    <FileText size={14} style={{ color: 'var(--g-blue)' }} />
                )}
            </div>

            {/* Name + breadcrumb path */}
            <div style={{ minWidth: 0, flex: 1 }}>
                <div
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {result.name}
                </div>
                {pathParts.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                            gap: '2px',
                            marginTop: '2px',
                            overflow: 'hidden',
                        }}
                    >
                        {pathParts.map((part, i) => (
                            <span
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    flexShrink: i < pathParts.length - 1 ? 1 : 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: i === 0 ? '90px' : '75px',
                                    }}
                                >
                                    {part}
                                </span>
                                {i < pathParts.length - 1 && (
                                    <ChevronRight size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Type badge */}
            <span
                style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--surface-3)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                }}
            >
                {isFolder ? 'Folder' : 'Doc'}
            </span>
        </div>
    );
}

export default SearchBar;