import Header from "./Header";
import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Box } from "@mui/material";

export function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Box component="main" sx={{ flex: 1, px: 2 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
