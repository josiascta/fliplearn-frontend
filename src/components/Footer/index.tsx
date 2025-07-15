import { Box, IconButton, Typography, useTheme } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(3),
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: "auto",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        <IconButton
          aria-label="Instagram"
          href="https://instagram.com/seuperfil"
          target="_blank"
          rel="noopener"
          sx={{ color: theme.palette.primary.main }}
        >
          <InstagramIcon />
        </IconButton>

        <IconButton
          aria-label="GitHub"
          href="https://github.com/seurepo"
          target="_blank"
          rel="noopener"
          sx={{ color: theme.palette.primary.main }}
        >
          <GitHubIcon />
        </IconButton>

        <IconButton
          aria-label="X"
          href="https://x.com/seuperfil"
          target="_blank"
          rel="noopener"
          sx={{ color: theme.palette.primary.main }}
        >
          <XIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        © {new Date().getFullYear()} FlipLearn. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};
