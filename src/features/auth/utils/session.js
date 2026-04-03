const TOKEN_KEY = "sbms.token";
const USER_KEY = "sbms.user";

function getStorage() {
  return localStorage.getItem(TOKEN_KEY)
    ? localStorage
    : sessionStorage.getItem(TOKEN_KEY)
      ? sessionStorage
      : null;
}

export function getToken() {
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null
  );
}

export function getStoredUser() {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return JSON.parse(storage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function saveSession({ token, user, rememberMe }) {
  clearSession();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
