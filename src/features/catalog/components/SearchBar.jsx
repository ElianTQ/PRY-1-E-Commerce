import { useSearchBox } from 'react-instantsearch';

const SearchBar = () => {
  const { query, refine } = useSearchBox();

  return (
    <div className="search-wrapper">
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Buscar productos..."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;