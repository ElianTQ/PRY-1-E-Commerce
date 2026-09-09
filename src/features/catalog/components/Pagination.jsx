import { usePagination } from 'react-instantsearch';

const Pagination = () => {
  const { pages, currentRefinement, isFirstPage, isLastPage, refine } =
    usePagination({ padding: 2 });

  if (pages.length <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={isFirstPage} onClick={() => refine(currentRefinement - 1)} className="arrow">
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => refine(page)}
          className={page === currentRefinement ? 'active' : ''}
        >
          {page + 1}
        </button>
      ))}
      <button disabled={isLastPage} onClick={() => refine(currentRefinement + 1)} className="arrow">
        ›
      </button>
    </div>
  );
};

export default Pagination;