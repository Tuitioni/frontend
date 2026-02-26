import Cookies from 'js-cookie';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { tokenService } from '../token';

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('tokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set a token cookie', () => {
    tokenService.setToken('test-token');
    expect(Cookies.set).toHaveBeenCalledWith('access_token', 'test-token', {
      path: '/',
      secure: false,
      sameSite: 'strict',
    });
  });

  it('should get a token', () => {
    vi.mocked(Cookies.get).mockReturnValue('test-token' as never);
    expect(tokenService.getToken()).toBe('test-token');
  });

  it('should remove a token', () => {
    tokenService.removeToken();
    expect(Cookies.remove).toHaveBeenCalledWith('access_token', { path: '/' });
  });

  it('should return auth header when token exists', () => {
    vi.mocked(Cookies.get).mockReturnValue('test-token' as never);
    expect(tokenService.getAuthHeader()).toEqual({
      Authorization: 'Bearer test-token',
    });
  });

  it('should return empty object when no token', () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined as never);
    expect(tokenService.getAuthHeader()).toEqual({});
  });
});
