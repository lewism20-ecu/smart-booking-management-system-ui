import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const localApiTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/v1": {
          target: localApiTarget,
          changeOrigin: true,
          secure: localApiTarget.startsWith("https"),
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
    },
  };
});
