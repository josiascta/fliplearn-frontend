import { Box, CircularProgress, Typography } from "@mui/material";

export function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      flexDirection="column"
      bgcolor="background.default"
    >
      <CircularProgress color="primary" />
      <Typography
        mt={2}
        color="text.secondary"
        fontWeight={500}
        fontSize="0.9rem"
      >
        Carregando...
      </Typography>
    </Box>
  );
}
