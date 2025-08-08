// src/components/ModulosSection.tsx

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ModuloDTO } from "../types/types";

type ModulosSectionProps = {
  cursoId: string;
  modulos: ModuloDTO[];
  setModulos: (modulos: ModuloDTO[]) => void;
};

export function ModulosSection({ cursoId, modulos, setModulos }: ModulosSectionProps) {
  const [novoModulo, setNovoModulo] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });

  const [msgModulo, setMsgModulo] = useState("");

  const handleAddModulo = () => {
    if (!novoModulo.nome || !novoModulo.dataInicio || !novoModulo.dataFim) {
      setMsgModulo("Preencha todos os campos obrigatórios.");
      return;
    }

    const body = {
      ...novoModulo,
      cursoId: Number(cursoId),
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
        // Atualiza lista de módulos
        return fetch(`http://localhost:8080/modulos/curso/${cursoId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      })
      .then((res) => res.json())
      .then((data) => setModulos(data))
      .catch(() => setMsgModulo("Erro ao cadastrar módulo."));
  };

  return (
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
            setNovoModulo((prev) => ({ ...prev, descricao: e.target.value }))
          }
        />
        <TextField
          label="Data Início"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={novoModulo.dataInicio}
          onChange={(e) =>
            setNovoModulo((prev) => ({ ...prev, dataInicio: e.target.value }))
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
  );
}
