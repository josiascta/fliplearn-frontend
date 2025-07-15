import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 700 }}>
        404
      </Typography>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Página não encontrada
      </Typography>

      <Typography
        variant="body1"
        sx={{ mb: 4, color: theme.palette.text.secondary }}
      >
        Opa! Parece que essa página não existe ou foi removida.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ borderRadius: "25px", padding: "10px 30px" }}
      >
        Voltar para o início
      </Button>
    </Box>
  );
};
