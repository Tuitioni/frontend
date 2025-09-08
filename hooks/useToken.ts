import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";

import { tokenService } from "@/lib/auth/token";

interface TokenPayload {
  sub: string;
  exp?: number; // Expiration time
  // add other token payload properties if needed
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
