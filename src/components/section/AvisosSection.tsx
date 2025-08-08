// src/components/AvisosSection.tsx

import { Box, Typography } from "@mui/material";

type AvisosSectionProps = {
  cursoId: string;
};

export function AvisosSection({ cursoId }: AvisosSectionProps) {
  // Futuramente você pode usar o cursoId para buscar os avisos do backend

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Avisos
      </Typography>
      <Typography color="text.secondary">
        Nenhum aviso disponível.
      </Typography>
    </Box>
  );
}
