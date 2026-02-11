import { createAuthClient } from "better-auth/react";

// Store and retrieve session token from localStorage
const getSessionToken = () => {
  try {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

const setSessionToken = (token: any) => {
  localStorage.setItem("session", JSON.stringify(token));
};

const clearSessionToken = () => {
  localStorage.removeItem("session");
};

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  basePath: "/api/auth",
  credentials: "include",
  // Add session token to requests
  advanced: {
    customFetchImpl: async (url: string, options: RequestInit = {}) => {
      const session = getSessionToken();
      const headers: HeadersInit = {
        ...(options.headers as Record<string, string>),
        ...(session && { Authorization: `Bearer ${session.token}` }),
      };
      return fetch(url, { ...options, headers });
    },
  },
});

// Intercept sign-in to store session
const originalSignIn = authClient.signIn.email;
authClient.signIn.email = async (credentials) => {
  const result = await originalSignIn(credentials);
  if (result && !("error" in result)) {
    setSessionToken(result);
  }
  return result;
};

// Clear session on sign-out
const originalSignOut = authClient.signOut;
authClient.signOut = async () => {
  clearSessionToken();
  return originalSignOut();
};

export const { signUp, signIn, signOut, useSession } = authClient;