import { useNavigate } from 'react-router-dom';
import { useInstantSearch } from 'react-instantsearch';

const formatCRC = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const getCategoryLabel = (hit) => {
  if (Array.isArray(hit.categories) && hit.categories.length > 0) {
    return hit.categories.join(', ');
  }
  return hit.category || 'Sin categoría';
};

const ProductCard = ({ hit }) => {
  const navigate = useNavigate();
  const { uiState } = useInstantSearch();

  const handleProductClick = () => {
    // Pasar la página actual como parámetro en la URL
    const currentPage = uiState?.['grupo-06_products']?.page || 0;
    navigate(`/producto/${hit.id}?page=${currentPage}`);
  };

  return (
    <div className="product-card" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      {hit.images?.[0] ? (
        <img src={hit.images[0]} alt={hit.name} loading="lazy" />
      ) : (
        <div className="no-image">Sin imagen</div>
      )}
      <div className="product-info">
        <h3>{hit.name}</h3>
        <p className="category">{getCategoryLabel(hit)}</p>
        <p className="price">{formatCRC(hit.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;