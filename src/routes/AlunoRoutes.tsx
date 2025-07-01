import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";
import { StudentMenu } from "../pages/StudentMenu";

export function AlunoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<StudentMenu />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
