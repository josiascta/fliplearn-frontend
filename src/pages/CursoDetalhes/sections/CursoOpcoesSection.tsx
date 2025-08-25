// src/components/CursoOpcoesSection.tsx

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AlunoDTO } from "../../../components/types/types";

type CursoOpcoesSectionProps = {
  cursoId: string;
};

export function CursoOpcoesSection({ cursoId }: CursoOpcoesSectionProps) {
  const [emailAluno, setEmailAluno] = useState("");
  const [alunoEncontrado, setAlunoEncontrado] = useState<AlunoDTO | null>(null);
  const [buscarErro, setBuscarErro] = useState("");
  const [adicionarMsg, setAdicionarMsg] = useState("");
  const [alunosCurso, setAlunosCurso] = useState<any[]>([]);

  const buscarAlunoPorEmail = () => {
    if (!emailAluno.trim()) return;

    fetch(
      `http://localhost:8080/aluno/email/${encodeURIComponent(emailAluno)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Aluno não encontrado");
        return res.json();
      })
      .then((data) => {
        setAlunoEncontrado(data);
        setBuscarErro("");
      })
      .catch(() => {
        setAlunoEncontrado(null);
        setBuscarErro("Aluno não encontrado.");
      });
  };

  const handleAddAluno = () => {
    if (!alunoEncontrado) return;

    fetch(
      `http://localhost:8080/cursos/${cursoId}/alunos/${alunoEncontrado.idUsuario}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setAdicionarMsg("Aluno adicionado com sucesso.");
          setEmailAluno("");
          setAlunoEncontrado(null);
          fetchAlunos(); // Atualizar lista
        } else {
          throw new Error("Erro ao adicionar aluno.");
        }
      })
      .catch(() => {
        setAdicionarMsg("Erro ao adicionar aluno.");
      });
  };

  const fetchAlunos = () => {
    fetch(`http://localhost:8080/cursos/${cursoId}/alunos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAlunosCurso(data))
      .catch((err) => console.error("Erro ao buscar alunos do curso:", err));
  };

  useEffect(() => {
    fetchAlunos();
  }, [cursoId]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Opções do Curso
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <TextField
          label="E-mail do Aluno"
          value={emailAluno}
          onChange={(e) => setEmailAluno(e.target.value)}
          size="small"
        />
        <Button variant="outlined" onClick={buscarAlunoPorEmail}>
          Buscar
        </Button>
      </Stack>

      {buscarErro && (
        <Typography color="error" mt={2}>
          {buscarErro}
        </Typography>
      )}

      {alunoEncontrado && (
        <Box mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
          <Typography>
            <strong>ID:</strong> {alunoEncontrado.idUsuario}
          </Typography>
          <Typography>
            <strong>Nome:</strong> {alunoEncontrado.nome}
          </Typography>
          <Typography>
            <strong>Email:</strong> {alunoEncontrado.email}
          </Typography>

          <Button variant="contained" onClick={handleAddAluno} sx={{ mt: 2 }}>
            Confirmar Adição
          </Button>
        </Box>
      )}

      {adicionarMsg && (
        <Typography mt={2} color="text.secondary">
          {adicionarMsg}
        </Typography>
      )}

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Alunos Matriculados
        </Typography>

        {alunosCurso.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum aluno matriculado ainda.
          </Typography>
        ) : (
          <Stack spacing={1} mt={2}>
            {alunosCurso.map((aluno) => (
              <Box
                key={aluno.id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography fontWeight={600}>{aluno.nome}</Typography>
                <Typography color="text.secondary">{aluno.email}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
