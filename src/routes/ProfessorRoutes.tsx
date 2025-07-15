import { Routes, Route } from "react-router";
import { CursoDetalhes } from "../pages/CursoDetalhes";
import { NotFound } from "../pages/NotFound";
import { Home } from "../pages/Home";
import { NewCourseForm } from "../pages/CriarNovoCurso";
import { Layout } from "../components/Layout";

export function ProfessorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/novo-curso" element={<NewCourseForm />} />
        <Route path="/curso/:id" element={<CursoDetalhes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
