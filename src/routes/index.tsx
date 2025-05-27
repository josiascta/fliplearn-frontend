import { BrowserRouter } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthRoutes } from "./AuthRoutes";
import { ProfessorRoutes } from "./ProfessorRoutes";
import { AlunoRoutes } from "./AlunoRoutes";
import { Loading } from "../components/Loading/Loading";

export function Routes() {
  const { session, isLoadingSession } = useAuth();

  function RouteSelector() {
    const role = session?.cargos[0];

    switch (role) {
      case "PROFESSOR":
        return <ProfessorRoutes />;
      case "ALUNO":
        return <AlunoRoutes />;
      default:
        return <AuthRoutes />;
    }
  }

  if (isLoadingSession) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <RouteSelector />
    </BrowserRouter>
  );
}
