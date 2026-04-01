const defaultApiBaseUrl = "/api/v1";
const defaultMockBaseUrl = "/mock-api/v1";

const authMode = import.meta.env.VITE_AUTH_MODE === "mock" ? "mock" : "api";

export const appConfig = {
  authMode,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
  mockBaseUrl: import.meta.env.VITE_MOCK_BASE_URL || defaultMockBaseUrl,
  enableMockWorker:
    authMode === "mock" && import.meta.env.VITE_ENABLE_MOCK_WORKER !== "false",
};
