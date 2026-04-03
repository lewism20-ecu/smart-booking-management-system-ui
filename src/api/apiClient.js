import { appConfig } from "../config/appConfig";
import { getToken, clearSession } from "../features/auth/utils/session";

export function getBaseUrl() {
  return appConfig.authMode === "mock"
    ? appConfig.mockBaseUrl
    : appConfig.apiBaseUrl;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (response.status === 401) {
    clearSession();
    window.location.href = "/login";
    throw new Error("Session expired. Please sign in again.");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}
