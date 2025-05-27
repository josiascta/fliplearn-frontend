import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { StudentMenu } from "../components/StudentMenu/StudentMenu";

export function AlunoRoutes() {
  return (
    <Routes>
      {/* Layout como wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Aqui vão as rotas filhas que renderizam no <Outlet /> do Layout */}
        <Route path="/" element={<StudentMenu />} />

        {/* Poderia ter outras rotas aqui */}
      </Route>

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
