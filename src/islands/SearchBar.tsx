import { useState, useRef, useCallback, useEffect, type FormEvent } from 'react';
import type { SearchResult, Politician } from '@lib/types';

// In production, this would call /api/search. For now, inline mock.
const quickTags = ['PT', 'PL', 'MDB', 'UNIÃO', 'SP', 'RJ', 'MG'];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      setQuery(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => performSearch(value), 300);
    },
    [performSearch]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleTag = (tag: string) => {
    setQuery(tag);
    window.location.href = `/busca?q=${encodeURIComponent(tag)}`;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  const chamberLabel = (chamber: string) =>
    chamber === 'camara' ? 'Dep. Federal' : 'Senador(a)';

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Nome, partido ou estado — ex: 'PT-SP'"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="search-btn">
          Buscar
        </button>

        {showDropdown && results.length > 0 && (
          <div className="search-dropdown" ref={dropdownRef}>
            {results.slice(0, 6).map((r) => (
              <a
                key={r.politician.id}
                className="search-dropdown__item"
                href={`/politico/${r.politician.chamber}/${r.politician.id}`}
              >
                <div className="search-dropdown__avatar">
                  {r.politician.photoUrl ? (
                    <img src={r.politician.photoUrl} alt="" />
                  ) : (
                    <span>{getInitials(r.politician.name)}</span>
                  )}
                </div>
                <div>
                  <div className="search-dropdown__name">{r.politician.name}</div>
                  <div className="search-dropdown__meta">
                    {r.politician.party} · {r.politician.state} · {chamberLabel(r.politician.chamber)}
                  </div>
                </div>
              </a>
            ))}
            {results.length > 6 && (
              <a className="search-dropdown__more" href={`/busca?q=${encodeURIComponent(query)}`}>
                Ver todos os {results.length} resultados →
              </a>
            )}
          </div>
        )}

        {loading && <div className="search-loading" />}
      </form>

      <div className="search-tags">
        {quickTags.map((tag) => (
          <button key={tag} className="search-tag" onClick={() => handleTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
