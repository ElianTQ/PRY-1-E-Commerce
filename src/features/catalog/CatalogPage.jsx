import { useState, useEffect } from 'react';
import { searchClient, indexName } from '../../config/algolia';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    b2c: false,
    b2b: false
  });

  // Función para buscar productos en Algolia
  const fetchProducts = async (query = '', filters = {}) => {
    setLoading(true);
    try {
      const index = searchClient.initIndex(indexName);
      
      // Construir filtros
      const filterConditions = [];
      if (filters.category) filterConditions.push(`category:"${filters.category}"`);
      if (filters.brand) filterConditions.push(`brand:"${filters.brand}"`);
      if (filters.b2c) filterConditions.push('b2c:true');
      if (filters.b2b) filterConditions.push('b2b:true');
      
      const filterString = filterConditions.join(' AND ');
      
      const response = await index.search(query, {
        hitsPerPage: 12,
        ...(filterString && { filters: filterString })
      });
      
      setProducts(response.hits);
    } catch (error) {
      console.error('Error buscando productos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos iniciales
  useEffect(() => {
    fetchProducts();
  }, []);

  // Buscar cuando cambia el query o filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery, filters);
    }, 300); // Debounce para search-as-you-type

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  // Manejadores
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Datos para depuración (puedes eliminar esto después)
  console.log('Productos cargados:', products);

  return (
    <div>
      <div>Catálogo (en construcción)</div>
      
      {/* Estos son inputs ocultos solo para la lógica, no afectan lo visual */}
      <input 
        type="text" 
        value={searchQuery}
        onChange={handleSearch}
        style={{ display: 'none' }}
        data-testid="search-input"
      />
      
      <div style={{ display: 'none' }}>
        {/* Filtros ocultos para la lógica */}
        <select 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Electrónicos">Electrónicos</option>
          <option value="Audio">Audio</option>
          <option value="Periféricos">Periféricos</option>
        </select>
        
        <select 
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <option value="">Todas</option>
          <option value="TechPro">TechPro</option>
          <option value="Samsung">Samsung</option>
          <option value="AudioTech">AudioTech</option>
        </select>
        
        <input 
          type="checkbox" 
          checked={filters.b2c}
          onChange={(e) => handleFilterChange('b2c', e.target.checked)}
        />
        <input 
          type="checkbox" 
          checked={filters.b2b}
          onChange={(e) => handleFilterChange('b2b', e.target.checked)}
        />
      </div>
      
      {/* Estado de carga oculto */}
      {loading && <div style={{ display: 'none' }}>Cargando...</div>}
      
      {/* Datos disponibles para usar en el futuro */}
      <div style={{ display: 'none' }}>
        {products.map(product => (
          <div key={product.objectID} data-product-id={product.id}>
            {product.name}
          </div>
        ))}
      </div>
    </div>
  );
}