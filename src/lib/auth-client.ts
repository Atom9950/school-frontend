import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  basePath: "/api/auth",
  credentials: "include", // This is critical for cross-domain cookies
});

export const { signUp, signIn, signOut, useSession } = authClient;