import { Routes, Route } from "react-router";
import { Layout } from "../components/Layout";
import { NotFound } from "../pages/NotFound";

export function AlunoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}></Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
