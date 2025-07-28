import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  List,
  ListItem,
  Paper,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
};

export function HomeAntiga() {
  const { session, isLoadingSession } = useAuth();
  const [cursos, setCursos] = useState<CursoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;

    const url =
      session.role === "PROFESSOR"
        ? `http://localhost:8080/professor/${session.idUsuario}/cursos`
        : `http://localhost:8080/aluno/${session.idUsuario}/cursos`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data: CursoDTO[]) => {
        setCursos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar cursos:", err);
      })
      .finally(() => setLoading(false));
  }, [session]);

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

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          label="Filtrar por nome"
          variant="outlined"
          size="small"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />

        {session.role === "PROFESSOR" && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={() => navigate("/novo-curso")}
            sx={{ borderRadius: 4, px: 3, py: 1 }}
          >
            Criar Novo Curso
          </Button>
        )}
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2} color="text.secondary">
            Carregando cursos...
          </Typography>
        </Box>
      ) : cursosFiltrados.length === 0 ? (
        <Typography color="text.secondary">Nenhum curso encontrado.</Typography>
      ) : (
        <List>
          {cursosFiltrados.map((curso) => (
            <ListItem
              key={curso.id}
              disablePadding
              sx={{ mb: 2 }}
              onClick={() => navigate(`/curso/${curso.id}`)}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  width: "100%",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight={600}>
                      {curso.nome}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {curso.descricao || "Sem descrição"}
                      </Typography>
                      <br />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        Carga horária: {curso.cargaHoraria}h
                      </Typography>
                    </>
                  }
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
