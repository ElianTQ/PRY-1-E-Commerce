import { useEffect, useRef, useState } from 'react';
import { usePagination, useStats } from 'react-instantsearch';
import { useSearchParams, useLocation } from 'react-router-dom';

const Pagination = () => {
  const { pages, currentRefinement, isFirstPage, isLastPage, refine } =
    usePagination({ padding: 2 });
  const { nbPages } = useStats();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // 🔥 SOLO usar sessionStorage para guardar la página, NO para controlar inicialización
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

  // 🔥 CORREGIDO: Restaurar desde URL en cada refresh
  useEffect(() => {
    // Si ya se inicializó o no hay páginas, salir
    if (initialLoadDone.current) return;
    if (nbPages === 0) {
      console.log('⏳ Esperando que nbPages cargue...');
      return;
    }
    
    const pageParam = searchParams.get('page');
    console.log('🔄 Inicializando desde URL, pageParam:', pageParam, 'nbPages:', nbPages);
    
    let targetPage = 0;
    let shouldUpdateUrl = false;
    
    if (pageParam) {
      const algoliaPage = urlPageToAlgoliaPage(pageParam);
      console.log('🔄 PageParam convertido a Algolia page:', algoliaPage);
      
      if (algoliaPage !== null && algoliaPage >= 0 && algoliaPage < nbPages) {
        targetPage = algoliaPage;
        console.log('✅ Página válida, restaurando a:', targetPage);
      } else {
        console.log('⚠️ Página inválida en URL, usando primera página');
        shouldUpdateUrl = true;
      }
    } else {
      // 🔥 Si no hay página en URL, intentar restaurar desde sessionStorage
      const savedPage = sessionStorage.getItem('last_pagination_page');
      if (savedPage) {
        const savedPageNum = parseInt(savedPage, 10);
        if (!isNaN(savedPageNum) && savedPageNum >= 0 && savedPageNum < nbPages) {
          targetPage = savedPageNum;
          console.log('📌 Restaurando desde sessionStorage:', targetPage);
          // Actualizar URL con la página guardada
          shouldUpdateUrl = true;
        }
      }
    }
    
    // Actualizar URL si es necesario
    if (shouldUpdateUrl) {
      const newParams = new URLSearchParams(searchParams);
      if (targetPage > 0) {
        newParams.set('page', algoliaPageToUrlPage(targetPage).toString());
      } else {
        newParams.delete('page');
      }
      setSearchParams(newParams, { replace: true });
    }
    
    // Restaurar la página
    console.log('🔄 Restaurando a página Algolia:', targetPage);
    isUpdatingFromUrl.current = true;
    refine(targetPage);
    
    // Marcar como inicializado
    setTimeout(() => {
      isUpdatingFromUrl.current = false;
      initialLoadDone.current = true;
      setIsInitialized(true);
      console.log('✅ Inicialización completada, página:', targetPage);
    }, 300);
    
  }, [nbPages, searchParams, refine, setSearchParams]);

  // Sincronizar Algolia -> URL
  useEffect(() => {
    if (isUpdatingFromUrl.current) return;
    if (!isInitialized) return;
    if (lastRefinement.current === currentRefinement) return;
    if (isUserAction.current) return;
    
    lastRefinement.current = currentRefinement;
    
    const urlPage = algoliaPageToUrlPage(currentRefinement);
    console.log('📝 Actualizando URL a página (1-based):', urlPage);
    
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

  // Manejar cambios en URL (botón atrás/adelante)
  useEffect(() => {
    if (!isInitialized) return;
    if (isUpdatingFromAlgolia.current) return;
    if (isUpdatingFromUrl.current) return;
    if (isUserAction.current) {
      console.log('⏭️ Ignorando cambio de URL durante acción del usuario');
      return;
    }
    
    const pageParam = searchParams.get('page');
    
    if (!pageParam) {
      console.log('ℹ️ No hay parámetro page en URL, manteniendo página actual');
      return;
    }
    
    const targetAlgoliaPage = urlPageToAlgoliaPage(pageParam);
    console.log('🔙 PageParam convertido a Algolia page:', targetAlgoliaPage);
    
    if (targetAlgoliaPage === null || targetAlgoliaPage < 0 || targetAlgoliaPage >= nbPages) {
      console.log('⚠️ Página inválida en URL:', pageParam);
      return;
    }
    
    console.log('🔙 Cambio detectado en URL a página (Algolia):', targetAlgoliaPage, 'Actual (Algolia):', currentRefinement);
    
    if (targetAlgoliaPage !== currentRefinement && nbPages > 0) {
      isUpdatingFromUrl.current = true;
      refine(targetAlgoliaPage);
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
      }, 300);
    }
  }, [searchParams, currentRefinement, nbPages, refine, isInitialized]);

  // 🔥 Guardar la página actual en sessionStorage
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem('last_pagination_page', currentRefinement.toString());
      console.log('💾 Guardando página en sessionStorage:', currentRefinement);
    }
  }, [currentRefinement, isInitialized]);

  if (pages.length <= 1) return null;

  const handleRefine = (page) => {
    if (isNaN(page) || page < 0 || page >= nbPages) {
      console.log('❌ Página inválida:', page);
      return;
    }
    console.log('👆 Click en página (Algolia):', page);
    isUpdatingFromUrl.current = false;
    isUserAction.current = true;
    refine(page);
    
    setTimeout(() => {
      isUserAction.current = false;
    }, 500);
  };

  const goToFirstPage = () => {
    if (!isFirstPage) {
      console.log('👆 Click en Primera página');
      isUpdatingFromUrl.current = false;
      isUpdatingFromAlgolia.current = false;
      isUserAction.current = true;
      
      // Limpiar URL
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
      console.log('👆 Click en Última página');
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
          console.log('👆 Click en página anterior');
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
          console.log('👆 Click en página siguiente');
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