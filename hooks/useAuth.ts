import { useRouter } from "next/navigation";

import { tokenService } from "@/lib/auth/token";

import { useToken } from "./useToken";

export function useAuth() {
  const decodedToken = useToken();
  const router = useRouter();

  const isTokenValid = () => {
    if (!decodedToken) return false;

    // Check if token has expired
    const currentTime = Date.now() / 1000; // Convert to seconds
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
