import React, { useState } from "react";
import { useNavigate } from "react-router";
import { z, ZodError } from "zod";
import { ToastContainer, toast } from "react-toastify";
import {
  Grid,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Link,
} from "@mui/material";

const loginSchema = z
  .object({
    nome: z.string().trim().min(1, { message: "Informe o nome" }),
    sobrenome: z.string().trim().min(1, { message: "Informe o sobrenome" }),
    email: z.string().email({ message: "E-mail inválido" }),
    senha: z
      .string()
      .min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
    confirmSenha: z.string(),
    tipoUsuario: z.enum(["aluno", "professor"]),
    dataDeNascimento: z
      .string()
      .min(1, { message: "Informe a data de nascimento" }),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não são iguais",
    path: ["confirmSenha"],
  });

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<"aluno" | "professor">(
    "aluno"
  );
  const [dataDeNascimento, setDataDeNascimento] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = loginSchema.parse({
        nome,
        sobrenome,
        email,
        senha,
        confirmSenha,
        tipoUsuario,
        dataDeNascimento,
      });
      const cargo = data.tipoUsuario === "professor" ? "PROFESSOR" : "ALUNO";

      const corpoAluno = {
        email: data.email,
        senha: data.senha,
        nome: data.nome,
        sobrenome: data.sobrenome,
        dataDeNascimento: new Date(data.dataDeNascimento),
        role: cargo,
      };
      const corpoProfessor = {
        email: data.email,
        senha: data.senha,
        nome: data.nome,
        sobrenome: data.sobrenome,
        dataDeNascimento: new Date(data.dataDeNascimento),
        role: cargo,
      };
      const endpoint =
        data.tipoUsuario === "aluno"
          ? "http://localhost:8080/auth/registerAluno"
          : "http://localhost:8080/auth/registerProfessor";
      const corpoParaEnvio =
        data.tipoUsuario === "aluno" ? corpoAluno : corpoProfessor;

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpoParaEnvio),
      });

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("Não foi possível cadastrar!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Coluna esquerda: formulário */}
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
            {" "}
            Criar uma Conta{" "}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {" "}
            Cadastre-se para começar{" "}
          </Typography>

          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  label="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Sobrenome"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

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
              <FormControl fullWidth>
                <InputLabel id="tipoUsuario-label">Tipo de Usuário</InputLabel>
                <Select
                  labelId="tipoUsuario-label"
                  id="tipoUsuario"
                  value={tipoUsuario}
                  label="Tipo de Usuário"
                  onChange={(e) =>
                    setTipoUsuario(e.target.value as "aluno" | "professor")
                  }
                >
                  <MenuItem value="aluno">Aluno</MenuItem>
                  <MenuItem value="professor">Professor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mt={2}>
              <TextField
                label="Data de Nascimento"
                type="date"
                value={dataDeNascimento}
                onChange={(e) => setDataDeNascimento(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={6}>
                <TextField
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Confirmar Senha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Já tem uma conta?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/")}
            >
              Entrar
            </Link>
          </Typography>
        </Paper>
      </Grid>

      {/* Coluna direita: imagem */}
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
          alt="Imagem de cadastro"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
    </Grid>
  );
}
