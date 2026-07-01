import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchService } from '../../services/searchService';
import { Search, Clear } from '@mui/icons-material';

export default function SearchBar({
  placeholder = 'Search concepts, categories, technologies...',
  onSearch,
  initialValue = '',
}) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await searchService.autocomplete(debouncedQuery);
        // Autocomplete API usually returns an array of strings or simple items
        setSuggestions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch autocomplete suggestions', err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    const val = typeof suggestion === 'string' ? suggestion : (suggestion.prompt || suggestion.metadata?.concept || '');
    setQuery(val);
    setShowDropdown(false);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search fontSize="small" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="caia-input pl-10 pr-10 py-2.5 text-sm"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-500 transition-colors"
          >
            <Clear fontSize="small" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1.5 bg-slate-800 border border-amber-500/15 rounded-xl shadow-2xl divide-y divide-slate-700/40 max-h-60 overflow-y-auto animate-fade-in">
          {suggestions.map((item, idx) => {
            const displayVal = typeof item === 'string' 
              ? item 
              : (item.metadata?.concept || item.prompt || '');
            const displayCategory = item.metadata?.category || '';

            return (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(item)}
                className="px-4 py-2.5 hover:bg-slate-700/50 cursor-pointer flex items-center justify-between text-slate-300 hover:text-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search fontSize="small" className="text-slate-500 flex-shrink-0" />
                  <span className="truncate font-medium">{displayVal}</span>
                </div>
                {displayCategory && (
                  <span className="text-[10px] font-semibold tracking-wider text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                    {displayCategory}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

