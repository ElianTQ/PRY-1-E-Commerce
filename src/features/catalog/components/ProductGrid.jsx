/**
 * Grid de resultados del catálogo.
 *
 * Usa useHits para obtener los productos que Algolia devolvió para la
 * búsqueda y filtros actuales, y los renderiza como tarjetas.
 *
 * Si no hay resultados, muestra un estado vacío con un mensaje.
 */

import { useHits } from 'react-instantsearch';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  // En react-instantsearch v7 la propiedad se llama "items", no "hits".
  const { items } = useHits();

  return (
    <div className="product-grid">
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron productos</p>
          <p className="empty-sub">Prueba con otros términos de búsqueda</p>
        </div>
      ) : (
        // objectID es el identificador único que Algolia asigna a cada hit.
        items.map((hit) => <ProductCard key={hit.objectID} hit={hit} />)
      )}
    </div>
  );
};

export default ProductGrid;