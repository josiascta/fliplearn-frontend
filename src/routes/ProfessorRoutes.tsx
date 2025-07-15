import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { ProfessorCursosPage } from "../pages/ProfessorCursosPage";
import { NewCourseForm } from "../pages/CriarNovoCurso";
import Perfil from "../pages/Perfil";

export function ProfessorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<ProfessorCursosPage />} />
        <Route path="/novo-curso" element={<NewCourseForm />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
