import Cookies from 'js-cookie';

const TOKEN_KEY = 'access_token';

export const tokenService = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken() {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken() {
    Cookies.remove(TOKEN_KEY, { path: '/' });
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}; 