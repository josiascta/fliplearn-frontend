import { AuthProvider } from "./contexts/AuthContext";
import { Routes } from "./routes";
import { ThemeProvider } from "@mui/material";
import lightTheme from "./themes/Light";

//ponto de entrada que renderiza o nosso componente de rotas
export function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={lightTheme}>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}
