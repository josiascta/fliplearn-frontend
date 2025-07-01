import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { ProfessorCursosPage } from "../pages/ProfessorCursosPage";
import { NewCourseForm } from "../pages/CriarNovoCurso";

export function ProfessorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<ProfessorCursosPage />} />
        <Route path="/novo-curso" element={<NewCourseForm />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
