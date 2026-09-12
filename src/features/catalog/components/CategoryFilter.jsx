/**
 * Lista de filtros por atributo (marca, categoría, etc).
 *
 * Usa useRefinementList de react-instantsearch, que devuelve:
 *   - items: valores disponibles del atributo con su conteo y si
 *     están activos (isRefined).
 *   - refine: función para activar/desactivar un valor.
 *
 * El atributo a filtrar llega por prop, así el mismo componente
 * sirve para marca y categoría.
 */

import { useRefinementList } from 'react-instantsearch';

const CategoryFilter = ({ attribute }) => {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <ul className="category-list">
      {items.map((item) => (
        <li key={item.label}>
          <label>
            {/* refine(item.value) alterna el filtro: si estaba activo lo
                quita, y si no, lo aplica. */}
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
            />
            {item.label} <span className="count">({item.count})</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default CategoryFilter;