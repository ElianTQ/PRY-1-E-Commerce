import { useEffect, useRef, useState } from 'react';
import { usePagination, useStats } from 'react-instantsearch';
import { useSearchParams, useLocation } from 'react-router-dom';

const Pagination = () => {
  const { pages, currentRefinement, isFirstPage, isLastPage, refine } =
    usePagination({ padding: 2 });
  const { nbPages } = useStats();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromAlgolia = useRef(false);
  const isUserAction = useRef(false);
  const lastRefinement = useRef(currentRefinement);
  const initialLoadDone = useRef(false);

  const urlPageToAlgoliaPage = (urlPage) => {
    if (urlPage === null || urlPage === undefined) return null;
    const pageNum = parseInt(urlPage, 10);
    if (isNaN(pageNum)) return null;
    return pageNum - 1;
  };

  const algoliaPageToUrlPage = (algoliaPage) => {
    return algoliaPage + 1;
  };

  useEffect(() => {
    if (initialLoadDone.current) return;
    if (nbPages === 0) {
      return;
    }
    
    const pageParam = searchParams.get('page');
    
    let targetPage = 0;
    let shouldUpdateUrl = false;
    
    if (pageParam) {
      const algoliaPage = urlPageToAlgoliaPage(pageParam);
      
      if (algoliaPage !== null && algoliaPage >= 0 && algoliaPage < nbPages) {
        targetPage = algoliaPage;
      } else {
        shouldUpdateUrl = true;
      }
    } else {
      const savedPage = sessionStorage.getItem('last_pagination_page');
      if (savedPage) {
        const savedPageNum = parseInt(savedPage, 10);
        if (!isNaN(savedPageNum) && savedPageNum >= 0 && savedPageNum < nbPages) {
          targetPage = savedPageNum;
          shouldUpdateUrl = true;
        }
      }
    }
    
    if (shouldUpdateUrl) {
      const newParams = new URLSearchParams(searchParams);
      if (targetPage > 0) {
        newParams.set('page', algoliaPageToUrlPage(targetPage).toString());
      } else {
        newParams.delete('page');
      }
      setSearchParams(newParams, { replace: true });
    }
    
    isUpdatingFromUrl.current = true;
    refine(targetPage);
    
    setTimeout(() => {
      isUpdatingFromUrl.current = false;
      initialLoadDone.current = true;
      setIsInitialized(true);
    }, 300);
    
  }, [nbPages, searchParams, refine, setSearchParams]);

  useEffect(() => {
    if (isUpdatingFromUrl.current) return;
    if (!isInitialized) return;
    if (lastRefinement.current === currentRefinement) return;
    if (isUserAction.current) return;
    
    lastRefinement.current = currentRefinement;
    
    const urlPage = algoliaPageToUrlPage(currentRefinement);
    
    const newParams = new URLSearchParams(searchParams);
    if (currentRefinement > 0) {
      newParams.set('page', urlPage.toString());
    } else {
      newParams.delete('page');
    }
    
    const currentPageParam = searchParams.get('page');
    const newPageStr = currentRefinement > 0 ? urlPage.toString() : null;
    
    if (currentPageParam !== newPageStr) {
      isUpdatingFromAlgolia.current = true;
      setSearchParams(newParams, { replace: true });
      setTimeout(() => {
        isUpdatingFromAlgolia.current = false;
      }, 100);
    }
  }, [currentRefinement, searchParams, setSearchParams, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (isUpdatingFromAlgolia.current) return;
    if (isUpdatingFromUrl.current) return;
    if (isUserAction.current) {
      return;
    }
    
    const pageParam = searchParams.get('page');
    
    if (!pageParam) {
      return;
    }
    
    const targetAlgoliaPage = urlPageToAlgoliaPage(pageParam);
    
    if (targetAlgoliaPage === null || targetAlgoliaPage < 0 || targetAlgoliaPage >= nbPages) {
      return;
    }
    
    if (targetAlgoliaPage !== currentRefinement && nbPages > 0) {
      isUpdatingFromUrl.current = true;
      refine(targetAlgoliaPage);
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
      }, 300);
    }
  }, [searchParams, currentRefinement, nbPages, refine, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem('last_pagination_page', currentRefinement.toString());
    }
  }, [currentRefinement, isInitialized]);

  if (pages.length <= 1) return null;

  const handleRefine = (page) => {
    if (isNaN(page) || page < 0 || page >= nbPages) {
      return;
    }
    isUpdatingFromUrl.current = false;
    isUserAction.current = true;
    refine(page);
    
    setTimeout(() => {
      isUserAction.current = false;
    }, 500);
  };

  const goToFirstPage = () => {
    if (!isFirstPage) {
      isUpdatingFromUrl.current = false;
      isUpdatingFromAlgolia.current = false;
      isUserAction.current = true;
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page');
      setSearchParams(newParams, { replace: true });
      
      refine(0);
      
      setTimeout(() => {
        isUserAction.current = false;
      }, 500);
    }
  };

  const goToLastPage = () => {
    if (!isLastPage) {
      isUpdatingFromUrl.current = false;
      isUpdatingFromAlgolia.current = false;
      isUserAction.current = true;
      refine(nbPages - 1);
      
      setTimeout(() => {
        isUserAction.current = false;
      }, 500);
    }
  };

  return (
    <div className="pagination">
      <button
        disabled={isFirstPage}
        onClick={goToFirstPage}
        className="arrow"
        title="Primera página"
      >
        &lt;&lt;
      </button>

      <button
        disabled={isFirstPage}
        onClick={() => {
          isUpdatingFromUrl.current = false;
          isUserAction.current = true;
          refine(currentRefinement - 1);
          setTimeout(() => {
            isUserAction.current = false;
          }, 500);
        }}
        className="arrow"
        title="Página anterior"
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handleRefine(page)}
          className={page === currentRefinement ? 'active' : ''}
        >
          {page + 1}
        </button>
      ))}

      <button
        disabled={isLastPage}
        onClick={() => {
          isUpdatingFromUrl.current = false;
          isUserAction.current = true;
          refine(currentRefinement + 1);
          setTimeout(() => {
            isUserAction.current = false;
          }, 500);
        }}
        className="arrow"
        title="Página siguiente"
      >
        &gt;
      </button>

      <button
        disabled={isLastPage}
        onClick={goToLastPage}
        className="arrow"
        title="Última página"
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;