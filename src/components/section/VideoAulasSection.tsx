import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";
import { useState } from "react";
import {
  CursoDTO,
  ModuloDTO,
  ProgressoDTO,
  VideoAulaDTO,
} from "../types/types";

// ajuste conforme onde você define os tipos

interface Props {
  session: any;
  curso: CursoDTO;
  videoaulasDoModulo: Record<number, VideoAulaDTO[]>;
  modulos: ModuloDTO[];
  setVideoaulasDoModulo: React.Dispatch<
    React.SetStateAction<Record<number, VideoAulaDTO[]>>
  >;
  progresso?: ProgressoDTO;
  videoaulas?: VideoAulaDTO[];
}

export function VideoAulasSection({
  session,
  curso,
  modulos,
  videoaulasDoModulo,
  progresso,
  videoaulas,
}: Props) {
  const [assistidas, setAssistidas] = useState<Set<number>>(new Set());
  const [msgVideo, setMsgVideo] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [url, setUrl] = useState("");
  const [, setDataPublicacao] = useState("");
  const [moduloSelecionado, setModuloSelecionado] = useState<number | "">("");
  const [minutos, setMinutos] = useState<number | "">("");
  const [modulosConcluidos, setModulosConcluidos] = useState<Set<number>>(
    new Set()
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAddVideoaula = () => {
    if (!novoTitulo || !url) {
      setMsgVideo("Título e URL são obrigatórios.");
      return;
    }

    const body = {
      titulo: novoTitulo,
      descricao,
      url,
      dataPublicacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      professorId: session?.idUsuario,
      moduloId: moduloSelecionado,
      minutos,
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
      .then(() => {
        setMsgVideo("Videoaula cadastrada com sucesso!");
        setNovoTitulo("");
        setDescricao("");
        setUrl("");
        setDataPublicacao("");
        setMinutos("");
      })
      .catch(() => {
        setMsgVideo("Erro ao cadastrar videoaula.");
      });
  };

  const handleVideoFinalizado = (videoId: number) => {
    setAssistidas((prev) => {
      const novoSet = new Set(prev);
      novoSet.add(videoId); // marca como assistido

      const totalAulas = videoaulas?.length || 0;

      const aulasConcluidas =
        videoaulas?.filter((v) => novoSet.has(v.id)).length || 0;

      const novaPorcentagem =
        totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;

      // Concluir módulo se todas as aulas foram assistidas
      if (videoaulasDoModulo) {
        Object.entries(videoaulasDoModulo).forEach(([moduloIdStr, aulas]) => {
          const moduloId = Number(moduloIdStr);
          const totalAulasModulo = aulas.length;
          const aulasAssistidasModulo = aulas.filter((v) =>
            novoSet.has(v.id)
          ).length;

          if (
            aulasAssistidasModulo === totalAulasModulo &&
            !modulosConcluidos.has(moduloId)
          ) {
            concluirModulo(moduloId);
            setModulosConcluidos((prev) => new Set(prev).add(moduloId));
          }
        });
      }

      // Atualizar backend com progresso do vídeo assistido
      const moduloRelacionado = Object.entries(videoaulasDoModulo).find(
        ([_, aulas]) => aulas.some((aula) => aula.id === videoId)
      )?.[0];

      if (moduloRelacionado) {
        fetch(`http://localhost:8080/progresso/assistir/${videoId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: progresso?.id,
            alunoId: session?.idUsuario,
            cursoId: curso?.id,
            moduloId: Number(moduloRelacionado),
            dataConclusao: new Date().toISOString(),
            percentualConcluido: novaPorcentagem,
          }),
        }).catch(() => {
          console.error("Erro ao salvar progresso no backend.");
        });
      }

      return novoSet;
    });
  };

  const concluirModulo = async (moduloId: number) => {
    fetch(`http://localhost:8080/progresso/concluirModulo/${moduloId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: progresso?.id,
        alunoId: session?.idUsuario,
        cursoId: curso?.id,
        moduloId: moduloId,
        dataConclusao: new Date().toISOString(),
      }),
    }).catch(() => {
      console.error("Erro ao salvar progresso no backend.");
    });
  };

  return (
    <Box>
      {session.role === "PROFESSOR" && (
        <Box mt={4}>
          <Button
            variant="outlined"
            onClick={() => setMostrarFormulario((prev) => !prev)}
            sx={{ mb: 2 }}
          >
            {mostrarFormulario ? "Cancelar Cadastro" : "Adicionar Video Aula"}
          </Button>
        {mostrarFormulario && (
          <Box>
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
              label="ID do vídeo (YouTube)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="select-modulo-label">Módulo</InputLabel>
              <Select
                labelId="select-modulo-label"
                value={moduloSelecionado}
                label="Módulo"
                onChange={(e) => setModuloSelecionado(Number(e.target.value))}
              >
                {modulos.map((modulo) => (
                  <MenuItem key={modulo.id} value={modulo.id}>
                    {modulo.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleAddVideoaula}>
              Cadastrar Video Aula
            </Button>
            {msgVideo && (
              <Typography color="text.secondary">{msgVideo}</Typography>
            )}
          </Stack>
          </Box>)}
        </Box>
      )}

      {modulos.map((modulo, index) => {
        const videosDoModulo = videoaulasDoModulo[modulo.id] || [];
        const total = videosDoModulo.length;
        const concluido = videosDoModulo.filter((v) =>
          assistidas.has(v.id)
        ).length;
        const porcentagem = total > 0 ? (concluido / total) * 100 : 0;

        return (
          <Accordion key={modulo.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="primary">
                {index + 1 + " - " + modulo.nome}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" gutterBottom>
                {modulo.descricao}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progresso: {concluido} de {total} ({Math.round(porcentagem)}%)
                </Typography>
                <LinearProgress variant="determinate" value={porcentagem} />
              </Box>
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
                      <Typography variant="subtitle1">{v.titulo}</Typography>
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
  );
}
