import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2f60ea",
    },
    background: {
      default: "#f3f4f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Segoe UI", "Tahoma", "Arial", "sans-serif"].join(
      ",",
    ),
  },
  shape: {
    borderRadius: 14,
  },
});
