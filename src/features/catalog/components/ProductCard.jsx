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

const ProductCard = ({ hit }) => (
  <div className="product-card">
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

export default ProductCard;