import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../../../hooks/useAuth";

type Aviso = {
  id?: number;
  conteudo: string;
  data: Date;
  professorId: number;
  cursoId: number;
};

type AvisosSectionProps = {
  cursoId: string;
};

export function AvisosSection({ cursoId }: AvisosSectionProps) {
  const { session } = useAuth();

  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [novoAviso, setNovoAviso] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const professorId = Number(session?.idUsuario);

  useEffect(() => {
    fetchAvisos();
  }, [cursoId]);

  const fetchAvisos = async () => {
    console.log(cursoId);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/avisos/ordenado/${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os avisos.");
      }
      const data = await response.json();
      setAvisos(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAviso = async () => {
    if (!novoAviso.trim()) {
      setSnackbarMessage("O conteúdo do aviso não pode estar vazio.");
      setSnackbarOpen(true);
      return;
    }

    setIsAdding(true);
    try {
      const aviso: Aviso = {
        conteudo: novoAviso,
        data: new Date(),
        professorId: professorId,
        cursoId: Number(cursoId),
      };

      const response = await fetch("http://localhost:8080/avisos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(aviso),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar o aviso.");
      }

      setNovoAviso("");
      await fetchAvisos();
      setSnackbarMessage("Aviso adicionado com sucesso!");
      setSnackbarOpen(true);
    } catch (error: any) {
      setError("Falha ao adicionar aviso: " + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAviso = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/avisos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir o aviso.");
      }

      await fetchAvisos();
      setSnackbarMessage("Aviso excluído com sucesso!");
      setSnackbarOpen(true);
    } catch (error: any) {
      setError("Falha ao excluir aviso: " + error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Avisos
      </Typography>

      {session?.role === "PROFESSOR" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <TextField
            label="Adicionar novo aviso"
            variant="outlined"
            fullWidth
            value={novoAviso}
            onChange={(e) => setNovoAviso(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAddAviso}
            disabled={isAdding}
            endIcon={<AddCircleOutlineIcon />}
          >
            {isAdding ? "Adicionando..." : "Adicionar"}
          </Button>
        </Box>
      )}

      {loading && <Typography>Carregando avisos...</Typography>}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && avisos.length === 0 && (
        <Typography color="text.secondary">Nenhum aviso disponível.</Typography>
      )}

      {!loading && avisos.length > 0 && (
        <List>
          {avisos.map((aviso) => (
            <ListItem
              key={aviso.id}
              secondaryAction={
                session?.role === "PROFESSOR" && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteAviso(aviso.id!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={aviso.conteudo}
                secondary={`Publicado em: ${new Date(aviso.data).toLocaleString(
                  "pt-BR"
                )}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}
