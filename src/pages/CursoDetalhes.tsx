import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
};

export function CursoDetalhes() {
  const { id } = useParams();
  const { session, isLoadingSession } = useAuth();
  const [curso, setCurso] = useState<CursoDTO | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [idAluno, setIdAluno] = useState("");
  const [adicionarMsg, setAdicionarMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/cursos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data: CursoDTO) => setCurso(data))
      .catch((err) => console.error("Erro ao buscar curso:", err));
  }, [id]);

  const handleAddAluno = () => {
    if (!idAluno.trim()) return;

    fetch(`http://localhost:8080/cursos/${id}/alunos/${idAluno}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setAdicionarMsg("Aluno adicionado com sucesso.");
          setIdAluno("");
        } else {
          throw new Error("Erro ao adicionar aluno.");
        }
      })
      .catch(() => {
        setAdicionarMsg("Erro ao adicionar aluno.");
      });
  };

  if (isLoadingSession) {
    return (
      <Box mt={6} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Verificando sessão...</Typography>
      </Box>
    );
  }

  if (!session) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 6, textAlign: "center" }}>
          Usuário não autenticado.
        </Alert>
      </Container>
    );
  }

  if (!curso) {
    return (
      <Container>
        <Typography variant="h6" mt={6}>
          Carregando informações do curso...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {curso.nome}
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        sx={{ mb: 4 }}
      >
        <Tab label="Avisos" />
        <Tab label="Materiais" />
        <Tab label="Ranking" />
        {session.role === "PROFESSOR" && <Tab label="Opções do Curso" />}
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Avisos
          </Typography>
          <Typography color="text.secondary">
            Nenhum aviso disponível.
          </Typography>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Materiais
          </Typography>
          <Typography color="text.secondary">
            Nenhum material enviado.
          </Typography>
          {session.role === "PROFESSOR" && (
            <Button sx={{ mt: 2 }} variant="contained">
              Adicionar Material
            </Button>
          )}
        </Box>
      )}

      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ranking
          </Typography>
          <Typography color="text.secondary">
            Ranking não disponível.
          </Typography>
        </Box>
      )}

      {tabIndex === 3 && session.role === "PROFESSOR" && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Opções do Curso
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mt={2}>
            <TextField
              label="ID do Aluno"
              value={idAluno}
              onChange={(e) => setIdAluno(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleAddAluno}>
              Adicionar Aluno
            </Button>
          </Stack>

          {adicionarMsg && (
            <Typography mt={2} color="text.secondary">
              {adicionarMsg}
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
}
