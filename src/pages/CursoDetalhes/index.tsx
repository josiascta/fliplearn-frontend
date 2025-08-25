import {
  Alert,
  Box,
  CircularProgress,
  Container,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AvisosSection } from "./sections/AvisosSection";
import { CursoOpcoesSection } from "./sections/CursoOpcoesSection";
import { MateriaisSection } from "./sections/MateriaisSection";
import { ModulosSection } from "./sections/ModuloSection";
import { VideoAulasSection } from "./sections/VideoAulasSection";
import {
  CursoDTO,
  ModuloDTO,
  ProgressoDTO,
  VideoAulaDTO,
} from "../../components/types/types";
import { useAuth } from "../../hooks/useAuth";
import { RankingSection } from "./sections/RankingSection";
import { QuizSection } from "./sections/QuizSection";

export function CursoDetalhes() {
  const { id } = useParams();
  const { session, isLoadingSession } = useAuth();
  const [curso, setCurso] = useState<CursoDTO | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const [videoaulas, setVideoaulas] = useState<VideoAulaDTO[]>([]);
  const [videoaulasDoModulo, setVideoaulasDoModulo] = useState<
    Record<number, VideoAulaDTO[]>
  >({});

  const [modulos, setModulos] = useState<ModuloDTO[]>([]);

  const [progresso, setProgresso] = useState<ProgressoDTO>();

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

    fetch(`http://localhost:8080/video-aulas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVideoaulas(data))
      .catch((err) => console.error("Erro ao buscar videoaulas:", err));

    if (session?.role === "ALUNO") {
      fetch(
        `http://localhost:8080/progresso/${session?.idUsuario}/curso/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((progresso) => setProgresso(progresso));
    }

    // Após carregar módulos
    fetch(`http://localhost:8080/modulos/curso/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(async (modulosData: ModuloDTO[]) => {
        setModulos(modulosData);

        const aulasPorModulo: Record<number, VideoAulaDTO[]> = {};

        for (const modulo of modulosData) {
          const res = await fetch(
            `http://localhost:8080/video-aulas/modulo/${modulo.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (res.ok) {
            const aulasDoModulo = await res.json();
            aulasPorModulo[modulo.id] = aulasDoModulo;
          } else {
            aulasPorModulo[modulo.id] = []; // caso erro, coloca array vazio
          }
        }

        setVideoaulasDoModulo(aulasPorModulo);
      })
      .catch((err) =>
        console.error("Erro ao buscar módulos e videoaulas:", err)
      );
  }, [id]);

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
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {curso.nome}
      </Typography>
      {session.role === "ALUNO" && (
        <Box mb={2}>
          <Typography variant="h6">Status: {progresso?.status}</Typography>
          <LinearProgress
            variant="determinate"
            value={progresso?.percentualConcluido}
          />
          <Typography variant="body2" color="text.secondary">
            {progresso?.percentualConcluido.toFixed(0)}% concluído
          </Typography>
        </Box>
      )}

      <Tabs
        value={tabIndex}
        onChange={(_e, newValue) => setTabIndex(newValue)}
        sx={{ mb: 4 }}
      >
        <Tab label="Avisos" />
        <Tab label="Materiais" />
        <Tab label="Ranking" />
        <Tab label="Video-Aulas" />
        {session.role === "PROFESSOR" && <Tab label="Módulos" />}
        {session.role === "PROFESSOR" && <Tab label="Opções do Curso" />}
        <Tab label="Quiz" />
      </Tabs>

      {tabIndex === 0 && <AvisosSection cursoId={id!} />}

      {tabIndex === 1 && <MateriaisSection session={session} />}
      {tabIndex === 2 && <RankingSection cursoId={id!} />}

      {tabIndex === 3 && (
        <VideoAulasSection
          session={session}
          curso={curso}
          modulos={modulos}
          videoaulasDoModulo={videoaulasDoModulo}
          setVideoaulasDoModulo={setVideoaulasDoModulo}
          progresso={progresso}
          videoaulas={videoaulas}
        />
      )}

      {tabIndex === 4 && session.role === "PROFESSOR" && (
        <ModulosSection
          session={session}
          cursoId={id!}
          modulos={modulos}
          setModulos={setModulos}
        />
      )}
      {tabIndex === 5 && session.role === "PROFESSOR" && (
        <CursoOpcoesSection cursoId={id!} />
      )}
       {tabIndex === 6 && (
  <QuizSection cursoId={id!} isProfessor={session.role === "PROFESSOR"} />
)}
    </Container>
  );
}
