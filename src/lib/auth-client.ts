import { createAuthClient } from "better-auth/react";

const TOKEN_KEY = "better_auth_token";
const SESSION_KEY = "better_auth_session";

// Helper functions for token management
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
};

const getStoredSession = (): any => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

const setStoredSession = (session: any): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to store session:", error);
  }
};

const clearStorage = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
};

// Create the auth client
const baseAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  basePath: "/api/auth",
  credentials: "include",
});

// Wrap signIn to store tokens
const wrappedSignIn = {
  ...baseAuthClient.signIn,
  email: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      const result = await baseAuthClient.signIn.email(credentials);
      
      console.log("Sign in result:", result);
      
      // Check if sign in was successful
      if (result && 'data' in result && result.data) {
        const data = result.data as any;
        
        // Store token if present
        if (data.session?.token) {
          setStoredToken(data.session.token);
          setStoredSession(data.session);
          console.log("Token stored successfully");
        } else if (data.token) {
          setStoredToken(data.token);
          if (data.session) {
            setStoredSession(data.session);
          }
          console.log("Token stored successfully");
        } else {
          console.log("No token in response, relying on cookies");
        }
      }
      
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },
};

// Wrap signOut to clear storage
const wrappedSignOut = async (options?: any) => {
  clearStorage();
  return baseAuthClient.signOut(options);
};

// Export wrapped client
export const authClient = {
  ...baseAuthClient,
  signIn: wrappedSignIn,
  signOut: wrappedSignOut,
};

export const { signUp, useSession } = baseAuthClient;
export const signIn = wrappedSignIn;
export const signOut = wrappedSignOut;

// Export helper to manually clear auth
export const clearAuth = clearStorage;