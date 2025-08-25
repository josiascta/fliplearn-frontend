// src/components/RankingSection.tsx

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { RankingDTO } from "../../../components/types/types";

type RankingSectionProps = {
  cursoId: string;
};

export function RankingSection({ cursoId }: RankingSectionProps) {
  const [ranking, setRanking] = useState<RankingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarRanking = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/progresso/${cursoId}/ranking`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar o ranking");
        }
        const data = await response.json();
        setRanking(data);
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    carregarRanking();
  }, [cursoId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (erro) {
    return <Typography color="error">{erro}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ranking do Curso
      </Typography>
      {ranking.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma pontuação registrada ainda.
        </Typography>
      ) : (
        <List>
          {ranking.map((aluno, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemText
                  primary={`${index + 1}º Lugar - ${aluno?.nomeAluno}`}
                  secondary={`Progresso: ${aluno.porcentagemProgresso} %`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}
