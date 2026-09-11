/**
 * Punto único de importación de estilos.
 *
 * Se importa una sola vez desde App.jsx y desde ahí quedan disponibles
 * todas las clases CSS del proyecto, sin necesidad de importar cada
 * archivo .css en su componente correspondiente.
 *
 * Nota: los estilos globales (index.css) se importan aparte en main.jsx.
 */

/* Layout general del catálogo */
import './catalog.css';
import './components/Header.css';

/* Componentes del catálogo */
import './components/SearchBar.css';
import './components/FiltersSidebar.css';
import './components/PriceSlider.css';
import './components/ProductGrid.css';
import './components/ProductCard.css';
import './components/Pagination.css';

/* Páginas */
import './pages/ProductDetail.css';

export default {};