/**
 * Componente raíz de la aplicación.
 *
 * Envuelve todo en HashRouter (necesario para que las rutas funcionen
 * en GitHub Pages, que no soporta rutas del lado del servidor) y
 * delega el resto del layout a MainLayout.
 */

import "./styles/index.js";
import { HashRouter } from "react-router-dom";
import MainLayout from "./pages/MainLayout";

export default function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}