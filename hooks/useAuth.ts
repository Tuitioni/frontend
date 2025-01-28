import { useRouter } from 'next/navigation';
import { tokenService } from '@/lib/auth/token';

export function useAuth() {
  const router = useRouter();

  const logout = async () => {
    try {
      // Clear token from cookies
      tokenService.removeToken();
      
      // Clear any other stored data if needed
      localStorage.clear();
      sessionStorage.clear();
      
      // Force reload to clear any cached states
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to simple redirect
      router.push('/login');
    }
  };

  const makeAuthenticatedRequest = async (
    endpoint: string, 
    options: { 
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
    } = {}
  ) => {
    try {
      const token = tokenService.getToken();
      if (!token) {
        logout();
        throw new Error('No authentication token found');
      }

      const { method = 'GET', data } = options;
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Session expired');
        }
        throw new Error(responseData?.error || `Server error (${response.status}): ${response.statusText}`);
      }

      if (!responseData) {
        throw new Error('Empty response from server');
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  };

  return {
    logout,
    makeAuthenticatedRequest,
    isAuthenticated: !!tokenService.getToken(),
  };
} 