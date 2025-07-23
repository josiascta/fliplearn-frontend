import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Container,
} from "@mui/material";

export function NewCourseForm() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const professorId = session?.idUsuario;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!professorId) {
      setError("Usuário não autenticado como professor.");
      return;
    }

    const curso = {
      nome,
      descricao,
      cargaHoraria,
      professorId,
    };

    try {
      const res = await fetch("http://localhost:8080/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(curso),
      });

      if (!res.ok) throw new Error("Erro ao criar curso");

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Criar Novo Curso
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          label="Nome do Curso"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <TextField
          label="Carga Horária"
          type="number"
          inputProps={{ min: 1 }}
          value={cargaHoraria}
          onChange={(e) => setCargaHoraria(Number(e.target.value))}
          required
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ alignSelf: "flex-start", px: 4, py: 1 }}
        >
          Criar Curso
        </Button>
      </Box>
    </Container>
  );
}
