import CategoryFilter from './CategoryFilter';
import PriceSlider from './PriceSlider';

const FiltersSidebar = () => (
  <aside className="filters-sidebar">
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
  </aside>
);

export default FiltersSidebar;