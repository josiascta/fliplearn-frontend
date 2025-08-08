// src/components/section/MateriaisSection.tsx

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface MateriaisSectionProps {
  session: UserAPIResponse;
}

export function MateriaisSection({ session }: MateriaisSectionProps) {
  const [msgGerarQuestoes, setMsgGerarQuestoes] = useState("");

  const handleArquivoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMsgGerarQuestoes("Processando arquivo, aguarde...");

    const formData = new FormData();
    formData.append("arquivo", file);

    try {
      const response = await fetch(
        "http://localhost:8080/api/educational-ai/gerar-questoes-doc",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar questões");
      }

      const resultText = await response.text();
      setMsgGerarQuestoes(resultText);
    } catch (error) {
      setMsgGerarQuestoes("Falha ao gerar questões com IA.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Materiais
      </Typography>
      <Typography color="text.secondary">
        Nenhum material enviado.
      </Typography>

      {session.role === "PROFESSOR" && (
        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <Button variant="contained">Adicionar Material</Button>

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

      {msgGerarQuestoes && (
        <Typography mt={2} color="text.secondary" whiteSpace="pre-line">
          {msgGerarQuestoes}
        </Typography>
      )}
    </Box>
  );
}
