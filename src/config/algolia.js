import algoliasearch from 'algoliasearch';

const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const apiKey = import.meta.env.VITE_ALGOLIA_API_KEY;

if (!appId || !apiKey) {
  console.warn('Variables de entorno de Algolia no configuradas');
  console.warn('Crea un archivo .env con:');
  console.warn('VITE_ALGOLIA_APP_ID=tu_app_id');
  console.warn('VITE_ALGOLIA_API_KEY=tu_api_key');
}

export const searchClient = algoliasearch(appId, apiKey);
export const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'grupo-06_products';