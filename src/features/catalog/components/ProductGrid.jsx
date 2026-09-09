import { useHits } from 'react-instantsearch';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const { items } = useHits(); // ojo: en react-instantsearch v7 es "items", no "hits"

  return (
    <div className="product-grid">
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron productos</p>
          <p className="empty-sub">Prueba con otros términos de búsqueda</p>
        </div>
      ) : (
        items.map((hit) => <ProductCard key={hit.objectID} hit={hit} />)
      )}
    </div>
  );
};

export default ProductGrid;