import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2979FF",
      light: "#75A7FF",
      dark: "#004ECF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#708238",
      dark: "#4B5A25",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#555555",
    },
    error: { main: "#E53935" },
    warning: { main: "#FB8C00" },
    info: { main: "#0288D1" },
    success: { main: "#43A047" },
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
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #FFFFFF",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
        },
      },
    },
  },
});

export default lightTheme;
