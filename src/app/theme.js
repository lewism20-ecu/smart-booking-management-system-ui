import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: ["Poppins", "Segoe UI", "Tahoma", "Arial", "sans-serif"].join(
      ",",
    ),
  },
  shape: {
    borderRadius: 14,
  },
};

export const getTheme = (mode) =>
  createTheme({
    ...baseTheme,
    palette: {
      mode,
      primary: {
        main: "#2f60ea",
      },
      ...(mode === "light"
        ? {
            background: {
              default: "#f3f4f8",
              paper: "#ffffff",
            },
            text: {
              primary: "#111827",
              secondary: "#6b7280",
            },
          }
        : {
            background: {
              default: "#22272e", // GitHub Dark Dimmed background
              paper: "#2d333b", // GitHub Dark Dimmed surface
            },
            text: {
              primary: "#cdd9e5", // Brightened for better readability (GitHub Dark standard is #c9d1d9)
              secondary: "#909dab", // Lightened from #768390 for better contrast
            },
          }),
    },
  });
