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
    
    console.log("Full sign in result:", result);
    console.log("Result keys:", result ? Object.keys(result) : 'null');
    console.log("Result data:", result?.data);
    
    // Better Auth returns the full response including headers with Set-Cookie
    // The session token comes from the response or session data
    if (result && 'data' in result && result.data) {
      const data = result.data as any;
      console.log("Data keys:", Object.keys(data));
      console.log("Data content:", data);
      
      // Try multiple ways to get the token
      if (data.token) {
        localStorage.setItem("better_auth_token", data.token);
        console.log("Token stored from data.token");
      } else if (data.session?.token) {
        localStorage.setItem("better_auth_token", data.session.token);
        console.log("Token stored from data.session.token");
      } else if (data.user?.id) {
        // If we have user but no explicit token, we need to fetch one
        console.log("User found but no token in response - fetching session");
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
