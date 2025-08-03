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
  LinearProgress,
} from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ReactPlayer from "react-player";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

type MaterialDTO = {
  id: number | string;
  titulo: string;
  url?: string;
  descricao?: string;
};

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
type ModuloDTO = {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  cursoId: number;
};

interface QuestionarioDTO {
  id?: number; // opcional no momento da criação
  titulo: string;
  descricao: string;
  categoriaId: number;
  dataEntrega: string; // formato ISO, ex: '2025-07-31T15:00:00'
  notificado: boolean;
  alunoId?: number; // se for individual
  moduloId: number;
  dataPublicacao: string; // agora
  questoesId: number[];
}

export function CursoDetalhes() {
  const { id } = useParams();
  const { session, isLoadingSession } = useAuth();
  const [curso, setCurso] = useState<CursoDTO | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [idAluno, setIdAluno] = useState("");
  const [adicionarMsg, setAdicionarMsg] = useState("");
  const [videoaulas, setVideoaulas] = useState<VideoAulaDTO[]>([]);
  const [videoaulasDoModulo, setVideoaulasDoModulo] = useState<
    Record<number, VideoAulaDTO[]>
  >({});

  const [novoTitulo, setNovoTitulo] = useState("");
  const [msgVideo, setMsgVideo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [professorId, setProfessorId] = useState(session?.idUsuario); // ou defina fixo
  const [moduloId, setModuloId] = useState(0); // ajustar conforme seu curso
  const [modulos, setModulos] = useState<ModuloDTO[]>([]);
  const [novoModulo, setNovoModulo] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });
  const [msgModulo, setMsgModulo] = useState("");

  const [assistidas, setAssistidas] = useState<Set<number>>(new Set());


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

    fetch(`http://localhost:8080/video-aulas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVideoaulas(data))
      .catch((err) => console.error("Erro ao buscar videoaulas:", err));

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
      moduloId,
    };

    fetch(`http://localhost:8080/video-aulas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
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

  const handleVideoFinalizado = (videoId: number) => {
    setAssistidas((prev) => new Set(prev).add(videoId));

    // Se quiser salvar no backend:
    fetch(`http://localhost:8080/progresso/assistir/${videoId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // preencha com os campos esperados pela entidade Progresso
        usuarioId: session?.idUsuario,
        cursoId: curso?.id,
        videoAulaId: videoId,
        progresso : 1,
        dataConclusao: new Date().toUTCString()
      }),
    });

  };
  


 const [materiais, setMateriais] = useState<MaterialDTO[]>([]);
  const [tituloMaterial, setTituloMaterial] = useState("");
  const [msgMaterial, setMsgMaterial] = useState("");

  // **2. Carrega materiais ao montar**
  useEffect(() => {
    carregarMateriais();
  }, []);

  // **3. Função GET /api/materiais**
  const carregarMateriais = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/materiais", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const lista: MaterialDTO[] = await res.json();
        setMateriais(lista);
      } else {
        console.error("Falha ao buscar materiais:", res.status);
      }
    } catch (err) {
      console.error("Erro ao carregar materiais:", err);
    }
  };

  // **4. Upload de material e atualização da lista**
 const handleMaterialChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!tituloMaterial.trim()) {
    setMsgMaterial("Por favor, preencha o título do material antes de enviar.");
    return;
  }

  setMsgMaterial("Enviando material para o Drive...");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("titulo", tituloMaterial);

  try {
    // 1) Upload ao Drive
    const driveRes = await fetch("http://localhost:8080/api/arquivos/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    const driveText = await driveRes.text();
    console.log("Resposta /api/arquivos/upload:", driveRes.status, driveText);

    if (!driveRes.ok) {
      throw new Error(driveText || "Erro ao enviar material ao Drive");
    }
    if (!driveText) {
      throw new Error("Nenhum JSON retornado do upload ao Drive");
    }
    const driveDTO: { id: number; titulo: string; link: string } = JSON.parse(driveText);

    // 2) Persistência no seu controller de materiais
    setMsgMaterial("Salvando material na base de dados...");
    const salvarRes = await fetch("http://localhost:8080/api/materiais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        titulo: driveDTO.titulo,
        link: driveDTO.link,
        cursoId: Number(id),
      }),
    });
    const salvarText = await salvarRes.text();
    console.log("Resposta POST /api/materiais:", salvarRes.status, salvarText);

    if (!salvarRes.ok) {
      throw new Error(salvarText || "Erro ao salvar material no banco");
    }
    if (!salvarText) {
      console.warn("Material salvo, mas sem JSON de retorno. Recarregando lista...");
    } else {
      // opcional aproveitar o DTO retornado:
      try {
        const salvoDTO: MaterialDTO = JSON.parse(salvarText);
        setMateriais((prev) => [...prev, salvoDTO]);
      } catch {
        console.warn("Não foi possível parsear o JSON de SAVE, recarregando lista completa.");
        await carregarMateriais();
      }
    }

    setMsgMaterial("Material enviado e salvo com sucesso!");
    setTituloMaterial("");
  } catch (err: any) {
    console.error(err);
    setMsgMaterial(`Falha: ${err.message}`);
  }
};
  const [msgGerarQuestoes, setMsgGerarQuestoes] = useState("");

// Função para enviar o arquivo para a API e receber as questões
const handleArquivoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setMsgGerarQuestoes("Processando arquivo, aguarde...");

  const formData = new FormData();
  formData.append("arquivo", file);

  try {
    const response = await fetch("http://localhost:8080/api/educational-ai/gerar-questoes-doc", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao gerar questões");
    }

    const resultText = await response.text(); 
    setMsgGerarQuestoes(resultText);
  } catch (error) {
    setMsgGerarQuestoes("Falha ao gerar questões com IA.");
  }
};


  const handleAddModulo = () => {
    if (!novoModulo.nome || !novoModulo.dataInicio || !novoModulo.dataFim) {
      setMsgModulo("Preencha todos os campos obrigatórios.");
      return;
    }

    const body = {
      ...novoModulo,
      cursoId: Number(id),
    };

    fetch("http://localhost:8080/modulos/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao cadastrar módulo");
        return res.json();
      })
      .then(() => {
        setMsgModulo("Módulo cadastrado com sucesso!");
        setNovoModulo({ nome: "", descricao: "", dataInicio: "", dataFim: "" });
        // Atualizar lista
        return fetch(`http://localhost:8080/modulos/curso/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      })
      .then((res) => res.json())
      .then((data) => setModulos(data))
      .catch(() => setMsgModulo("Erro ao cadastrar módulo."));
  };

  const [questionario, setQuestionario] = useState<QuestionarioDTO | null>(null);
   useEffect(() => {
  if (questionario && questionario.dataPublicacao && questionario.dataEntrega) {
    const inicio = new Date(questionario.dataPublicacao);
    const fim = new Date(questionario.dataEntrega);
    const tempoRestante = fim.getTime() - new Date().getTime();

    console.log("Tempo restante em ms:", tempoRestante);
  }
}, [questionario]);



function Cronometro({ dataEntrega }: { dataEntrega: string }) {
  const [tempoRestante, setTempoRestante] = useState(() => {
    return new Date(dataEntrega).getTime() - new Date().getTime();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante((prev) => prev - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (tempoRestante <= 0) return <p className="text-red-500">Tempo esgotado</p>;

  const minutos = Math.floor(tempoRestante / 60000);
  const segundos = Math.floor((tempoRestante % 60000) / 1000);

  return (
    <p className="text-lg font-semibold text-blue-600">
      Tempo restante: {minutos}m {segundos}s
    </p>
  );
}

  
 
const handleAplicarQuiz = async (questoesArray: { id: number; texto: string }[]) => {
  if (!questoesArray || questoesArray.length === 0) {
    alert("Nenhuma questão gerada para aplicar o quiz.");
    return;
  }

  const agora = new Date();
  const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

  const questionario: QuestionarioDTO = {
    titulo: "Quiz gerado automaticamente",
    descricao: "Quiz aplicado com questões geradas pela IA.",
    categoriaId: 1, // ajuste conforme seu contexto
    dataEntrega: trintaMinutosDepois.toISOString(),
    notificado: true,
    moduloId: 1, // ajuste conforme seu contexto
    dataPublicacao: agora.toISOString(),
    questoesId: questoesArray.map(q => q.id),
  };

  try {
    const response = await fetch("http://localhost:8080/questionarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(questionario),
    });

    if (!response.ok) {
      throw new Error("Erro ao aplicar o quiz.");
    }

    alert("Quiz aplicado com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar o quiz:", error);
    alert("Erro ao aplicar o quiz.");
  }
};
  const questoesArray = React.useMemo(() => {
  if (!msgGerarQuestoes || typeof msgGerarQuestoes !== "string") return [];
  return msgGerarQuestoes
    .split(/\n+/)
    .map((texto, index) => ({
      id: index + 1,
      texto: texto.trim(),
    }))
    .filter(q => q.texto !== "");
}, [msgGerarQuestoes]);  

const handleGerarPdf = async () => {
  console.log("Gerar PDF com as questões:");
  console.log(msgGerarQuestoes);

  try {
    const response = await fetch("http://localhost:8080/api/educational-ai/gerar-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        conteudo: msgGerarQuestoes,
        cursoId: curso?.id,
      }),
    });

    if (!response.ok) throw new Error("Erro ao gerar PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "questoes-geradas.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Falha ao gerar o PDF.");
  }
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
      <Tab label="Ranking" />
      <Tab label="Módulos" />
      {session.role === "PROFESSOR" && <Tab label="Video-Aulas" />}
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

    {materiais.length === 0 ? (
      <Typography color="text.secondary">
        Nenhum material enviado.
      </Typography>
    ) : (
      <Stack spacing={1} mt={2}>
        {materiais.map((m) => (
          <Box
            key={m.id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 1,
            }}
          >
            <Typography fontWeight={600}>{m.titulo}</Typography>
            {/* Exemplo: link para baixar */}
            {m.url && (
              <Typography variant="body2">
                <a href={m.url} target="_blank" rel="noopener noreferrer">
                  Baixar material
                </a>
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    )}

    {session.role === "PROFESSOR" && (
      <Stack direction="row" spacing={2} mt={2} alignItems="center">
        <TextField
          label="Título do Material"
          value={tituloMaterial}
          onChange={(e) => setTituloMaterial(e.target.value)}
          size="small"
          sx={{ width: 250 }}
        />
        <Button variant="contained" component="label">
          Adicionar Material
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleMaterialChange}
          />
        </Button>

        <Button variant="outlined" component="label">
          Gerar questões com IA
          <input
            type="file"
            hidden
            accept=".doc,.docx,.pdf"
            onChange={handleArquivoChange}
          />
        </Button>
      </Stack>
    )}

   {questoesArray.length > 0 && (
  <Box mt={3}>
    <Typography variant="h6" gutterBottom>
      Questões Geradas por IA
    </Typography>

    <Stack spacing={2}>
      {questoesArray.map((questao) => (
        <Box
          key={questao.id}
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: 1,
          }}
        >
          <Typography variant="body1" color="text.primary">
            {questao.texto}
          </Typography>
        </Box>
      ))}
    </Stack>

    <Stack direction="row" spacing={2} mt={3}>
      <Button variant="contained" color="primary" onClick={() => handleAplicarQuiz(questoesArray)}>
        Aplicar como Quiz
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleGerarPdf}>
        Gerar Documento (PDF)
      </Button>
    </Stack>
  </Box>
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

    {tabIndex === 3 && (
      <Box>
        <Typography variant="h6" gutterBottom>
          Video Aulas
        </Typography>

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
              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <TextField
                label="ID do vídeo (Ex: 9PRNZD19KDU)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <TextField
                label="URL da thumbnail"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              <TextField
                label=""
                type="datetime-local"
                value={dataPublicacao}
                onChange={(e) => setDataPublicacao(e.target.value)}
              />
              <TextField
                label="Módulo ID"
                type="number"
                value={moduloId}
                onChange={(e) => setModuloId(Number(e.target.value))}
              />

              <Button variant="contained" onClick={handleAddVideoaula}>
                Cadastrar Video Aula
              </Button>
              {msgVideo && (
                <Typography color="text.secondary">{msgVideo}</Typography>
              )}
            </Stack>
          </Box>
        )}

        {modulos.map((modulo) => {
          const videosDoModulo = videoaulasDoModulo[modulo.id] || [];
          const total = videosDoModulo.length;
          const concluido = videosDoModulo.filter((v) => assistidas.has(v.id)).length;
          const porcentagem = total > 0 ? (concluido / total) * 100 : 0;

          return (
            <Accordion key={modulo.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-content-${modulo.id}`}
                id={`panel-header-${modulo.id}`}
              >
                <Typography variant="h6" color="primary">
                  {modulo.id + " - " + modulo.nome}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Progresso: {concluido} de {total} ({Math.round(porcentagem)}%)
                  </Typography>
                  <LinearProgress variant="determinate" value={porcentagem} />
                </Box>

                <Typography color="text.secondary" gutterBottom>
                  {modulo.descricao}
                </Typography>

                {videosDoModulo.length === 0 ? (
                  <Typography color="text.secondary">
                    Nenhuma videoaula neste módulo.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {videosDoModulo.map((v) => (
                      <Box
                        key={v.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <Typography variant="subtitle1">
                          {v.titulo}
                        </Typography>
                        <Typography color="text.secondary">
                          {v.descricao}
                        </Typography>
                        <Typography variant="body2">
                          Publicado em:{" "}
                          {new Date(v.dataPublicacao).toLocaleString()}
                        </Typography>
                        <ReactPlayer
                          controls
                          width="100%"
                          height="360px"
                          src={`https://www.youtube.com/watch?v=${v.url}`}
                          onEnded={() => handleVideoFinalizado(v.id)}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    )}

    {tabIndex === 4 && session.role === "PROFESSOR" && (
      <Box>
        <Typography variant="h6" gutterBottom>
          Gerenciar Módulos
        </Typography>

        <Typography variant="subtitle1" mt={2}>
          Cadastrar Novo Módulo
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Nome"
            fullWidth
            value={novoModulo.nome}
            onChange={(e) =>
              setNovoModulo((prev) => ({ ...prev, nome: e.target.value }))
            }
          />
          <TextField
            label="Descrição"
            fullWidth
            value={novoModulo.descricao}
            onChange={(e) =>
              setNovoModulo((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
          />
          <TextField
            label="Data Início"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={novoModulo.dataInicio}
            onChange={(e) =>
              setNovoModulo((prev) => ({
                ...prev,
                dataInicio: e.target.value,
              }))
            }
          />
          <TextField
            label="Data Fim"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={novoModulo.dataFim}
            onChange={(e) =>
              setNovoModulo((prev) => ({ ...prev, dataFim: e.target.value }))
            }
          />

          <Button variant="contained" onClick={handleAddModulo}>
            Cadastrar Módulo
          </Button>
          {msgModulo && (
            <Typography color="text.secondary">{msgModulo}</Typography>
          )}
        </Stack>

        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Módulos do Curso
          </Typography>

          {modulos.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum módulo ainda.
            </Typography>
          ) : (
            <Stack spacing={2} mt={2}>
              {modulos.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography fontWeight={600}>{m.nome}</Typography>
                  <Typography color="text.secondary">
                    {m.descricao}
                  </Typography>
                  <Typography variant="body2">
                    {m.dataInicio} até {m.dataFim}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    )}

    {tabIndex === 5 && session.role === "PROFESSOR" && (
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