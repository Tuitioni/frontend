'use client';

import { jwtDecode } from 'jwt-decode';
import { useCallback } from 'react';

import { useAuth } from '@/contexts/AuthContext';

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
}

export function useAuthFetch() {
  const { logout } = useAuth();

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          logout();
          throw new Error('No authentication token found');
        }

        try {
          const decodedToken = jwtDecode<JWTPayload>(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            logout();
            throw new Error('Token has expired');
          }
        } catch (error) {
          logout();
          throw new Error('Invalid token');
        }

        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            throw new Error('Session expired');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      } catch (error: any) {
        if (error.message.includes('token') || error.message.includes('Session expired')) {
          logout();
        }
        throw error;
      }
    },
    [logout]
  );

  return { fetchWithAuth };
}
