import { useToken } from "./useToken";
import { tokenService } from "@/lib/auth/token";
import { useRouter } from "next/navigation";

export function useAuth() {
  const token = useToken();
  const router = useRouter();

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
    } = {}
  ) => {
    try {
      const token = tokenService.getToken();
      if (!token) {
        handleUnauthorized();
        throw new Error("No authentication token found");
      }

      const { method = "GET", data } = options;
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      // Handle unauthorized responses
      if (response.status === 401 || responseData?.statusCode === 401) {
        handleUnauthorized();
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(
          responseData?.error ||
            `Server error (${response.status}): ${response.statusText}`
        );
      }

      if (!responseData) {
        throw new Error("Empty response from server");
      }

      return responseData;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Session expired")) {
        handleUnauthorized();
      }
      throw error;
    }
  };

  return {
    logout,
    makeAuthenticatedRequest,
    isAuthenticated: !!token,
  };
}
