import algoliasearch from 'algoliasearch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appId = process.env.VITE_ALGOLIA_APP_ID;
const apiKey = process.env.VITE_ALGOLIA_API_KEY;
const indexName = process.env.VITE_ALGOLIA_INDEX_NAME || 'grupo-01_products';

if (!appId || !apiKey) {
  console.error(' Error: Faltan variables de entorno');
  console.log('Crea un archivo .env con:');
  console.log('VITE_ALGOLIA_APP_ID=tu_app_id');
  console.log('VITE_ALGOLIA_API_KEY=tu_api_key');
  console.log('VITE_ALGOLIA_INDEX_NAME=grupo-01_products');
  process.exit(1);
}

console.log(` Conectando a Algolia con App ID: ${appId}`);
console.log(` Indexando en: ${indexName}`);

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

try {
  const dataPath = join(__dirname, '../data/products.json');
  console.log(` Leyendo datos de: ${dataPath}`);
  
  const data = readFileSync(dataPath, 'utf8');
  const jsonData = JSON.parse(data);
  const products = jsonData.products || jsonData;

  if (!Array.isArray(products) || products.length === 0) {
    console.error(' No se encontraron productos en el archivo');
    process.exit(1);
  }

  console.log(` ${products.length} productos encontrados`);

  const transformedProducts = products.map(product => ({
    objectID: product.id,
    ...product
  }));

  console.log(' Indexando productos...');
  const result = await index.saveObjects(transformedProducts);
  console.log(` ${result.objectIDs.length} productos indexados`);

  await index.setSettings({
    attributesForFaceting: ['category', 'brand', 'price', 'b2c', 'b2b', 'multiSede'],
    searchableAttributes: ['name', 'description', 'brand', 'category'],
    ranking: ['desc(rating)', 'typo', 'geo', 'words', 'filters', 'proximity']
  });

  console.log(' Configuración de Algolia actualizada');
  console.log(' Indexación completada!');

} catch (error) {
  console.error(' Error durante la indexación:', error.message);
  process.exit(1);
}