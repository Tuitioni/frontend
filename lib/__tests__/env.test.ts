import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env validation', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return the env var value when set', async () => {
    vi.stubEnv('TUITIONI_API', 'http://localhost:8000');
    const { env } = await import('../env');
    expect(env.TUITIONI_API).toBe('http://localhost:8000');
  });

  it('should throw when TUITIONI_API is missing', async () => {
    vi.stubEnv('TUITIONI_API', '');
    const { env } = await import('../env');
    expect(() => env.TUITIONI_API).toThrow('Missing required environment variable');
  });

  it('should trim whitespace from env vars', async () => {
    vi.stubEnv('TUITIONI_API', ' http://localhost:8000 ');
    const { env } = await import('../env');
    expect(env.TUITIONI_API).toBe('http://localhost:8000');
  });
});
