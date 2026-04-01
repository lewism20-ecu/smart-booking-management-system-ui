import { appConfig } from "../../../config/appConfig";

export function getBaseUrl() {
  return appConfig.authMode === "mock"
    ? appConfig.mockBaseUrl
    : appConfig.apiBaseUrl;
}

export async function login({ email, password }) {
  let response;

  try {
    response = await fetch(`${getBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      `Could not reach API at ${getBaseUrl()}. Check that your backend is running and reachable.`,
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Login failed.");
  }

  return payload;
}

export async function signup({ email, password }) {
  let response;

  try {
    response = await fetch(`${getBaseUrl()}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      `Could not reach API at ${getBaseUrl()}. Check that your backend is running and reachable.`,
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Sign up failed.");
  }

  return payload;
}
