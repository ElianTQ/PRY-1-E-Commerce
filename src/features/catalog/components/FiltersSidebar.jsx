/**
 * Panel lateral de filtros del catálogo.
 *
 * Agrupa los filtros de precio, marca y categoría.
 * En móvil el panel tiene scroll interno; cuando queda contenido
 * oculto debajo se muestra un aviso "Desliza para ver más filtros"
 * que desaparece al llegar al final.
 */

import { useRef, useState, useEffect } from 'react';
import CategoryFilter from './CategoryFilter';
import PriceSlider from './PriceSlider';

const FiltersSidebar = () => {
  const sidebarRef = useRef(null);

  // true si hay filtros ocultos debajo del área visible.
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const checkOverflow = () => {
      // Hay scroll pendiente si el contenido es más alto que el contenedor.
      // El margen de 2px absorbe errores de redondeo de subpíxeles en móvil.
      const isScrollable = el.scrollHeight > el.clientHeight + 2;

      // El usuario ya llegó al final del scroll.
      const isAtBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

      setHasMore(isScrollable && !isAtBottom);
    };

    checkOverflow();
    el.addEventListener('scroll', checkOverflow);
    // Recalcula si cambia el tamaño de la ventana (rotar móvil, resize).
    window.addEventListener('resize', checkOverflow);

    return () => {
      el.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`filters-sidebar ${hasMore ? 'has-more' : ''}`}
    >
      <h3>Filtros</h3>

      <div className="filter-group">
        <h4>Precio</h4>
        <PriceSlider attribute="price" />
      </div>

      <div className="filter-group">
        <h4>Marca</h4>
        <CategoryFilter attribute="brand" />
      </div>

      <div className="filter-group">
        <h4>Categoría</h4>
        <CategoryFilter attribute="category" />
      </div>

      {/* aria-hidden: es un aviso visual, no aporta info a lectores de pantalla */}
      <p className="filters-scroll-hint" aria-hidden="true">
        ↓ Desliza para ver más filtros
      </p>
    </aside>
  );
};

export default FiltersSidebar;