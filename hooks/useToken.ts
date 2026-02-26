import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';

import { tokenService } from '@/lib/auth/token';

interface TokenPayload {
  sub: string;
  exp?: number;
}

export function useToken() {
  const token = tokenService.getToken();

  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      return null;
    }
  }, [token]);

  return decodedToken;
}
