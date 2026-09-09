import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { searchClient, indexName } from '../../config/algolia';
import productsData from '../../../data/products.json';

const formatCRC = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar primero con Algolia
        const index = searchClient.initIndex(indexName);
        const response = await index.search('', {
          filters: `objectID:"${id}"`,
          hitsPerPage: 1
        });

        if (response.hits.length > 0) {
          setProduct(response.hits[0]);
          setSelectedImageIndex(0);
        } else {
          // Fallback a datos locales
          loadProductFromLocal(id);
        }
      } catch (error) {
        console.error('Error fetching from Algolia:', error);
        // Fallback a datos locales
        loadProductFromLocal(id);
      } finally {
        setLoading(false);
      }
    };

    const loadProductFromLocal = (productId) => {
      try {
        const products = productsData.products || productsData;
        const found = products.find(p => p.id === productId);
        
        if (found) {
          setProduct(found);
          setSelectedImageIndex(0);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        console.error('Error loading product locally:', err);
        setError('Error al cargar el producto');
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const pageQuery = page ? `?page=${page}` : '';
    navigate(`/${pageQuery}`);
  };

  if (loading) {
    return <div className="product-detail-loading">Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <p>{error}</p>
        <button onClick={handleBack}>Volver al catálogo</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <p>Producto no encontrado</p>
        <button onClick={handleBack}>Volver al catálogo</button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || null;

  return (
    <div className="main-content">
      <button className="back-button" onClick={handleBack}>← Volver al catálogo</button>
      
      <div className="product-detail-container">
        {/* Galería de imágenes */}
        <div className="product-gallery">
          {currentImage ? (
            <div className="main-image-container">
              <img src={currentImage} alt={product.name} className="main-image" />
            </div>
          ) : (
            <div className="no-image-large">Sin imagen</div>
          )}
          
          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-brand">{product.brand}</p>
            {product.model && <p className="product-model">Modelo: {product.model}</p>}
          </div>

          {/* Precio y disponibilidad */}
          <div className="price-section">
            <p className="product-price">{formatCRC(product.price)}</p>
            <div className="availability">
              <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
              </span>
            </div>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="rating-section">
              <span className="rating-stars">★ {product.rating.toFixed(1)}</span>
              {product.reviews && <span className="review-count">({product.reviews} reseñas)</span>}
            </div>
          )}

          {/* Descripción */}
          {product.description && (
            <div className="description-section">
              <p className="product-description">{product.description}</p>
            </div>
          )}

          {/* Información categoría */}
          <div className="info-grid">
            {product.category && (
              <div className="info-item">
                <span className="info-label">Categoría</span>
                <span className="info-value">{product.category}</span>
              </div>
            )}
            {product.sku && (
              <div className="info-item">
                <span className="info-label">SKU</span>
                <span className="info-value">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Características */}
          {product.features && product.features.length > 0 && (
            <div className="features-section">
              <h3>Características principales</h3>
              <ul className="features-list">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Especificaciones técnicas */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="specifications-section">
          <h2>Especificaciones técnicas</h2>
          <div className="specifications-grid">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="spec-item">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="additional-info-section">
        {product.warranty && (
          <div className="info-box">
            <h3>Garantía</h3>
            <p>{product.warranty}</p>
          </div>
        )}
        
        {product.multi_sede && (
          <div className="info-box">
            <h3>Disponibilidad en sedes</h3>
            <ul>
              {Object.entries(product.multi_sede).map(([sede, qty]) => (
                <li key={sede}>{sede.charAt(0).toUpperCase() + sede.slice(1)}: {qty} unidades</li>
              ))}
            </ul>
          </div>
        )}
        
        {product.b2b_info && (
          <div className="info-box">
            <h3>Información B2B</h3>
            <p>Precio mayorista: {formatCRC(product.b2b_info.wholesale_price)}</p>
            <p>Pedido mínimo: {product.b2b_info.minimum_order} unidades</p>
            {product.b2b_info.bulk_discount && <p>✓ Descuentos por volumen disponibles</p>}
          </div>
        )}
      </div>
    </div>
  );
}