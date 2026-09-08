import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchClient, indexName } from '../config/algolia';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const index = searchClient.initIndex(indexName);
        const response = await index.search('', {
          filters: `id:"${id}"`,
          hitsPerPage: 1
        });

        if (response.hits.length > 0) {
          setProduct(response.hits[0]);
        } else {
          setError('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Datos para depuración
  console.log('Producto cargado:', product);

  return (
    <div>
      <div>Detalle de producto (en construcción)</div>
      
      {/* Estado de carga oculto */}
      {loading && <div style={{ display: 'none' }}>Cargando...</div>}
      
      {/* Error oculto */}
      {error && <div style={{ display: 'none' }}>Error: {error}</div>}
      
      {/* Datos del producto disponibles */}
      {product && (
        <div style={{ display: 'none' }} data-product-id={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Precio: ₡{product.price}</p>
          <p>Categoría: {product.category}</p>
          <p>Marca: {product.brand}</p>
          <p>Stock: {product.stock}</p>
          <p>Rating: {product.rating}</p>
          <p>B2C: {product.b2c ? 'Sí' : 'No'}</p>
          <p>B2B: {product.b2b ? 'Sí' : 'No'}</p>
          <p>Sedes: {product.multiSede?.join(', ')}</p>
          {product.specifications && (
            <div>
              <h3>Especificaciones</h3>
              {Object.entries(product.specifications).map(([key, value]) => (
                <p key={key}>{key}: {value}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}