import { createTheme } from "@mui/material/styles";

// Tema personalizado con los colores de MediSupply
const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8c9eff",
      dark: "#4d5fc1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#9c6ec7",
      dark: "#5a3880",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd1 0%, #654089 100%)",
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
          },
        },
        outlined: {
          borderWidth: "2px",
          borderColor: "#667eea",
          color: "#667eea",
          "&:hover": {
            borderWidth: "2px",
            borderColor: "#667eea",
            backgroundColor: "#f8f9ff",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#667eea",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#667eea",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#667eea",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#667eea",
          "&.Mui-checked": {
            color: "#667eea",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#555",
          fontWeight: 500,
          "&.Mui-focused": {
            color: "#667eea",
          },
        },
      },
    },
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
});

export default theme;
