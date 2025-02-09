import { useToken } from "./useToken";
import { tokenService } from "@/lib/auth/token";
import { useRouter } from "next/navigation";

export function useAuth() {
  const decodedToken = useToken();
  const router = useRouter();

  const isTokenValid = () => {
    if (!decodedToken) return false;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp > currentTime : false;
  };

  const logout = () => {
    tokenService.removeToken();
    router.push("/login");
  };

  const handleUnauthorized = () => {
    console.log("Unauthorized - redirecting to login");
    logout();
  };

  const makeAuthenticatedRequest = async (
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
      data?: any;
      headers?: HeadersInit;
      isFormData?: boolean;
    } = {}
  ) => {
    try {
      const token = tokenService.getToken();
      console.log(token);
      if (!token || !isTokenValid()) {
        handleUnauthorized();
        throw new Error("Invalid or expired authentication token");
      }

      const { method = "GET", data, isFormData = false } = options;

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      };

      const response = await fetch(endpoint, {
        method,
        headers,
        body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Session expired") ||
          error.message.includes("Invalid or expired authentication token"))
      ) {
        handleUnauthorized();
      }
      throw error;
    }
  };

  return {
    logout,
    makeAuthenticatedRequest,
    isAuthenticated: !!decodedToken && isTokenValid(),
  };
}
