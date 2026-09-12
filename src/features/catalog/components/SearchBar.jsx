/**
 * Barra de búsqueda del catálogo.
 *
 * Usa useSearchBox de react-instantsearch, que expone:
 *   - query: texto actual de búsqueda.
 *   - refine: actualiza el query en Algolia (con debounce interno).
 *
 * Algolia aplica la búsqueda en cada pulsación de tecla sin que
 * tengamos que gestionar timers manualmente.
 */

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