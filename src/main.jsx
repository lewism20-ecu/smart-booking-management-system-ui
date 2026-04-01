import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { appConfig } from "./config/appConfig";

async function enableMocks() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

if (appConfig.enableMockWorker) {
  await enableMocks();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
