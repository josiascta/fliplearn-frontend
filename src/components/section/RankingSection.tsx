// src/components/section/RankingSection.tsx

import { Box, Typography } from "@mui/material";

export function RankingSection() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ranking
      </Typography>
      <Typography color="text.secondary">
        Ranking não disponível.
      </Typography>
    </Box>
  );
}
