import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import CatalogPage from "../features/catalog/CatalogPage";
import ProductDetail from "./ProductDetail";

export default function MainLayout() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}
