import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { StudentMenu } from "../pages/StudentMenu";
import { CursoDetalhes } from "../pages/CursoDetalhes";
import { Home } from "../pages/Home";

export function AlunoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/curso/:id" element={<CursoDetalhes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
