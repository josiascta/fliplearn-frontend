import { Route, Routes } from "react-router";
import { Layout } from "../components/Layout";
import { NewCourseForm } from "../pages/CriarNovoCurso";
import { CursoDetalhes } from "../pages/CursoDetalhes";
import { NotFound } from "../pages/NotFound";
import Perfil from "../pages/Perfil";
import { Home } from "../pages/Home";

export function ProfessorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/novo-curso" element={<NewCourseForm />} />
        <Route path="/curso/:id" element={<CursoDetalhes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
