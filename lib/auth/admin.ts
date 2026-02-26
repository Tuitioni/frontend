import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
}

export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      window.location.href = '/signin';
      return false;
    }

    try {
      const decodedToken = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('admin_token');
        window.location.href = '/signin';
        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem('admin_token');
      window.location.href = '/signin';
      return false;
    }
  }
  return false;
};

export const handleTokenError = (error: any) => {
  if (error.message === 'Invalid token' || error.message === 'jwt expired') {
    localStorage.removeItem('admin_token');
    window.location.href = '/signin';
  }
};
