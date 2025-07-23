import { useNavigate } from "react-router";
import { useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import {
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

type CustomJwtPayload = JwtPayload & {
  role: string;
};

type Login = {
  email: string;
  senha: string;
};

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { save } = useAuth();
  const [loading, setLoading] = useState(false);

  async function login(loginDTO: Login) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDTO),
      });

      if (!response.ok) throw new Error("Erro ao fazer login");

      const token = await response.text();
      localStorage.setItem("token", token);

      const decoded: CustomJwtPayload = jwtDecode(token);
      const idUser = decoded.sub;

      const responseInfoUser = await fetch(
        `http://localhost:8080/auth/${idUser}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!responseInfoUser.ok) throw new Error("Erro ao buscar informações");

      const reponseJson = await responseInfoUser.json();
      save(reponseJson);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginDTO: Login = { email, senha };
    await login(loginDTO);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Coluna esquerda */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Bem-vindo!
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Faça login para continuar
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box mt={2}>
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Box mt={2}>
              <TextField
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Ainda não tem uma conta?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
            >
              Cadastre-se
            </Link>
          </Typography>
        </Paper>
      </Grid>

      {/* Coluna direita */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
        }}
      >
        <Box
          component="img"
          src="/Login.png"
          alt="Imagem de login"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
    </Grid>
  );
}
