import { InstantSearch, Configure } from 'react-instantsearch';
import { searchClient, indexName } from '../../config/algolia';
import SearchBar from './components/SearchBar';
import FiltersSidebar from './components/FiltersSidebar';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';

const CatalogPage = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure hitsPerPage={12} />
      <div className="search-section">
        <div className="search-hero">
          <SearchBar />
        </div>
      </div>
      <div className="results-section">
        <FiltersSidebar />
        <div className="products-section">
          <ProductGrid />
          <Pagination />
        </div>
      </div>
    </InstantSearch>
  );
};

export default CatalogPage;