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