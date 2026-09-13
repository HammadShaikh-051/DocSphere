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

    const handleResultClick = (result) => {
        setIsOpen(false);
        setQuery('');
        if (result.type === 'FOLDER') {
            navigate(`/workspaces/${result.workspaceId}/folders/${result.id}`);
        } else {
            navigate(`/documents/${result.id}`);
        }
    };

    const placeholder = isGlobal ? 'Search all workspaces…' : 'Search this workspace…';

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '320px' }}>
            {/* Input */}
            <div style={{ position: 'relative' }}>
                {isGlobal
                    ? <Globe size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    : <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                }
                <input
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="ds-input"
                    style={{ paddingLeft: '32px', paddingRight: query ? '28px' : '10px', width: '100%' }}
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        style={{
                            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && query.trim().length > 0 && (
                <div
                    style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        maxHeight: '400px', overflowY: 'auto', zIndex: 50,
                    }}
                >
                    {isLoading ? (
                        <p style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>Searching…</p>
                    ) : rawResults.length === 0 ? (
                        <p style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>No results found.</p>
                    ) : isGlobal ? (
                        // Global: grouped by workspace with sticky headers
                        Object.entries(groupedResults).map(([wsId, group]) => (
                            <div key={wsId}>
                                <div style={{
                                    padding: '6px 12px 5px',
                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                                    color: 'var(--text-muted)', textTransform: 'uppercase',
                                    background: 'var(--bg)', borderBottom: '1px solid var(--border)',
                                    position: 'sticky', top: 0, zIndex: 1,
                                }}>
                                    {group.workspaceName}
                                </div>
                                {group.items.map((result) => (
                                    <ResultRow key={`${result.type}-${result.id}`} result={result} onClick={handleResultClick} showWorkspace={false} />
                                ))}
                            </div>
                        ))
                    ) : (
                        // Workspace: flat list
                        rawResults.map((result) => (
                            <ResultRow key={`${result.type}-${result.id}`} result={result} onClick={handleResultClick} showWorkspace={false} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function ResultRow({ result, onClick }) {
    // Build a display path: strip the workspace name prefix for workspace-scoped search
    // The backend always includes workspace name in path, e.g. "Assignments › Backend › Controllers"
    // We always show the full path as a breadcrumb
    const pathParts = result.path ? result.path.split(' › ') : [];

    return (
        <div
            onClick={() => onClick(result)}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                transition: 'background-color 0.12s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            {/* Icon */}
            <div style={{ flexShrink: 0, marginTop: '1px' }}>
                {result.type === 'FOLDER'
                    ? <Folder size={15} style={{ color: 'var(--g-yellow)' }} />
                    : <FileText size={15} style={{ color: 'var(--g-blue)' }} />
                }
            </div>

            {/* Name + breadcrumb path */}
            <div style={{ minWidth: 0 }}>
                <div style={{
                    fontSize: '13px', fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {result.name}
                </div>
                {pathParts.length > 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', flexWrap: 'nowrap',
                        gap: '2px', marginTop: '2px', overflow: 'hidden',
                    }}>
                        {pathParts.map((part, i) => (
                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: i < pathParts.length - 1 ? 1 : 0 }}>
                                <span style={{
                                    fontSize: '11px', color: 'var(--text-muted)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    maxWidth: i === 0 ? '90px' : '70px',
                                }}>
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
        </div>
    );
}

export default SearchBar;