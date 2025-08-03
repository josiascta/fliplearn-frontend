import { AuthProvider } from "./contexts/AuthContext";
import { Routes } from "./routes";

//ponto de entrada que renderiza o nosso componente de rotas
export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
