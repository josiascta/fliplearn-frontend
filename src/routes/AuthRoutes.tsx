import { Routes, Route } from "react-router";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { NotFound } from "../pages/NotFound";
import { Layout } from "../components/Layout";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
