import { useMemo, useState } from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { router } from "./app/router";
import { getTheme } from "./app/theme";
import { ColorModeContext } from "./app/ColorModeContext";

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("app_theme_mode");
    if (savedMode) return savedMode;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => {
          const nextMode = prev === "light" ? "dark" : "light";
          localStorage.setItem("app_theme_mode", nextMode);
          return nextMode;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={(t) => ({
            body: {
              background:
                t.palette.mode === "light"
                  ? "radial-gradient(circle at 20% 20%, #f9f9fd 0%, #f3f4f8 55%, #edf0f7 100%)"
                  : "radial-gradient(circle at 20% 20%, #13161f 0%, #0f1117 55%, #0b0d14 100%)",
            },
          })}
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
