import { useMemo } from "react";
import { tokenService } from "@/lib/auth/token";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  exp?: number; // Expiration time
  iat?: number; // Issued at time
  email?: string; // User email
  role?: string; // User role
}

export function useToken() {
  const token = tokenService.getToken();

  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, [token]);

  return decodedToken;
}
