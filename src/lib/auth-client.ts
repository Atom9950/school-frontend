import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  basePath: "/api/auth",
  credentials: "include",
});

// Create a wrapper for sign in that stores the token
export const signIn = {
  email: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    const result = await authClient.signIn.email(credentials);
    
    console.log("Sign in result:", result);
    
    // Store token if present
    if (result && 'data' in result && result.data) {
      const data = result.data as any;
      if (data.token) {
        localStorage.setItem("better_auth_token", data.token);
        console.log("Token stored");
      }
    }
    
    return result;
  },
};

// Create a wrapper for sign out that clears the token
export const signOut = async (options?: any) => {
  localStorage.removeItem("better_auth_token");
  localStorage.removeItem("better_auth_session");
  return authClient.signOut(options);
};

// Export the original signUp
export const { signUp } = authClient;

// Don't export useSession from authClient, we'll use our custom useAuth instead