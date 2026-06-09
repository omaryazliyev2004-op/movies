import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6c8fff",
      light: "#94b0ff",
      dark: "#4a6be0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f5c518",
      light: "#ffd54f",
      dark: "#d4a800",
      contrastText: "#000000",
    },
    background: {
      default: "#0a0c1b",
      paper: "#161929",
    },
    text: {
      primary: "#f0f0f5",
      secondary: "#9ca3af",
      disabled: "#6b7280",
    },
    error: { main: "#ff6b6b" },
    success: { main: "#43e97b" },
    warning: { main: "#f5c518" },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.02em" },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, color: "#9ca3af" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0a0c1b",
          scrollbarWidth: "thin",
          scrollbarColor: "#6c8fff #111327",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#111327" },
          "&::-webkit-scrollbar-thumb": {
            background: "#6c8fff",
            borderRadius: "3px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { transform: "translateY(-1px)" },
        },
        contained: {
          boxShadow: "0 4px 14px rgba(108,143,255,0.35)",
          "&:hover": { boxShadow: "0 6px 20px rgba(108,143,255,0.5)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#161929",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-6px)",
            border: "1px solid rgba(108,143,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(108,143,255,0.1)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.04)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(108,143,255,0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#6c8fff" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#161929",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(10, 12, 27, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.95rem",
          minWidth: "auto",
          padding: "10px 20px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.04)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#161929",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "0.8rem",
          fontWeight: 500,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: "rgba(255,255,255,0.06)" },
        wave: {
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: "rgba(255,255,255,0.06)" },
        bar: { borderRadius: 4 },
      },
    },
  },
});

export default theme;
