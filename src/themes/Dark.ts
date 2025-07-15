import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2979FF",
      light: "#75A7FF",
      dark: "#004ECF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#708238", // Verde oliva
      light: "#A0B46E",
      dark: "#4B5A25",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0D1B2A", // Azul bem escuro
      paper: "#15273F", // Azul escuro para o paper também
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#A0A0A0",
    },
    error: { main: "#EF5350" },
    warning: { main: "#FFB74D" },
    info: { main: "#64B5F6" },
    success: { main: "#81C784" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontSize: "3rem", fontWeight: 700 },
    h2: { fontSize: "2.5rem", fontWeight: 700 },
    h3: { fontSize: "2rem", fontWeight: 600 },
    h4: { fontSize: "1.75rem", fontWeight: 600 },
    h5: { fontSize: "1.5rem", fontWeight: 600 },
    h6: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "25px",
          padding: "10px 20px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #B0B0B0",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
        },
      },
    },
  },
});

export default darkTheme;
