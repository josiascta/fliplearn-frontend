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
import ReactPlayer from "react-player";

type CursoDTO = {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  professorId?: string;
};

type VideoAulaDTO = {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  thumbnailUrl: string;
  duracao: string;
  dataPublicacao: string;
  dataAtualizacao: string;
  professorId: number;
  moduloId: number;
};


export function CursoDetalhes() {
  const { id } = useParams();
  const { session, isLoadingSession } = useAuth();
  const [curso, setCurso] = useState<CursoDTO | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [idAluno, setIdAluno] = useState("");
  const [adicionarMsg, setAdicionarMsg] = useState("");
  const [videoaulas, setVideoaulas] = useState<VideoAulaDTO[]>([]);


  const [novoTitulo, setNovoTitulo] = useState("");
  const [msgVideo, setMsgVideo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [professorId, setProfessorId] = useState(session?.idUsuario); // ou defina fixo
  const [moduloId, setModuloId] = useState(0); // ajustar conforme seu curso



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
        // Buscar videoaulas vinculadas ao curso
  fetch(`http://localhost:8080/video-aulas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setVideoaulas(data))
    .catch((err) => console.error("Erro ao buscar videoaulas:", err));

  }, [id]);

const handleAddVideoaula = () => {
  if (!novoTitulo || !url) {
    setMsgVideo("Título e URL são obrigatórios.");
    return;
  }

  const body = {
    titulo: novoTitulo,
    descricao,
    url,
    thumbnailUrl,
    dataPublicacao,
    dataAtualizacao: new Date().toISOString(),
    professorId,
    moduloId
  };

  fetch(`http://localhost:8080/video-aulas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(body)
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao cadastrar");
      return res.json();
    })
    .then((data) => {
      setMsgVideo("Videoaula cadastrada com sucesso!");
      // limpar campos, adicionar na lista se quiser
    })
    .catch(() => {
      setMsgVideo("Erro ao cadastrar videoaula.");
    });
  };


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
        <Tab label="Video-Aulas" />
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
            Video Aulas
          </Typography>

          {videoaulas.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma videoaula enviada.
            </Typography>
          ) : (
            <ul>
              {videoaulas.map((v, index) => (
                <li key={index}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer">
                    {v.titulo}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {session.role === "PROFESSOR" && (
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                Adicionar Video Aula
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Título"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  fullWidth
                />
                <TextField label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
                <TextField label="URL do vídeo" value={url} onChange={e => setUrl(e.target.value)} />
                <TextField label="URL da thumbnail" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} />
                <TextField label="Data de Publicação" type="datetime-local" value={dataPublicacao} onChange={e => setDataPublicacao(e.target.value)} />
                <TextField label="Módulo ID" type="number" value={moduloId} onChange={e => setModuloId(Number(e.target.value))} />

                <Button variant="contained" onClick={handleAddVideoaula}>
                  Cadastrar Video Aula
                </Button>
                {msgVideo && (
                  <Typography color="text.secondary">{msgVideo}</Typography>
                )}
              </Stack>
            </Box>
          )}
          {videoaulas.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma videoaula enviada.
            </Typography>
          ) : (
            <Stack spacing={2} mt={2}>
              {videoaulas.map((v) => (
                <Box key={v.id} sx={{ display: 'flex', gap: 2, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                  <Box>
                    <Typography variant="h6">{v.titulo}</Typography>
                    <Typography color="text.secondary">{v.descricao}</Typography>
                    <Typography variant="body2">
                      Publicado em: {new Date(v.dataPublicacao).toLocaleString()}
                    </Typography><br></br>
                    <ReactPlayer
                      controls
                      width="200%"
                      height="360px"
                      src={"https://www.youtube.com/watch?v=" + v.url}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          )}

        </Box>
        
      )}


      {tabIndex === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ranking
          </Typography>
          <Typography color="text.secondary">
            Ranking não disponível.
          </Typography>
        </Box>
      )}

      {tabIndex === 4 && session.role === "PROFESSOR" && (
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
