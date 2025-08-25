import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  Stack, TextField, Typography 
} from "@mui/material";
import React, { useState } from "react";
import { ListaMateriais } from "./ListaMateriais";
import jsPDF from "jspdf";
import { Delete } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import { DeleteIcon } from "lucide-react";

interface MateriaisSectionProps {
  session: UserAPIResponse;
}

export function MateriaisSection({ session }: MateriaisSectionProps) {
  const [msgGerarQuestoes, setMsgGerarQuestoes] = useState("");
  const [titulo, setTitulo] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoQuestao, setTipoQuestao] = useState<"alternativas" | "abertas" | null>(null);
  const [questoes, setQuestoes] = useState<string[]>([]);

  const handleArquivoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!tipoQuestao) {
      alert("Escolha o tipo de questão antes.");
      return;
    }

    setMsgGerarQuestoes(`Processando arquivo para ${tipoQuestao}, aguarde...`);

    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("tipo", tipoQuestao);

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

      let linhas = resultText
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q !== "");

      // Remove linha de introdução da IA, se existir
      if (linhas.length > 0 && linhas[0].startsWith("Aqui estão")) {
        linhas = linhas.slice(1);
      }

      setQuestoes(linhas);
      setMsgGerarQuestoes("");
      setOpenDialog(false);
      // Não zera tipoQuestao aqui
    } catch (error) {
      console.error(error);
      setMsgGerarQuestoes("Falha ao gerar questões com IA.");
    }
  };

  const handleArquivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMsgGerarQuestoes("Processando arquivo, aguarde...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("titulo", titulo);

    try {
      const response = await fetch(
        "http://localhost:8080/api/arquivos/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const data = await response.json();
      console.log("Upload concluído:", data);
      setMsgGerarQuestoes("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error(error);
      setMsgGerarQuestoes("Falha ao gerar questões com IA.");
    }
  };

  const atualizarQuestao = (index: number, novoValor: string) => {
    const novasQuestoes = [...questoes];
    novasQuestoes[index] = novoValor;
    setQuestoes(novasQuestoes);
  };

const gerarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(titulo || "Questões", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Professor(a): ${session.nome}`, 10, 30);
  doc.text("Aluno(a): ___________________", 10, 36);

  let yPos = 45;
  const lineHeight = 7;
  const maxY = 280;

  questoes.forEach((q) => {
    // Remove a parte da resposta (ex: "(A)" ou "Resposta: X")
    const textoSemResposta = q.replace(/\(.*\)/, "").replace(/Resposta: .*/, "").trim();

    if (!textoSemResposta) return;

    const linhas = doc.splitTextToSize(textoSemResposta, 180);
    if (yPos + linhas.length * lineHeight > maxY) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(linhas, 10, yPos);
    yPos += linhas.length * lineHeight + 2;
  });

  doc.save("questoes.pdf");
};


  const gerarPDFComGabarito = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(titulo || "Questões", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Professor(a): ${session.nome}`, 10, 30);
    doc.text("Aluno(a): ___________________", 10, 36);

    let yPos = 45;
    const lineHeight = 7;
    const maxY = 280;

    questoes.forEach((q) => {
      const linhas = doc.splitTextToSize(q, 180);
      if (yPos + linhas.length * lineHeight > maxY) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(linhas, 10, yPos);
      yPos += linhas.length * lineHeight + 2;
    });

    doc.save("questoes_gabarito.pdf");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Materiais
      </Typography>
      <Typography color="text.secondary">Nenhum material enviado.</Typography>

      {session.role === "PROFESSOR" && (
        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <TextField
            label="Título do Arquivo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Button
            variant="contained"
            component="label"
            sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
          >
            Adicionar Material
            <input type="file" hidden accept=".doc,.docx,.pdf" onChange={handleArquivo} />
          </Button>

          <Button
            variant="outlined"
            sx={{ color: "#1976d2", borderColor: "#1976d2" }}
            onClick={() => setOpenDialog(true)}
          >
            Gerar questões com IA
          </Button>
        </Stack>
      )}

     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Escolha o tipo de questão</DialogTitle>
  <DialogContent>
    <Stack direction="column" spacing={2} mt={1}>
      <Button
        variant={tipoQuestao === "alternativas" ? "contained" : "outlined"}
        onClick={() => setTipoQuestao("alternativas")}
      >
        Questões com alternativas
      </Button>
      <Button
        variant={tipoQuestao === "abertas" ? "contained" : "outlined"}
        onClick={() => setTipoQuestao("abertas")}
      >
        Questões abertas
      </Button>

      {tipoQuestao && (
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#6a5acd", // roxo azulado
            "&:hover": { backgroundColor: "#5848b0" },
          }}
        >
          Selecionar arquivo
          <input
            type="file"
            hidden
            accept=".doc,.docx,.pdf"
            onChange={(e) => {
              setMsgGerarQuestoes("Aguardando Questões..."); // exibe mensagem
              handleArquivoChange(e); // chama o método existente
            }}
          />
        </Button>
      )}
    </Stack>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
  </DialogActions>
</Dialog>


      {questoes.length > 0 && (
  <Box mt={2} p={2} border="1px solid #ccc" borderRadius="8px" bgcolor="#f9f9f9">
    {/* Título dentro do quadrado */}
    <Box mb={2}>
      <Typography variant="subtitle2" mb={0.5}>
        Título da Atividade
      </Typography>
      <TextField
        label=""
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        fullWidth
      />
    </Box>

    <Typography variant="subtitle1" gutterBottom>
      Questões Geradas:
    </Typography>

   {questoes.map((linha, i) => (
  <Stack key={i} direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
    <TextField
      fullWidth
      multiline
      value={linha}
      onChange={(e) => atualizarQuestao(i, e.target.value)}
    />
    <IconButton
      color="error"
      onClick={() => {
        const novasQuestoes = questoes.filter((_, index) => index !== i);
        setQuestoes(novasQuestoes);
      }}
    >
      <DeleteIcon />
    </IconButton>
  </Stack>
))}

    <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#5c6bc0",
          color: "#fff",
          "&:hover": { backgroundColor: "#3949ab" },
        }}
        onClick={gerarPDF}
      >
        Gerar PDF
      </Button>

      {tipoQuestao === "alternativas" && (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#7e57c2",
            color: "#fff",
            "&:hover": { backgroundColor: "#5e35b1" },
          }}
          onClick={gerarPDFComGabarito}
        >
          Gerar PDF com Gabarito
        </Button>
      )}

      {/* Botão para adicionar pergunta ou alternativa */}
      <Button
        variant="outlined"
        sx={{
          borderColor: "#5c6bc0",
          color: "#5c6bc0",
          "&:hover": { backgroundColor: "#e8eaf6", borderColor: "#3949ab" },
        }}
        onClick={() => setQuestoes([...questoes, ""])}
      >
        Adicionar Pergunta/Alternativa
      </Button>
    </Stack>
  </Box>
)}


      <ListaMateriais />
    </Box>
  );
}
