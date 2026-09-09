import "./App.css";  // ← agrega esta línea, faltaba
import { HashRouter, Routes, Route } from "react-router-dom";
import CatalogPage from "./features/catalog/CatalogPage";
import ProductDetail from "./features/pages/ProductDetail.jsx";

export default function App() {
  return (
    <HashRouter>
      <div className="App">
        <header className="App-header">
          <h1>Catalogo de Productos</h1>
        </header>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </HashRouter>
  );
}