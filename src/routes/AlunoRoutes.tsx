import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { CursoDetalhes } from "../pages/CursoDetalhes";
import { Home } from "../pages/Home";
import Perfil from "../pages/Perfil";

export function AlunoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/curso/:id" element={<CursoDetalhes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
