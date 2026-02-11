import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  basePath: "/api/auth",
  credentials: "include",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;