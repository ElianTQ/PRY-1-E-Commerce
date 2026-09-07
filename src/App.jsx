import { HashRouter, Routes, Route } from "react-router-dom";
{/*import CatalogPage from "./features/catalog/CatalogPage";
import ProductDetail from "./pages/ProductDetail";*/}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/*<Route path="/" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />*/}
      </Routes>
    </HashRouter>
  );
}